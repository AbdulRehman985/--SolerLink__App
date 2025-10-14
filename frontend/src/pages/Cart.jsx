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
  console.log(cartItem);
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
    <div className="container flex justify-around items-start text-white flex-wrap mx-auto mt-8">
      {cartItem.length === 0 ? (
        <div>
          your Cart is empty <Link to="/shop">Go back</Link>
        </div>
      ) : (
        <div className="flex flex-col w-[80%]">
          <h1 className="text-2xl font-semibold mb-4"> Shopping Cart</h1>
          {cartItem.map((item) => (
            <div key={item._id} className="flex items-center mb-[1rem]  pb-2">
              <div className="w-[5rem] h-[5rem]">
                {" "}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1 ml-4">
                <Link to={`/product/${item._id}`} className="text-pink-500">
                  {item.name}
                </Link>
                <div className="mt-2 text-white">{item.brand}</div>
                <div className="mt-2 font-bold text-white">${item.price}</div>
              </div>
              <div className="w-24">
                <select
                  className="w-full p-2 border border-pinks-600 rounded bg-[#1E1E1E] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              <div>
                <button
                  className="text-red-500 mr-[5rem]"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash className="ml-[1rem] mt-[1rem] cursor-pointer" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 w-[40rem]">
            <div className="p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Items({cartItem.reduce((acc, item) => acc + item.qty, 0)})
              </h2>
              <div className="text-2xl font-bold">
                $
                {cartItem
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </div>
              <button
                className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg cursor-pointer w-full"
                disabled={cartItem.length === 0}
                onClick={checkOutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
