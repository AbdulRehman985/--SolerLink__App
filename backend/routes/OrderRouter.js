import express from "express";
import {
  authitacted,
  authorizedIsAdmin,
} from "../middleware/authMiddleware.js";
import {
  calculateTotalSale,
  countTotalOrder,
  createOrder,
  getAllOrders,
  getUserOrders,
  calculateTotalSaleByDates,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDeliverd
} from "../controllers/OrderController.js";
import Order from "../models/OrderModel.js";

export const OrderRouter = express.Router();

OrderRouter.route("/")
  .post(authitacted, createOrder)
  .get(authitacted, authorizedIsAdmin, getAllOrders);
OrderRouter.route("/mine").get(authitacted, getUserOrders);
OrderRouter.route("/total-order").get(countTotalOrder);
OrderRouter.route("/total-sales").get(calculateTotalSale);
OrderRouter.route("/total-sales-by-date").get(calculateTotalSaleByDates);
OrderRouter.route("/:id").get(findOrderById);
OrderRouter.route("/:id/pay").put(authitacted, markOrderAsPaid);
OrderRouter.route("/:id/deliver").put(
  authitacted,
  authorizedIsAdmin,
  markOrderAsDeliverd
);
