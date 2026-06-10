import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderStatusBadge from "../components/OrderStatusBadge";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        navigate("/account");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTimelineClass = (stepName) => {
    if (!order) return "timeline-step-pending";
    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const currentIdx = statusOrder.indexOf(order.status.toLowerCase());
    const stepIdx = statusOrder.indexOf(stepName.toLowerCase());

    if (currentIdx === -1) return "timeline-step-pending"; // Default
    if (stepIdx <= currentIdx) return "timeline-step-completed";
    return "timeline-step-pending";
  };

  if (loading) {
    return (
      <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
        <Navbar />
        <div className="container" style={{ padding: "80px 24px", color: "var(--dust)" }}>
          LOADING ORDER DATA...
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />

      <div className="container" style={{ padding: "60px 24px", flex: 1 }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
          <Link to="/account" style={{ display: "flex", alignItems: "center", color: "var(--dust)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              arrow_back
            </span>
          </Link>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--dust)" }}>
            BACK TO ARCHIVE
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", margin: 0 }}>ORDER #{order._id.substring(0, 10).toUpperCase()}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)" }}>
              PLACED ON {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Status Pipeline Timeline */}
        <div style={{
          backgroundColor: "var(--ash)",
          padding: "32px",
          border: "1px solid var(--dust)",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px"
        }}>
          {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, idx) => {
            const isCompleted = getTimelineClass(step) === "timeline-step-completed";
            return (
              <div key={step} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                color: isCompleted ? "var(--ember)" : "var(--dust)",
                letterSpacing: "0.05rem"
              }}>
                <span className="material-symbols-outlined" style={{
                  fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0",
                  color: isCompleted ? "var(--ember)" : "var(--dust)"
                }}>
                  {isCompleted ? "radio_button_checked" : "radio_button_unchecked"}
                </span>
                <span>{step}</span>
                {idx < 3 && (
                  <span style={{ color: "var(--dust)", marginLeft: "10px" }} className="timeline-arrow">→</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Layout details Split */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "60px" }} className="order-split">
          
          {/* Items Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "1.5rem" }}>ORDERED ITEMS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {order.items.map((item) => (
                <div key={item._id} style={{
                  display: "flex",
                  gap: "20px",
                  borderBottom: "1px solid var(--ash)",
                  paddingBottom: "16px",
                  alignItems: "center"
                }}>
                  <img
                    src={item.product && item.product.images ? `http://localhost:7000${item.product.images[0]}` : "https://placehold.co/80x100/2A2A2A/E8E2D9?text=M"}
                    alt={item.product?.name || "Product"}
                    style={{ width: "70px", height: "90px", objectFit: "cover", border: "1px solid var(--ash)" }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/80x100/2A2A2A/E8E2D9?text=M";
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "1.2rem" }}>{item.product?.name || "ITEM DISCONTINUED"}</h4>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--dust)", marginTop: "4px" }}>
                      SIZE: {item.size} {item.color && `| COLOR: ${item.color}`}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                    <p>{item.qty} x {formatPrice(item.price)}</p>
                    <p style={{ fontWeight: "bold", color: "var(--bone)", marginTop: "4px" }}>{formatPrice(item.qty * item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Summary Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Delivery address card */}
            <div style={{
              backgroundColor: "var(--ash)",
              border: "1px solid var(--dust)",
              padding: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem"
            }}>
              <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--bone)", borderBottom: "1px solid var(--dust)", paddingBottom: "10px", marginBottom: "12px" }}>
                SHIPPING DESTINATION
              </h4>
              <p style={{ color: "var(--bone)" }}>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country.toUpperCase()}</p>
            </div>

            {/* Price tally */}
            <div style={{
              backgroundColor: "var(--ash)",
              border: "1px solid var(--dust)",
              padding: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem"
            }}>
              <h4 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--bone)", borderBottom: "1px solid var(--dust)", paddingBottom: "10px", marginBottom: "12px" }}>
                PAYMENT BREAKDOWN
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>ITEMS TOTAL:</span>
                  <span>{formatPrice(order.items.reduce((sum, i) => sum + i.price * i.qty, 0))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>SHIPPING Fee:</span>
                  <span>{order.total > 2999 ? "FREE" : formatPrice(149)}</span>
                </div>
                <hr style={{ borderColor: "var(--dust)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "bold" }}>
                  <span>TOTAL PAID:</span>
                  <span style={{ color: "var(--ember)" }}>{formatPrice(order.total)}</span>
                </div>
              </div>
              <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--dust)", borderTop: "1px dashed var(--dust)", paddingTop: "12px" }}>
                STRIPE ID: {order.stripePaymentId || "SIMULATED PAYMENT"}
              </div>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .order-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .timeline-arrow {
            display: none !important;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
