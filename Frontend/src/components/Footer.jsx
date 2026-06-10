import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToastStore } from "../store/toastStore";

const Footer = () => {
  const [email, setEmail] = useState("");
  const addToast = useToastStore((state) => state.addToast);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast("WELCOME TO THE VOID.", "success");
    setEmail("");
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--void)",
        borderTop: "1px solid var(--ash)",
        padding: "80px 24px 40px 24px",
        fontFamily: "var(--font-body)",
        color: "var(--bone)",
        marginTop: "auto"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "48px",
          marginBottom: "60px"
        }}
      >
        {/* Brand Column */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "16px", color: "var(--ember)" }}>
            MAVERICK
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--dust)", lineHeight: "1.6" }}>
            ENGINEERED FOR THE URBAN VOID. RAW MATERIALS. HONEST CONSTRUCTION. ZERO COMPROMISE.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--bone)", marginBottom: "20px" }}>
            NAVIGATE
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <li>
              <Link to="/shop" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                SHOP ALL
              </Link>
            </li>
            <li>
              <a href="#collections" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                COLLECTIONS
              </a>
            </li>
            <li>
              <a href="#archive" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                ARCHIVE
              </a>
            </li>
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--bone)", marginBottom: "20px" }}>
            LEGAL
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            <li>
              <a href="#privacy" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                PRIVACY POLICY
              </a>
            </li>
            <li>
              <a href="#terms" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                TERMS OF SERVICE
              </a>
            </li>
            <li>
              <a href="#shipping" className="ember-underline" style={{ fontSize: "0.85rem", color: "var(--dust)" }}>
                SHIPPING & RETURNS
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--bone)", marginBottom: "20px" }}>
            JOIN THE VOID
          </h4>
          <p style={{ fontSize: "0.85rem", color: "var(--dust)", marginBottom: "16px" }}>
            NO SPAM. JUST ACCESS TO NEW DROPS.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: "flex", border: "1px solid var(--ash)" }}>
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-brutalist"
              style={{ border: "none", padding: "10px 14px", flexGrow: "1" }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "var(--bone)",
                color: "var(--void)",
                fontFamily: "var(--font-display)",
                padding: "0 20px",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all var(--transition-speed)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--ember)";
                e.target.style.color = "var(--bone)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--bone)";
                e.target.style.color = "var(--void)";
              }}
            >
              JOIN
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        paddingTop: "30px",
        borderTop: "1px solid var(--ash)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "0.8rem",
        color: "var(--dust)"
      }}>
        <span>© 2026 MAVERICK BY ANTIGRAVITY. ALL RIGHTS RESERVED.</span>
        <span>MADE TO OUTLAST THE ALGORITHM.</span>
      </div>
    </footer>
  );
};

export default Footer;
