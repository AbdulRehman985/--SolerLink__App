import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const AdminMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { to: "/admin/dashboard", label: "Admin Dashboard" },
    { to: "/admin/categorylist", label: "Create Category" },
    { to: "/admin/allproduct", label: "All Products" },
    { to: "/admin/userlist", label: "Manage Users" },
    { to: "/admin/orderlist", label: "Manage Orders" },
  ];

  return (
    <>
      {userInfo?.isAdmin && (
        <div>
          {" "}
          {/* Toggle Button */}
          <button
            aria-label="Toggle Admin Menu"
            className="z-50 fixed top-4 right-4 p-3 bg-[#1f1f1f] hover:bg-[#2e2e2e] rounded-xl shadow-md transition duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes size={20} color="white" />
            ) : (
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-gray-200"></span>
                <span className="block w-6 h-0.5 bg-gray-200"></span>
                <span className="block w-6 h-0.5 bg-gray-200"></span>
              </div>
            )}
          </button>
          {/* Sidebar Menu */}
          {isMenuOpen && (
            <section className="z-40 fixed top-4 right-4 bg-[#1f1f1f] text-white w-64 rounded-2xl p-6 shadow-2xl animate-slide-in transition-all duration-300">
              <div className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Admin Panel
              </div>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block py-2 px-4 rounded-lg transition duration-200 ${
                          isActive
                            ? "bg-[#2e2e2e] border-l-4 border-green-400 text-green-300"
                            : "hover:bg-[#2e2e2e]"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default AdminMenu;
