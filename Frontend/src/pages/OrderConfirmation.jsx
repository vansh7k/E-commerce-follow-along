import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="page-container" style={{ backgroundColor: "var(--void)" }}>
      <Navbar />

      <div
        className="content-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "var(--ash)",
            border: "1px solid var(--dust)",
            padding: "48px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "4rem", color: "var(--ember)" }}>
            check_circle
          </span>

          <div>
            <h1 style={{ fontSize: "3rem", margin: 0 }}>ORDER CONFIRMED.</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--dust)", marginTop: "4px" }}>
              THANK YOU FOR WEARING THE VOID.
            </p>
          </div>

          <div style={{
            borderTop: "1px solid var(--dust)",
            borderBottom: "1px solid var(--dust)",
            padding: "24px 0",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--dust)" }}>ORDER ID:</span>
              <span>{id}</span>
            </div>
            {order && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dust)" }}>TOTAL CHARGED:</span>
                  <span style={{ color: "var(--ember)", fontWeight: "bold" }}>{formatPrice(order.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dust)" }}>SHIPPING TO:</span>
                  <span>
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </span>
                </div>
              </>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--dust)" }}>ESTIMATED ARRIVAL:</span>
              <span>3 - 5 BUSINESS DAYS</span>
            </div>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--dust)", lineHeight: "1.6" }}>
            A confirmation receipt containing full delivery details and a tracking code has been dispatched to your email.
          </p>

          <Link to="/shop" className="btn btn-primary" style={{ padding: "14px", marginTop: "10px" }}>
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
