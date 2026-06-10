import React, { useState } from "react";

const StarRating = ({ rating = 0, onChange, interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      style={{ display: "flex", gap: "4px", cursor: interactive ? "pointer" : "default" }}
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((star) => {
        const fillCondition = hoverRating ? star <= hoverRating : star <= rating;
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            className="material-symbols-outlined"
            style={{
              fontSize: "1.5rem",
              fontVariationSettings: fillCondition ? "'FILL' 1" : "'FILL' 0",
              color: fillCondition ? "var(--ember)" : "var(--ash)",
              transition: "color 0.1s ease"
            }}
          >
            star
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
