import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import Toast from "../components/Toast";
import { ProductCardSkeleton } from "../components/Skeleton";
import { useToastStore } from "../store/toastStore";

const Home = () => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const productsRes = await API.get("/products?limit=3");
        setFeaturedProducts(productsRes.data.products || []);

        const token = localStorage.getItem("maverick_token");
        if (token) {
          const wishlistRes = await API.get("/wishlist");
          setWishlistItems(wishlistRes.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching homepage drops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleWishlistUpdate = async () => {
    try {
      const wishlistRes = await API.get("/wishlist");
      setWishlistItems(wishlistRes.data.products || []);
    } catch (error) {
      console.error("Error updating wishlist count:", error);
    }
  };

  const [newsEmail, setNewsEmail] = useState("");
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    addToast("WELCOME TO THE VOID.", "success");
    setNewsEmail("");
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <CartDrawer />
      <Toast />

      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 80px)",
          alignItems: "center",
          borderBottom: "1px solid var(--ash)",
          padding: "40px 24px",
          position: "relative"
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center"
          }}
        >
          {/* Left Hero Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h1
              style={{
                fontSize: "clamp(4rem, 8vw, 7.5rem)",
                lineHeight: "0.9",
                fontFamily: "var(--font-display)",
                color: "var(--bone)"
              }}
            >
              WEAR THE<br />
              <span style={{ color: "var(--ember)" }}>VOID</span>
            </h1>
            <p style={{ color: "var(--dust)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", maxWidth: "420px" }}>
              ENGINEERED TO OUTLAST THE SEASONS. HONEST CONSTRUCTION. HEAVYWEIGHT FABRICS. EXCLUSIVELY MAVERICK.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="btn btn-primary"
              style={{ alignSelf: "flex-start", padding: "16px 36px" }}
            >
              SHOP NOW
            </button>
          </div>

          {/* Right Hero Column (Cinematic street photo placeholder) */}
          <div className="hero-img-wrap" style={{ position: "relative", height: "550px", border: "1px solid var(--ash)", backgroundColor: "var(--ash)" }}>
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop"
              alt="Wear The Void Hero"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "grayscale(100%) brightness(0.7)"
              }}
            />
            <div style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--dust)",
              backgroundColor: "rgba(10,10,10,0.8)",
              padding: "4px 8px"
            }}>
              MAVERICK LOOKBOOK v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Category Strip Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: "0.15em" }}>
                TOPS
              </span>
              <span style={{ color: "var(--ember)", fontSize: "2rem" }}>•</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: "0.15em" }}>
                BOTTOMS
              </span>
              <span style={{ color: "var(--ember)", fontSize: "2rem" }}>•</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: "0.15em" }}>
                OUTERWEAR
              </span>
              <span style={{ color: "var(--ember)", fontSize: "2rem" }}>•</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: "0.15em" }}>
                ACCESSORIES
              </span>
              <span style={{ color: "var(--ember)", fontSize: "2rem" }}>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Brand Manifesto Section */}
      <div
        style={{
          borderBottom: "1px solid var(--ash)",
          backgroundColor: "var(--void)",
          padding: "80px 24px",
          textAlign: "center"
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontStyle: "italic", letterSpacing: "0.05em", color: "var(--bone)" }}>
            "CLOTHES THAT DON'T PERFORM FOR YOU."
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontStyle: "italic", letterSpacing: "0.05em", color: "var(--bone)" }}>
            "WEAR IT ONCE. OWN IT FOREVER."
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontStyle: "italic", letterSpacing: "0.05em", color: "var(--ember)" }}>
            "MADE TO OUTLAST THE ALGORITHM."
          </p>
        </div>
      </div>

      {/* Featured Drops / Latest Drops */}
      <div className="container" style={{ padding: "80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--ember)" }}>01 // ARCHIVE</span>
            <h2 style={{ fontSize: "2.5rem" }}>LATEST DROPS</h2>
          </div>
          <Link to="/shop" className="ember-underline" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", paddingBottom: "4px" }}>
            VIEW ALL PRODUCT
          </Link>
        </div>

        {loading ? (
          <div className="product-grid">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        ) : featuredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--dust)" }}>
            <p className="font-mono">NO PRODUCTS LOADED. RUN THE SEED SCRIPT.</p>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                wishlistItems={wishlistItems}
                onWishlistUpdate={handleWishlistUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Newsletter bar at bottom */}
      <div
        style={{
          borderTop: "1px solid var(--ash)",
          borderBottom: "1px solid var(--ash)",
          backgroundColor: "var(--ash)",
          padding: "60px 24px"
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px"
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.8rem" }}>JOIN THE VOID</h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>
              SUBSCRIBE TO RECEIVE AUTOMATIC LAUNCHES AND RESTOCKS
            </p>
          </div>
          <form onSubmit={handleNewsSubmit} style={{ display: "flex", width: "100%", maxWidth: "450px" }}>
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              required
              className="input-brutalist"
              style={{ borderRight: "none", flexGrow: "1" }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: "0.95rem", padding: "0 24px" }}
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr !important;
          }
          .hero-img-wrap {
            height: 380px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
