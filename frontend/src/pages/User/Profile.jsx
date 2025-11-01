import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, { isLoading }] = useProfileMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await profile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to update profile.");
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-[80vh] px-4 "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-lg bg-[#111]/90 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-2xl text-white"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400 tracking-wide">
            Update Profile
          </h2>
          <Link
            to="/user-orders"
            className="text-sm bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-all font-medium text-black"
          >
            My Orders
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg font-semibold text-black transition-all duration-300 shadow-md shadow-yellow-500/30"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
