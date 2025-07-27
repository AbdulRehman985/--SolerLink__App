import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../Redux/Features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

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
      toast.success("Profile updated successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.msg || "Failed to update profile.");
    }
  };

  return (
    // (Keep all imports as you already have them)

    <div className="container mx-auto px-4 py-8 max-w-xl mt-5">
      <div className="bg-gray-900 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Update Profile</h2>
          <Link
            to="/user-orders"
            className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded transition"
          >
            My Orders
          </Link>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter Name"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-all"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
