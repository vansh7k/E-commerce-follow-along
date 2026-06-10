import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useToastStore } from "../store/toastStore";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);

  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("India");

  // Payment Form details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    // If cart is empty, redirect back to cart page
    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    // Populate user profile info if logged in
    const userStr = localStorage.getItem("maverick_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setEmail(user.email || "");
      if (user.addresses && user.addresses.length > 0) {
        const defAddr = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
        setStreet(defAddr.street || "");
        setCity(defAddr.city || "");
        setState(defAddr.state || "");
        setZipCode(defAddr.zipCode || "");
        setCountry(defAddr.country || "India");
      }
    }
  }, [items, navigate]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const subtotal = getTotal();
  const shipping = subtotal > 2999 ? 0 : 149;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + gst;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!email || !street || !city || !state || !zipCode || !country) {
      addToast("PLEASE FILL IN ALL SHIPPING DETAILS", "error");
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvv) {
      addToast("PLEASE FILL IN CARD DETAILS", "error");
      return;
    }

    setPlacingOrder(true);
    try {
      // 1. Create stripe payment intent
      const intentRes = await API.post("/stripe/create-intent", { amount: grandTotal });
      const paymentId = intentRes.data.id;

      // 2. Submit order to backend
      const orderItems = items.map((item) => ({
        product: item.product._id,
        qty: item.qty,
        price: item.product.price,
        size: item.size,
        color: item.color || ""
      }));

      const shippingAddress = { street, city, state, zipCode, country };

      const orderRes = await API.post("/orders", {
        items: orderItems,
        shippingAddress,
        stripePaymentId: paymentId,
        total: grandTotal
      });

      addToast("ORDER COMPLETED SUCCESSFULLY.", "success");
      
      // 3. Clear cart and redirect
      clearCart();
      navigate(`/order/${orderRes.data.order._id}/confirmation`, {
        state: { order: orderRes.data.order }
      });
    } catch (error) {
      console.error("Place order failed:", error);
      addToast("Order creation failed.", "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />
      <Toast />

      <div className="container" style={{ padding: "60px 24px", flex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "40px" }}>CHECKOUT</h1>

        <form onSubmit={handlePlaceOrder} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "60px" }} className="checkout-split">
          
          {/* Left Column: Forms */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* Shipping Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "1.4rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px" }}>
                1. SHIPPING DETAILS
              </h3>
              
              <div>
                <input
                  type="email"
                  placeholder="CONTACT EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="STREET ADDRESS"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <input
                  type="text"
                  placeholder="CITY"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="input-brutalist"
                />
                <input
                  type="text"
                  placeholder="STATE"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <input
                  type="text"
                  placeholder="ZIP CODE"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                  className="input-brutalist"
                />
                <input
                  type="text"
                  placeholder="COUNTRY"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontSize: "1.4rem", borderBottom: "1px solid var(--ash)", paddingBottom: "10px" }}>
                2. PAYMENT (STRIPE SECURE CARD)
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--dust)", fontFamily: "var(--font-mono)", marginTop: "-10px" }}>
                *ENTER ANY DUMMY CARD FOR TESTING IN SANDBOX
              </p>

              <div>
                <input
                  type="text"
                  placeholder="CARD NUMBER"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                  className="input-brutalist"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  required
                  className="input-brutalist"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Summary */}
          <div style={{
            backgroundColor: "var(--ash)",
            border: "1px solid var(--dust)",
            padding: "32px",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "sticky",
            top: "120px"
          }}>
            <h3 style={{ fontSize: "1.5rem", borderBottom: "1px solid var(--dust)", paddingBottom: "12px" }}>
              ORDER OVERVIEW
            </h3>

            {/* Items review list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "200px", overflowY: "auto" }}>
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}`} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={`http://localhost:7000${item.product.images[0]}`}
                    alt={item.product.name}
                    style={{ width: "40px", height: "50px", objectFit: "cover", border: "1px solid var(--dust)" }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/40pxx50/2A2A2A/E8E2D9?text=M";
                    }}
                  />
                  <div style={{ flex: 1, fontSize: "0.85rem" }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{item.product.name}</p>
                    <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--dust)" }}>
                      QTY: {item.qty} | SIZE: {item.size}
                    </p>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: "var(--dust)" }} />

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>ITEMS TOTAL:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>SHIPPING:</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>GST (18%):</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <hr style={{ borderColor: "var(--dust)", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", color: "var(--bone)", fontWeight: "bold" }}>
                <span>GRAND TOTAL:</span>
                <span style={{ color: "var(--ember)" }}>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px", padding: "14px" }}
            >
              {placingOrder ? "PROCESSING..." : "PLACE ORDER"}
            </button>
          </div>

        </form>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .checkout-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
