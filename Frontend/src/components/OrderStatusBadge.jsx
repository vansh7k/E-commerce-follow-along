import React from "react";

const OrderStatusBadge = ({ status }) => {
  const getBadgeStyle = (statusName) => {
    const s = statusName?.toLowerCase() || "pending";
    switch (s) {
      case "pending":
        return { backgroundColor: "#D4AF37", color: "var(--void)" }; // Gold/Yellow
      case "confirmed":
        return { backgroundColor: "#3a6073", color: "var(--bone)" }; // Slate Blue
      case "shipped":
        return { backgroundColor: "var(--ember)", color: "var(--bone)" }; // Ember Orange
      case "delivered":
        return { backgroundColor: "#2e7d32", color: "var(--bone)" }; // Forest Green
      case "cancelled":
        return { backgroundColor: "#93000a", color: "var(--bone)" }; // Dark Red
      default:
        return { backgroundColor: "var(--ash)", color: "var(--bone)" };
    }
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        ...getBadgeStyle(status)
      }}
    >
      {status || "PENDING"}
    </span>
  );
};

export default OrderStatusBadge;
