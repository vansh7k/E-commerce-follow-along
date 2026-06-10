import React from "react";

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onCategorySelect,
  selectedSizes = [],
  onSizeToggle,
  priceRange = [0, 10000],
  onPriceChange,
  sortOption,
  onSortChange,
  onClearFilters,
  isOpen = false,
  onClose
}) => {
  const sizes = ["S", "M", "L", "XL"];

  const handlePriceSlide = (e) => {
    const val = Number(e.target.value);
    onPriceChange([0, val]);
  };

  const handleSizeClick = (size) => {
    onSizeToggle(size);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const sidebarContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px", padding: "20px" }}>
      {/* Category Section */}
      <div>
        <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--dust)", letterSpacing: "0.1em", marginBottom: "16px" }}>
          CATEGORIES
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
          <button
            onClick={() => onCategorySelect("")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: selectedCategory === "" ? "var(--ember)" : "var(--bone)",
              fontWeight: selectedCategory === "" ? "bold" : "normal",
              cursor: "pointer"
            }}
          >
            ALL ARCHIVES
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategorySelect(cat.slug)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: selectedCategory === cat.slug ? "var(--ember)" : "var(--bone)",
                fontWeight: selectedCategory === cat.slug ? "bold" : "normal",
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sizing Section */}
      <div>
        <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--dust)", letterSpacing: "0.1em", marginBottom: "16px" }}>
          SIZES
        </h4>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {sizes.map((size) => {
            const isChecked = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeClick(size)}
                style={{
                  width: "40px",
                  height: "40px",
                  border: isChecked ? "1px solid var(--ember)" : "1px solid var(--ash)",
                  backgroundColor: isChecked ? "var(--ember)" : "var(--void)",
                  color: "var(--bone)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider Section */}
      <div>
        <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--dust)", letterSpacing: "0.1em", marginBottom: "16px" }}>
          MAX PRICE: {formatPrice(priceRange[1])}
        </h4>
        <input
          type="range"
          min="500"
          max="10000"
          step="250"
          value={priceRange[1]}
          onChange={handlePriceSlide}
          style={{
            width: "100%",
            accentColor: "var(--ember)",
            background: "var(--ash)",
            height: "4px",
            outline: "none",
            cursor: "pointer"
          }}
        />
      </div>

      {/* Sorting Select Option */}
      <div>
        <h4 style={{ fontSize: "0.9rem", fontFamily: "var(--font-mono)", color: "var(--dust)", letterSpacing: "0.1em", marginBottom: "16px" }}>
          SORT BY
        </h4>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-brutalist"
          style={{ padding: "10px" }}
        >
          <option value="newest">NEWEST DROPS</option>
          <option value="price-asc">PRICE: LOW TO HIGH</option>
          <option value="price-desc">PRICE: HIGH TO LOW</option>
        </select>
      </div>

      {/* Clear Filters CTA */}
      <button
        onClick={onClearFilters}
        className="btn btn-ghost"
        style={{ width: "100%", fontSize: "0.9rem", padding: "10px" }}
      >
        RESET FILTERS
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel (Left Column) */}
      <div className="desktop-filters" style={{ width: "260px", flexShrink: 0 }}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 998,
            display: "block"
          }}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "300px",
          backgroundColor: "var(--void)",
          borderRight: "1px solid var(--ash)",
          zIndex: 999,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          paddingTop: "24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
          <h2 style={{ fontSize: "1.4rem" }}>FILTERS</h2>
          <button onClick={onClose} className="material-symbols-outlined" style={{ cursor: "pointer" }}>
            close
          </button>
        </div>
        {sidebarContent}
      </div>

      <style>{`
        .desktop-filters {
          display: none;
        }
        @media (min-width: 768px) {
          .desktop-filters {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default FilterSidebar;
