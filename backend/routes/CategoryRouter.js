import express from "express";
import {
  createCategory,
  destoryCategory,
  listCategory,
  readCategory,
  UpdateCategory,
} from "../controllers/CategoryController.js";
import { authitacted, authorizeRoles } from "../middleware/authMiddleware.js";
const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(authitacted, authorizeRoles("admin"), createCategory);
categoryRouter
  .route("/:categoryID")
  .put(authitacted, authorizeRoles("admin"), UpdateCategory)
  .delete(authitacted, authorizeRoles("admin"), destoryCategory);
categoryRouter.route("/categories").get(listCategory);
categoryRouter.route("/:id").get(readCategory);
export default categoryRouter;
