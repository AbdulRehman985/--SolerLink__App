import React, { useState } from "react";

const ReadMoreText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  return (
    <div className="relative w-[20rem]">
      {/* Text with Smooth Expand */}
      <p
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[500px]" : "max-h-[100px]"
        }`}
      >
        {text}
      </p>

      {/* Fade Effect (Only when not expanded) */}
      {!isExpanded && text.length > maxLength && (
        <div className="absolute bottom-6 left-0 w-full h-10 bg-gradient-to-t from-[#2a2a2a]/90 via-[#2a2a2a]/60 to-transparent pointer-events-none"></div>
      )}

      {/* Read More / Show Less Button */}
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className="mt-2 text-pink-500 font-semibold hover:text-pink-400 transition"
        >
          {isExpanded ? "Show Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreText;
