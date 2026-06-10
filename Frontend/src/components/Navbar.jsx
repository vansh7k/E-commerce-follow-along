import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { getCount, setCartOpen } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);

  const token = localStorage.getItem("maverick_token");
  const userStr = localStorage.getItem("maverick_user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("maverick_token");
    localStorage.removeItem("maverick_user");
    addToast("LOGGED OUT SUCCESSFULLY", "success");
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          backgroundColor: "var(--void)",
          borderBottom: "1px solid var(--ash)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          zIndex: 1000,
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              color: "var(--bone)",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            MAVERICK
          </h1>
        </Link>

        {/* Center Desktop Links */}
        <div
          style={{
            display: "none",
            gap: "32px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
          }}
          className="desktop-menu"
        >
          <Link to="/shop" className="ember-underline" style={{ color: "var(--bone)", padding: "4px 0" }}>
            SHOP
          </Link>
          <a href="#collections" className="ember-underline" style={{ color: "var(--bone)", padding: "4px 0" }}>
            COLLECTIONS
          </a>
          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" className="ember-underline" style={{ color: "var(--ember)", padding: "4px 0" }}>
              ADMIN PORTAL
            </Link>
          )}
        </div>

        {/* Right Section Icons & Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {token ? (
            <div style={{ display: "none", gap: "16px" }} className="desktop-menu">
              <Link to="/account" className="ember-underline" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                ACCOUNT
              </Link>
              <button
                onClick={handleLogout}
                className="ember-underline"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", cursor: "pointer" }}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div style={{ display: "none", gap: "16px" }} className="desktop-menu">
              <Link to="/login" className="ember-underline" style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                LOGIN
              </Link>
            </div>
          )}

          {/* Cart Icon trigger */}
          <button
            onClick={handleCartClick}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.8rem" }}>
              shopping_bag
            </span>
            {getCount() > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  backgroundColor: "var(--ember)",
                  color: "var(--bone)",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getCount()}
              </span>
            )}
          </button>

          {/* Hamburger Icon trigger for mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "flex", cursor: "pointer" }}
            className="mobile-hamburger-btn"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.8rem" }}>
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--void)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            gap: "24px",
            fontFamily: "var(--font-mono)",
            fontSize: "1.2rem",
            borderTop: "1px solid var(--ash)",
          }}
        >
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
            SHOP
          </Link>
          <a href="#collections" onClick={() => setMobileMenuOpen(false)}>
            COLLECTIONS
          </a>
          {user && user.role === "admin" && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--ember)" }}>
              ADMIN PORTAL
            </Link>
          )}
          <hr style={{ borderColor: "var(--ash)" }} />
          {token ? (
            <>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                ACCOUNT
              </Link>
              <button onClick={handleLogout} style={{ textAlign: "left", cursor: "pointer" }}>
                LOGOUT
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              LOGIN
            </Link>
          )}
        </div>
      )}

      {/* Embed media queries check locally in style block for responsiveness */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
