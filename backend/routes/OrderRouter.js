import express from "express";
import { authitacted, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  calculateTotalSale,
  countTotalOrder,
  createOrder,
  getAllOrders,
  getUserOrders,
  calculateTotalSaleByDates,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDeliverd,
} from "../controllers/OrderController.js";

export const OrderRouter = express.Router();

OrderRouter.route("/")
  .post(authitacted, authorizeRoles("user", "shopkeeper", "admin"), createOrder)
  .get(authitacted, authorizeRoles("admin"), getAllOrders);
OrderRouter.route("/mine").get(
  authitacted,
  authorizeRoles("user", "shopkeeper", "admin"),
  getUserOrders
);
OrderRouter.route("/total-order").get(countTotalOrder);
OrderRouter.route("/total-sales").get(calculateTotalSale);
OrderRouter.route("/total-sales-by-date").get(calculateTotalSaleByDates);
OrderRouter.route("/:id").get(findOrderById);
OrderRouter.route("/:id/pay").put(authitacted, markOrderAsPaid);
OrderRouter.route("/:id/deliver").put(
  authitacted,
  authorizeRoles("admin"),
  markOrderAsDeliverd
);
