import React from "react";

const SizeSelector = ({ variants = [], selectedSize, onSelectSize }) => {
  const sizes = ["S", "M", "L", "XL"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--dust)", textTransform: "uppercase" }}>
        SELECT SIZE
      </span>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {sizes.map((size) => {
          // Find if this variant has stock
          const variant = variants.find((v) => v.size.toUpperCase() === size.toUpperCase());
          const isOutOfStock = !variant || variant.stock <= 0;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              style={{
                width: "48px",
                height: "48px",
                border: isSelected ? "1px solid var(--ember)" : "1px solid var(--ash)",
                backgroundColor: isSelected ? "var(--ember)" : "var(--void)",
                color: isOutOfStock ? "var(--dust)" : isSelected ? "var(--bone)" : "var(--bone)",
                fontFamily: "var(--font-mono)",
                fontWeight: "bold",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                textDecoration: isOutOfStock ? "line-through" : "none",
                opacity: isOutOfStock ? 0.4 : 1
              }}
              onMouseEnter={(e) => {
                if (!isOutOfStock && !isSelected) {
                  e.target.style.borderColor = "var(--bone)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isOutOfStock && !isSelected) {
                  e.target.style.borderColor = "var(--ash)";
                }
              }}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
