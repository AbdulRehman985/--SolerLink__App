import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div
      className="group relative bg-[#121212] border border-[#2a2a2a] 
                 rounded-2xl shadow-md hover:shadow-[0_0_25px_rgba(255,182,193,0.2)]
                 overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-2xl transform 
                     group-hover:scale-105 transition duration-500"
        />

        {/* Wishlist Icon */}
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2
            className="text-lg font-semibold text-gray-200 leading-snug 
                       hover:text-pink-400 transition-all duration-300 line-clamp-2"
          >
            {product.name}
          </h2>
        </Link>

        {/* Brand */}
        <p className="text-sm text-gray-400 mt-1">{product.brand}</p>

        {/* Price Badge */}
        <div className="flex items-center justify-between mt-3">
          <span
            className="inline-block bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
                       text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md"
          >
            ${product.price}
          </span>

          <Link
            to={`/product/${product._id}`}
            className="text-sm font-medium text-pink-400 hover:text-pink-300 transition"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
