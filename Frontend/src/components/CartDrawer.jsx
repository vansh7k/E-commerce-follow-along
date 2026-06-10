import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isCartOpen, setCartOpen, updateQty, removeItem, getTotal } = useCartStore();

  const handleClose = () => setCartOpen(false);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleViewCartClick = () => {
    setCartOpen(false);
    navigate("/cart");
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9998,
            transition: "opacity 0.3s ease"
          }}
        />
      )}

      {/* Slide-in Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--void)",
          borderLeft: "1px solid var(--ash)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--ash)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ fontSize: "1.8rem" }}>YOUR CART</h2>
          <button
            onClick={handleClose}
            className="material-symbols-outlined"
            style={{ fontSize: "2rem", cursor: "pointer" }}
          >
            close
          </button>
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {items.length === 0 ? (
            <div style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--dust)"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", marginBottom: "12px" }}>
                shopping_bag
              </span>
              <p className="font-mono text-sm">Nothing here yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.product._id}-${item.size}`}
                  style={{
                    display: "flex",
                    gap: "16px",
                    borderBottom: "1px solid var(--ash)",
                    paddingBottom: "16px"
                  }}
                >
                  <img
                    src={item.product.images && item.product.images[0] ? `http://localhost:7000${item.product.images[0]}` : "https://placehold.co/100x130/2A2A2A/E8E2D9?text=MAVERICK"}
                    alt={item.product.name}
                    style={{ width: "80px", height: "100px", objectFit: "cover", border: "1px solid var(--ash)" }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x130/2A2A2A/E8E2D9?text=MAVERICK";
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>{item.product.name}</h4>
                        <button
                          onClick={() => removeItem(item.product._id, item.size)}
                          className="material-symbols-outlined"
                          style={{ fontSize: "1.2rem", color: "var(--dust)", cursor: "pointer" }}
                        >
                          delete
                        </button>
                      </div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>
                        SIZE: {item.size} {item.color && `| COLOR: ${item.color}`}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: "flex", border: "1px solid var(--ash)" }}>
                        <button
                          onClick={() => updateQty(item.product._id, item.size, item.qty - 1)}
                          style={{ padding: "4px 8px", cursor: "pointer" }}
                        >
                          -
                        </button>
                        <span style={{ padding: "4px 12px", fontFamily: "var(--font-mono)" }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product._id, item.size, item.qty + 1)}
                          style={{ padding: "4px 8px", cursor: "pointer" }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: "500" }}>
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "24px",
            borderTop: "1px solid var(--ash)",
            backgroundColor: "var(--ash)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              fontFamily: "var(--font-mono)"
            }}>
              <span>SUBTOTAL:</span>
              <span style={{ fontSize: "1.2rem", color: "var(--ember)" }}>{formatPrice(getTotal())}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={handleCheckoutClick}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                PROCEED TO CHECKOUT
              </button>
              <button
                onClick={handleViewCartClick}
                className="btn btn-ghost"
                style={{ width: "100%" }}
              >
                VIEW CART
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
