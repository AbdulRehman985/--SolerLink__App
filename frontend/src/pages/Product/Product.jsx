import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div
      className="group relative bg-[#1A1A1A]/95 border border-gray-700 
                 rounded-2xl shadow-md overflow-hidden hover:shadow-pink-500/20 
                 transition-transform duration-300 hover:scale-[1.02]"
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
            className="text-lg font-semibold text-white truncate 
                       group-hover:text-pink-400 transition"
          >
            {product.name}
          </h2>
        </Link>

        {/* Price Badge */}
        <span
          className="inline-block mt-2 bg-gradient-to-r from-pink-600 to-pink-400 
                     text-white text-sm font-medium px-3 py-1 rounded-full shadow"
        >
          ${product.price}
        </span>
      </div>
    </div>
  );
};

export default Product;
