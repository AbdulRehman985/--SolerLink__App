import express, { Router } from "express";
import { authitacted, authorizeRoles } from "../middleware/authMiddleware.js";
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
  filterdProduct,
  updateProductDetails,
} from "../controllers/ProductController.js";
import checkId from "../middleware/CheckId.js";
import { uploadToCloudinary } from "../middleware/uploadToCloudinary.js";
const productRouter = express.Router();

productRouter
  .route("/")
  .get(fetchProduct)
  .post(
    uploadToCloudinary,
    authitacted,
    authorizeRoles("admin"),
    formidable(),
    addProduct
  );
productRouter.route("/allproducts").get(fetchallProduct);
productRouter
  .route("/:id/reviews")
  .post(
    authitacted,
    authorizeRoles("user", "shopkeeper", "admin"),
    checkId,
    addProductReviews
  );
productRouter.get("/top", fetchTopProduct);
productRouter.get("/new", fetchNewProduct);
productRouter
  .route("/:slug")
  .put(
    authitacted,
    authorizeRoles("admin"),
    formidable(),
    updateProductDetails
  );
productRouter
  .route("/:id")
  .get(fetchProductById)
  .delete(authitacted, authorizeRoles("admin"), formidable(), destroyProduct);
productRouter.route("/filterd-product").post(filterdProduct);
export default productRouter;
