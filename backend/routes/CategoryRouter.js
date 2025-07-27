import express from "express";
import {
  createCategory,
  destoryCategory,
  listCategory,
  readCategory,
  UpdateCategory,
} from "../controllers/CategoryController.js";
import {
  authitacted,
  authorizedIsAdmin,
} from "../middleware/authMiddleware.js";
const categoryRouter = express.Router();

categoryRouter.route("/").post(authitacted, authorizedIsAdmin, createCategory);
categoryRouter
  .route("/:categoryID")
  .put(authitacted, authorizedIsAdmin, UpdateCategory)
  .delete(authitacted, authorizedIsAdmin, destoryCategory);
categoryRouter.route("/categories").get(listCategory);
categoryRouter.route("/:id").get(readCategory);
export default categoryRouter;
