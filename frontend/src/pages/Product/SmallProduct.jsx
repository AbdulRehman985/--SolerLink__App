import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div
      className="w-full max-w-xs mx-auto p-4 
                 bg-[#1A1A1A]/95 border border-gray-700 
                 rounded-2xl shadow-md hover:shadow-yellow-500/20 
                 transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          loading="lazy"
          width="300"
          height="192"
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover rounded-lg transform group-hover:scale-105 transition duration-500"
        />

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-white font-semibold text-base truncate hover:text-yellow-400 transition">
            {product.name}
          </h2>
        </Link>

        <span
          className="mt-2 inline-block bg-gradient-to-r from-yellow-500 to-yellow-400 
                     text-black text-xs font-semibold px-3 py-1 rounded-full shadow-sm shadow-yellow-500/30"
        >
          ${product.price}
        </span>
      </div>
    </div>
  );
};

export default SmallProduct;
