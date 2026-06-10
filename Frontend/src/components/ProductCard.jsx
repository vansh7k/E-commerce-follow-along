import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useToastStore } from "../store/toastStore";

const ProductCard = ({ product, wishlistItems = [], onWishlistUpdate }) => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (wishlistItems && product) {
      setIsWishlisted(wishlistItems.some((item) => item._id === product._id));
    }
  }, [wishlistItems, product]);

  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Avoid navigating on card click
    
    // Check if token exists, otherwise direct to login
    const token = localStorage.getItem("maverick_token");
    if (!token) {
      addToast("Please login to manage wishlist.", "error");
      navigate("/login");
      return;
    }

    setLoadingWishlist(true);
    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${product._id}`);
        addToast("REMOVED FROM WISHLIST", "success");
        setIsWishlisted(false);
      } else {
        await API.post("/wishlist", { productId: product._id });
        addToast("ADDED TO WISHLIST", "success");
        setIsWishlisted(true);
      }
      if (onWishlistUpdate) onWishlistUpdate();
    } catch (error) {
      console.error("Wishlist error:", error);
      addToast("Failed to update wishlist", "error");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const isSoldOut = product.stock <= 0;

  // Format price helper (INR currency)
  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card"
      style={{
        border: "1px solid var(--ash)",
        backgroundColor: "var(--void)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        height: "100%",
        minHeight: "420px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.8)";
        const img = e.currentTarget.querySelector(".product-card-image");
        if (img) img.style.filter = "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        const img = e.currentTarget.querySelector(".product-card-image");
        if (img) img.style.filter = "grayscale(100%)";
      }}
    >
      {/* Product Image Wrapper */}
      <div style={{ position: "relative", width: "100%", height: "300px", overflow: "hidden", backgroundColor: "var(--ash)" }}>
        <img
          src={product.images && product.images[0] ? `https://e-commerce-follow-along-iurp.onrender.com${product.images[0]}` : "https://placehold.co/600x800/2A2A2A/E8E2D9?text=MAVERICK"}
          alt={product.name}
          className="product-card-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(100%)",
            transition: "filter 0.5s ease"
          }}
          onError={(e) => {
            e.target.src = "https://placehold.co/600x800/2A2A2A/E8E2D9?text=MAVERICK";
          }}
        />

        {/* SOLD OUT Overlay */}
        {isSoldOut && (
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "var(--ember)",
              letterSpacing: "0.1em",
              border: "2px solid var(--ember)",
              padding: "4px 16px"
            }}>
              SOLD OUT
            </span>
          </div>
        )}

        {/* Wishlist Heart on Hover (Always visible on absolute positioning but interactive) */}
        <button
          onClick={handleWishlistToggle}
          disabled={loadingWishlist}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "var(--void)",
            border: "1px solid var(--ash)",
            color: isWishlisted ? "var(--ember)" : "var(--bone)",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 5,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "var(--ember)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "var(--ash)";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
      </div>

      {/* Info details */}
      <div style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flexGrow: 1,
        justifyContent: "space-between",
        borderTop: "1px solid var(--ash)"
      }}>
        <div>
          <h3 style={{ fontSize: "1.4rem", color: "var(--bone)", lineHeight: "1.2" }}>{product.name}</h3>
          {product.category && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--dust)",
              textTransform: "uppercase"
            }}>
              {product.category.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--ember)", fontWeight: "500" }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--dust)",
              textDecoration: "line-through"
            }}>
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
