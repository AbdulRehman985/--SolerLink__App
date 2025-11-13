import React, { useState } from "react";

const ReadMoreText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  // Short text preview
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");

  return (
    <div className="text-gray-200 text-sm md:text-base">
      <p>
        {displayText}{" "}
        {text.length > maxLength && (
          <span
            onClick={toggleReadMore}
            className="text-yellow-400 font-semibold cursor-pointer hover:underline"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </span>
        )}
      </p>
    </div>
  );
};

export default ReadMoreText;
