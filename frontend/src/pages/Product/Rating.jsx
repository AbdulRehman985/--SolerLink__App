import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const starColor = color || "#FBBF24";

  return (
    <div className="flex items-center space-x-1 text-white">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} style={{ color: starColor }} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt style={{ color: starColor }} />}

      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} style={{ color: starColor }} />
      ))}

      {text && <span className="ml-2">{text}</span>}
    </div>
  );
};

Rating.defaultProps = {
  color: "#FBBF24", // yellow
};

export default Rating;
