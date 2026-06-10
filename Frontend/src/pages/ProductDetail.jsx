import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import CartDrawer from "../components/CartDrawer";
import SizeSelector from "../components/SizeSelector";
import StarRating from "../components/StarRating";
import { DetailSkeleton } from "../components/Skeleton";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = Link; // To use Link router
  const addToast = useToastStore((state) => state.addToast);
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection state
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Accordion tabs state
  const [openTab, setOpenTab] = useState("description");

  const token = localStorage.getItem("maverick_token");
  const userStr = localStorage.getItem("maverick_user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${slug}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0]);
        }

        // Fetch reviews
        const reviewsRes = await API.get(`/reviews/${res.data._id}`);
        setReviews(reviewsRes.data);

        // Fetch wishlist status
        if (token) {
          const wishlistRes = await API.get("/wishlist");
          setWishlistItems(wishlistRes.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      addToast("ITEM IS OUT OF STOCK", "error");
      return;
    }
    if (!selectedSize) {
      addToast("PLEASE SELECT A SIZE", "error");
      return;
    }

    // Add to Zustand cart store
    addItem(product, selectedSize, "", 1);
    addToast("ADDED TO BAG", "success");
  };

  const isWishlisted = product && wishlistItems.some((item) => item._id === product._id);

  const handleWishlistToggle = async () => {
    if (!token) {
      addToast("Please login to manage wishlist.", "error");
      return;
    }

    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`);
        addToast("REMOVED FROM WISHLIST", "success");
        // Update local status
        setWishlistItems(wishlistItems.filter(item => item._id !== product._id));
      } else {
        await API.post("/wishlist", { productId: product._id });
        addToast("ADDED TO WISHLIST", "success");
        setWishlistItems([...wishlistItems, product]);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      addToast("Failed to update wishlist", "error");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewBody) return;

    setSubmittingReview(true);
    try {
      const res = await API.post("/reviews", {
        productId: product._id,
        rating: reviewRating,
        body: reviewBody
      });
      addToast("REVIEW SUBMITTED SUCCESSFULLY", "success");
      setReviews([res.data.review, ...reviews]);
      setReviewBody("");
      setReviewRating(5);
    } catch (error) {
      console.error("Submit review failed:", error);
      addToast("Failed to submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
        <Navbar />
        <div className="container" style={{ padding: "80px 24px" }}>
          <DetailSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
        <Navbar />
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px"
        }}>
          <h1 style={{ fontSize: "3rem", color: "var(--ember)", marginBottom: "16px" }}>404</h1>
          <p className="font-mono" style={{ color: "var(--dust)", fontSize: "1.1rem" }}>
            This page doesn't exist. Neither do trends.
          </p>
          <Link to="/shop" className="btn btn-ghost" style={{ marginTop: "24px" }}>
            BACK TO SHOP
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <CartDrawer />
      <Toast />

      <div className="container" style={{ padding: "60px 24px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }} className="detail-split">
          
          {/* Left Column: Images */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Main Image */}
            <div style={{
              height: "550px",
              border: "1px solid var(--ash)",
              overflow: "hidden",
              backgroundColor: "var(--ash)"
            }}>
               <img
                src={selectedImage ? `https://e-commerce-follow-along-iurp.onrender.com${selectedImage}` : "https://placehold.co/600x800/2A2A2A/E8E2D9?text=MAVERICK"}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x800/2A2A2A/E8E2D9?text=MAVERICK";
                }}
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: "80px",
                      height: "100px",
                      border: selectedImage === img ? "1px solid var(--ember)" : "1px solid var(--ash)",
                      overflow: "hidden",
                      cursor: "pointer",
                      backgroundColor: "var(--ash)"
                    }}
                  >
                    <img
                      src={`https://e-commerce-follow-along-iurp.onrender.com${img}`}
                      alt={`${product.name} thumbnail ${idx}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              {product.category && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--ember)" }}>
                  {product.category.name}
                </span>
              )}
              <h1 style={{ fontSize: "3rem", margin: "4px 0", lineHeight: "1.1" }}>{product.name}</h1>
              
              <div style={{ display: "flex", gap: "12px", alignItems: "baseline", marginTop: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--bone)", fontWeight: "bold" }}>
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.1rem",
                    color: "var(--dust)",
                    textDecoration: "line-through"
                  }}>
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Sizing panel */}
            <SizeSelector
              variants={product.variants}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn btn-primary"
                style={{ width: "100%", padding: "16px" }}
              >
                {product.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className="btn btn-ghost"
                style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
                {isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
              </button>
            </div>

            {/* Accordion Tabs */}
            <div style={{ borderTop: "1px solid var(--ash)", marginTop: "20px" }}>
              {/* Tab Headers */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--ash)", gap: "24px" }}>
                {["description", "details", "shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOpenTab(tab)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      padding: "16px 0",
                      color: openTab === tab ? "var(--ember)" : "var(--dust)",
                      cursor: "pointer",
                      borderBottom: openTab === tab ? "2px solid var(--ember)" : "none",
                      marginBottom: "-1px"
                    }}
                  >
                    {tab === "description" ? "DESCRIPTION" : tab === "details" ? "DETAILS & CARE" : "SHIPPING & RETURNS"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: "20px 0", fontSize: "0.9rem", color: "var(--bone)", lineHeight: "1.6" }}>
                {openTab === "description" && (
                  <p>{product.description}</p>
                )}
                {openTab === "details" && (
                  <ul style={{ listStyleType: "square", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li>100% HEAVY COTTON WEAVE</li>
                    <li>PRE-SHRUNK AND SILICONE WASHED FOR SOFTNESS</li>
                    <li>WASH COLD. INSIDE OUT. LINE DRY.</li>
                    <li>SKU: {product.sku || "N/A"}</li>
                  </ul>
                )}
                {openTab === "shipping" && (
                  <p>
                    FREE SHIPPING ON ORDERS OVER ₹2999. STANDARD DELIVERIES ARRIVE IN 3-5 BUSINESS DAYS. 
                    EASY 7-DAY RETURNS IN THE ORIGINAL PACKAGING AND CONDITION.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: "80px", borderTop: "1px solid var(--ash)", paddingTop: "60px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "32px" }}>REVIEWS ({reviews.length})</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px" }} className="reviews-split">
            {/* Left: Overall score and Create Review Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{
                backgroundColor: "var(--ash)",
                padding: "24px",
                border: "1px solid var(--dust)"
              }}>
                <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--ember)", fontFamily: "var(--font-mono)" }}>
                  {getAverageRating()}
                </span>
                <span style={{ color: "var(--dust)", fontSize: "1.1rem", fontFamily: "var(--font-mono)" }}> / 5</span>
                <div style={{ marginTop: "8px" }}>
                  <StarRating rating={Math.round(getAverageRating())} />
                </div>
                <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "var(--dust)" }}>
                  AVERAGE CUSTOMER RATING BASED ON {reviews.length} REVIEW(S)
                </p>
              </div>

              {/* Leave Review Form */}
              {token ? (
                <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "1.1rem" }}>LEAVE A REVIEW</h4>
                  <div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>RATING:</span>
                    <div style={{ marginTop: "4px" }}>
                      <StarRating rating={reviewRating} onChange={setReviewRating} interactive={true} />
                    </div>
                  </div>
                  <div>
                    <textarea
                      placeholder="YOUR REVIEW (MINIMUM 5 CHARACTERS)"
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      required
                      className="input-brutalist"
                      rows="4"
                      style={{ resize: "none" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview || reviewBody.length < 5}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    {submittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </form>
              ) : (
                <div style={{ border: "1px dashed var(--dust)", padding: "20px", textAlign: "center", color: "var(--dust)", fontSize: "0.9rem" }}>
                  <p>PLEASE <Link to="/login" style={{ color: "var(--ember)", textDecoration: "underline" }}>LOG IN</Link> TO WRITE A REVIEW.</p>
                </div>
              )}
            </div>

            {/* Right: Individual Reviews list */}
            <div>
              {reviews.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", border: "1px solid var(--ash)", color: "var(--dust)", fontFamily: "var(--font-mono)" }}>
                  NO REVIEWS YET. BE THE FIRST TO WEAR AND REVIEW.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        padding: "24px",
                        border: "1px solid var(--ash)",
                        backgroundColor: "var(--void)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <h5 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>{rev.user?.name || "ANONYMOUS"}</h5>
                        <span style={{ fontSize: "0.8rem", color: "var(--dust)", fontFamily: "var(--font-mono)" }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} />
                      <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "var(--bone)", lineHeight: "1.5" }}>
                        {rev.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .detail-split, .reviews-split {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
