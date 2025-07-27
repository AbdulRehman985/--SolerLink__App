import express, { Router } from "express";
import {
  authitacted,
  authorizedIsAdmin,
} from "../middleware/authMiddleware.js";
import formidable from "express-formidable";
import {
  addProduct,
  addProductReviews,
  destroyProduct,
  fetchallProduct,
  fetchNewProduct,
  fetchProduct,
  fetchProductById,
  fetchTopProduct,
  updateProductDetails,
} from "../controllers/ProductController.js";
import checkId from "../middleware/CheckId.js";
const productRouter = express.Router();

productRouter
  .route("/")
  .get(fetchProduct)
  .post(authitacted, authorizedIsAdmin, formidable(), addProduct);
productRouter.route("/allproducts").get(fetchallProduct);
productRouter
  .route("/:id/reviews")
  .post(authitacted, checkId, addProductReviews);
productRouter.get("/top", fetchTopProduct);
productRouter.get("/new", fetchNewProduct);
productRouter
  .route("/:id")
  .get(fetchProductById)
  .put(authitacted, authorizedIsAdmin, formidable(), updateProductDetails)
  .delete(authitacted, authorizedIsAdmin, formidable(), destroyProduct);

export default productRouter;
