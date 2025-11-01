import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ReadMoreText = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded((prev) => !prev);

  return (
    <div className="relative w-full max-w-[22rem] p-4 bg-[#1e1e1e] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Text Content */}
      <p
        className={`text-gray-200 leading-relaxed text-sm md:text-base transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? "max-h-[600px]" : "max-h-[100px]"
          }`}
      >
        {text}
      </p>

      {/* Fade Overlay */}
      {!isExpanded && text.length > maxLength && (
        <div className="absolute bottom-[3.5rem] left-0 w-full h-20 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/60 to-transparent pointer-events-none"></div>
      )}

      {/* Button */}
      {text.length > maxLength && (
        <div className="flex justify-center mt-4">
          <Fab
            variant="extended"
            size="small"
            color="primary"
            onClick={toggleReadMore}
            className="!bg-blue-600 hover:!bg-blue-700 text-white font-semibold transition-all duration-300"
          >
            {isExpanded ? (
              <>
                <ExpandLessIcon sx={{ mr: 1 }} />
                Show Less
              </>
            ) : (
              <>
                <ExpandMoreIcon sx={{ mr: 1 }} />
                Read More
              </>
            )}
          </Fab>
        </div>
      )}
    </div>
  );
};

export default ReadMoreText;
