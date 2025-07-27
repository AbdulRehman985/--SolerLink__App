import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import {
  useLogoutMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import FavoritesCount from "../Product/favrotiesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDropDown = () => setDropDownOpen(!dropDownOpen);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropDownOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      id="navigation-container"
      className="fixed h-screen bg-black text-white flex flex-col justify-between p-4"
    >
      {/* Top Links */}
      <div className="flex flex-col gap-y-12">
        <Link
          to="/"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <AiOutlineHome className="mr-2" size={25} />
          <span className="hidden nav-item-name">Home</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <AiOutlineShoppingCart className="mr-2" size={25} />
          <span className="hidden nav-item-name">Cart</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <AiOutlineShopping className="mr-2" size={25} />
          <span className="hidden nav-item-name">Shop</span>
        </Link>
        <Link
          to="/favourite"
          className="flex items-center hover:translate-x-2 transition-transform"
        >
          <span className="relative mr-2 inline-block">
            <FaHeart size={25} />
            <FavoritesCount />
          </span>
          <span className="hidden nav-item-name">Favourite</span>
        </Link>
      </div>

      {/* User Dropdown */}
      <div className="relative mt-20">
        {userInfo ? (
          <>
            <button
              onClick={toggleDropDown}
              className="flex items-center text-white focus:outline-none"
            >
              <span className="nav-item-name">{userInfo.username}</span>
              <svg
                className={`h-4 w-4 ml-1 transform transition-transform ${
                  dropDownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropDownOpen && (
              <ul className="absolute bottom-full mb-2 left-0 w-48 bg-white text-gray-700 rounded shadow-md z-[999]">
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categorylist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className="flex flex-col gap-y-12">
            <li>
              <Link
                to="/login"
                className="flex items-center hover:translate-x-2 transition-transform"
              >
                <AiOutlineLogin className="mr-2" size={25} />
                <span className="hidden nav-item-name">Login</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center hover:translate-x-2 transition-transform"
              >
                <AiOutlineUserAdd className="mr-2" size={25} />
                <span className="hidden nav-item-name">Register</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
