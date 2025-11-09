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
import { authitacted, authorizeRoles } from "../middleware/authMiddleware.js";
const userRouter = express.Router();
userRouter
  .route("/")
  .post(registerUser)
  .get(authitacted, authorizeRoles("admin"), getAllUser);
userRouter.post("/auth", logInUser);
userRouter.post("/logout", logOutCurrentUser);
userRouter
  .route("/profile")
  .get(
    authitacted,
    authorizeRoles("user", "shopkeeper", "admin"),
    getCurrentUserProfile
  )
  .put(
    authitacted,
    authorizeRoles("user", "shopkeeper", "admin"),
    updateCurrentUser
  );
userRouter
  .route("/:id")
  .delete(authitacted, authorizeRoles("admin"), destroyUser)
  .get(authitacted, authorizeRoles("admin"), getUserById)
  .put(authitacted, authorizeRoles("admin"), updateById);
export default userRouter;
