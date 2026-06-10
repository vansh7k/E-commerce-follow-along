import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, getTotal } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "MAVERICK10") {
      setDiscountPercent(10);
      addToast("10% DISCOUNT APPLIED.", "success");
    } else if (code === "VOID20") {
      setDiscountPercent(20);
      addToast("20% DISCOUNT APPLIED.", "success");
    } else {
      addToast("INVALID PROMO CODE.", "error");
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const subtotal = getTotal();
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  
  // Shipping: Free above 2999, else 149
  const shipping = subtotal === 0 || discountedSubtotal > 2999 ? 0 : 149;
  
  // GST: 18% on total value
  const gst = Math.round(discountedSubtotal * 0.18);
  const grandTotal = discountedSubtotal + shipping + gst;

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <Toast />

      <div className="container" style={{ padding: "60px 24px", flex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "40px" }}>YOUR BAG</h1>

        {items.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            border: "1px dashed var(--ash)",
            color: "var(--dust)"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "4rem", marginBottom: "16px" }}>
              shopping_cart
            </span>
            <p className="font-mono" style={{ fontSize: "1.1rem", marginBottom: "24px" }}>
              Nothing here yet.
            </p>
            <Link to="/shop" className="btn btn-ghost">
              BACK TO SHOP
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px" }} className="cart-split">
            {/* Left: Cart Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}`}
                  style={{
                    display: "flex",
                    gap: "24px",
                    borderBottom: "1px solid var(--ash)",
                    paddingBottom: "24px",
                    alignItems: "center"
                  }}
                  className="cart-item"
                >
                  <img
                    src={item.product.images && item.product.images[0] ? `https://e-commerce-follow-along-iurp.onrender.com${item.product.images[0]}` : "https://placehold.co/120x160/2A2A2A/E8E2D9?text=MAVERICK"}
                    alt={item.product.name}
                    style={{ width: "100px", height: "130px", objectFit: "cover", border: "1px solid var(--ash)" }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/120x160/2A2A2A/E8E2D9?text=MAVERICK";
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", margin: 0 }}>{item.product.name}</h3>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)", marginTop: "4px" }}>
                          SIZE: {item.size} {item.color && `| COLOR: ${item.color}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.size)}
                        className="material-symbols-outlined"
                        style={{ color: "var(--dust)", cursor: "pointer" }}
                      >
                        delete
                      </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: "flex", border: "1px solid var(--ash)" }}>
                        <button
                          onClick={() => updateQty(item.product._id, item.size, item.qty - 1)}
                          style={{ padding: "6px 12px", cursor: "pointer" }}
                        >
                          -
                        </button>
                        <span style={{ padding: "6px 16px", fontFamily: "var(--font-mono)" }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product._id, item.size, item.qty + 1)}
                          style={{ padding: "6px 12px", cursor: "pointer" }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: "bold" }}>
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary */}
            <div style={{
              backgroundColor: "var(--ash)",
              border: "1px solid var(--dust)",
              padding: "32px",
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <h3 style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--dust)", paddingBottom: "12px" }}>
                ORDER SUMMARY
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>BAG TOTAL:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ember)" }}>
                    <span>DISCOUNT ({discountPercent}%):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>SHIPPING:</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>GST (18%):</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <hr style={{ borderColor: "var(--dust)", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", color: "var(--bone)", fontWeight: "bold" }}>
                  <span>ORDER TOTAL:</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Promo input form */}
              <form onSubmit={handleApplyPromo} style={{ display: "flex", border: "1px solid var(--dust)", marginTop: "10px" }}>
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="input-brutalist"
                  style={{ border: "none", padding: "10px", flexGrow: 1 }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "var(--bone)",
                    color: "var(--void)",
                    fontFamily: "var(--font-display)",
                    padding: "0 16px",
                    cursor: "pointer"
                  }}
                >
                  APPLY
                </button>
              </form>
              <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--dust)", marginTop: "-12px" }}>
                PROMOS: MAVERICK10 (10%) / VOID20 (20%)
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "10px", padding: "14px" }}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .cart-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .cart-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .cart-item img {
            width: 100% !important;
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
