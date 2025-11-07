import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const [login, { isLoading }] = useLoginMutation();
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin === true) {
        navigate("/admin/dashboard");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Logged in successfully!");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-4  text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full space-y-8 bg-[#111]/90 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400 tracking-wide">
            Sign in to SolarLink
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            New here?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-yellow-400 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 transition-all text-black font-semibold rounded-lg shadow-md shadow-yellow-500/30 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

      </motion.div>
    </motion.section >
  );
};

export default Login;
