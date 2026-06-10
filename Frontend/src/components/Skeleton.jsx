import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div style={{
      border: "1px solid var(--ash)",
      height: "420px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--void)"
    }}>
      <div className="skeleton-shimmer" style={{
        flex: "1",
        backgroundColor: "var(--ash)"
      }}></div>
      <div style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderTop: "1px solid var(--ash)"
      }}>
        <div className="skeleton-shimmer" style={{ height: "24px", width: "80%", backgroundColor: "var(--ash)" }}></div>
        <div className="skeleton-shimmer" style={{ height: "16px", width: "40%", backgroundColor: "var(--ash)" }}></div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "48px",
      padding: "24px"
    }}>
      <div className="skeleton-shimmer" style={{ height: "500px", backgroundColor: "var(--ash)" }}></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="skeleton-shimmer" style={{ height: "48px", width: "60%", backgroundColor: "var(--ash)" }}></div>
        <div className="skeleton-shimmer" style={{ height: "24px", width: "30%", backgroundColor: "var(--ash)" }}></div>
        <div className="skeleton-shimmer" style={{ height: "100px", backgroundColor: "var(--ash)" }}></div>
      </div>
    </div>
  );
};
