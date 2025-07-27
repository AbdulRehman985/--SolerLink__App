import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const authitacted = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } else {
      return res.status(401).json({ error: "User is not authorized" });
    }
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

export const authorizedIsAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
