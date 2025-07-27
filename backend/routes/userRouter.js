import express from "express";
import {
  destroyUser,
  getAllUser,
  getCurrentUserProfile,
  getUserById,
  logInUser,
  logOutCurrentUser,
  registerUser,
  updateById,
  updateCurrentUser,
} from "../controllers/userCntrl.js";
import {
  authitacted,
  authorizedIsAdmin,
} from "../middleware/authMiddleware.js";
const userRouter = express.Router();
userRouter
  .route("/")
  .post(registerUser)
  .get(authitacted, authorizedIsAdmin, getAllUser);
userRouter.post("/auth", logInUser);
userRouter.post("/logout", logOutCurrentUser);
userRouter
  .route("/profile")
  .get(authitacted, getCurrentUserProfile)
  .put(authitacted, updateCurrentUser);
userRouter
  .route("/:id")
  .delete(authitacted, authorizedIsAdmin, destroyUser)
  .get(authitacted, authorizedIsAdmin, getUserById)
  .put(authitacted, authorizedIsAdmin, updateById);
export default userRouter;
//  "password": "password12"
