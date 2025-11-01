import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../redux/features/Cart/CartSlice";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItem } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 flex justify-center py-10 px-4">
      {cartItem.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Your Cart is Empty
          </h2>
          <Link
            to="/shop"
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition duration-300"
          >
            Go Back to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
          {/* 🛒 Cart Items */}
          <div className="flex-1 bg-[#1f2937] rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-yellow-400 mb-6">
              Shopping Cart
            </h1>

            {cartItem.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#323232] transition duration-300"
              >
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-lg font-semibold text-yellow-400 hover:text-yellow-300 transition"
                  >
                    {item.name}
                  </Link>
                  <div className="text-gray-400 text-sm mt-1">{item.brand}</div>
                  <div className="text-xl font-bold text-white mt-2">
                    ${item.price}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mt-4 sm:mt-0">
                  <select
                    className="p-2 rounded-md bg-[#111827] border border-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item?.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 🗑️ Delete Button */}
                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="mt-4 sm:mt-0 ml-4 flex items-center justify-center w-9 h-9 rounded-full 
                  bg-[#1e1e1e] border border-red-500/50 text-red-400 
                  hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 hover:text-white 
                  hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition duration-300"
                  title="Remove Item"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* 💳 Cart Summary */}
          <div className="w-full lg:w-1/3 bg-[#1f2937] p-6 rounded-2xl shadow-lg h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2 text-gray-300">
              <span>Total Items</span>
              <span className="font-medium">
                {cartItem.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </div>

            <div className="flex justify-between mb-6 text-xl font-bold">
              <span>Total Price</span>
              <span className="text-yellow-400">
                $
                {cartItem
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </div>

            <button
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 w-full rounded-xl transition duration-300"
              disabled={cartItem.length === 0}
              onClick={checkOutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
