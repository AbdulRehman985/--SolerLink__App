import React from "react";
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/Cart/CartSlice";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Product added to Cart");
  };

  return (
    <div
      className="group relative max-w-sm bg-[#1f2937] border border-gray-700 
      rounded-2xl shadow-lg overflow-hidden hover:shadow-yellow-500/20 
      transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Wishlist Icon */}
      <div className="absolute top-3 right-3 z-10">
        <HeartIcon product={p} />
      </div>

      {/* Product Image */}
      <Link to={`/product/${p._id}`}>
        <div className="overflow-hidden rounded-t-xl">
          <img
            src={p.image}
            alt={p.name}
            className="h-[200px] w-full object-cover transform 
              group-hover:scale-105 transition duration-500"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand Tag */}
        <span
          className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-400 
          text-black text-[11px] px-3 py-1 rounded-full font-semibold mb-3"
        >
          {p.brand}
        </span>

        <Link to={`/product/${p._id}`}>
          <h3 className="text-white text-lg font-semibold truncate group-hover:text-yellow-400 transition">
            {p.name}
          </h3>
        </Link>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-yellow-400 font-bold text-lg">${p.price}</p>

          {/* Add to Cart Button */}
          <button
            className="flex items-center justify-center w-11 h-11 rounded-full 
                       bg-gradient-to-r from-yellow-500 to-yellow-400 text-black 
                       font-semibold shadow-md shadow-yellow-400/40 
                       transition-all duration-300 hover:scale-110 hover:rotate-6 
                       hover:from-yellow-400 hover:to-yellow-300"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
