import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full max-w-xs mx-auto p-4 bg-[#1e1e1e] rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          loading="lazy"
          width="300"
          height="192"
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
        <HeartIcon product={product} />
        <div className="mt-4">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-white font-semibold text-lg truncate">
              {product.name}
            </h2>
            <span className="mt-2 inline-block bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ${product.price}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
