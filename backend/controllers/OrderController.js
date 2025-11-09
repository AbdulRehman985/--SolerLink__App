import expressAsyncHandler from "express-async-handler";
import { Product } from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";
import { User } from "../models/userModel.js";

function calcPrice(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}

export const createOrder = expressAsyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order found");
    }

    const itemsFromDb = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDb = itemsFromDb.find(
        (itemFromDb) => itemFromDb._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDb) {
        res.status(404);
        throw new Error(`Product Not Found ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDb.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrice(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error?.message });
    console.error(error);
  }
});
export const getAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sort, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    // Sorting
    const sortFormatted = (() => {
      try {
        const parsed = JSON.parse(sort);
        return parsed?.field
          ? { [parsed.field]: parsed.sort === "asc" ? 1 : -1 }
          : { createdAt: -1 };
      } catch {
        return { createdAt: -1 };
      }
    })();

    // Search filter
    let searchFilter = {};
    if (search) {
      if (!isNaN(Number(search))) {
        searchFilter.totalPrice = Number(search);
      } else {
        const users = await User.find({
          username: { $regex: search, $options: "i" },
        }).select("_id");

        const userIds = users.map((u) => u._id);

        searchFilter = {
          $or: [
            { user: { $in: userIds } },
            { paymentMethod: { $regex: search, $options: "i" } },
          ],
        };
      }
    }

    // Parallel queries
    const [orders, total] = await Promise.all([
      Order.find(searchFilter)
        .populate("user", "username email")
        .sort(sortFormatted)
        .skip(skip)
        .limit(Number(pageSize))
        .lean(),
      Order.countDocuments(searchFilter),
    ]);

    res.status(200).json({
      success: true,
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getUserOrders = expressAsyncHandler(async (req, res) => {
  try {
    const getUserOrder = await Order.find({ user: req.user._id });
    res.json(getUserOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const countTotalOrder = expressAsyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const calculateTotalSale = expressAsyncHandler(async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = result.length > 0 ? result[0].totalSales : 0;

    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const calculateTotalSaleByDates = expressAsyncHandler(
  async (req, res) => {
    try {
      const salesByDate = await Order.aggregate([
        {
          $match: {
            isPaid: true,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
            },
            totalSales: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.json(salesByDate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
export const findOrderById = expressAsyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user", // make sure this matches your schema field
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not Found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export const markOrderAsPaid = expressAsyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // order.paymentResult = {
      //   id: req.body.id,
      //   status: req.body.status,
      //   update_time: req.body.update_time,
      //   email_address: req.body.payer.email_address,
      // };
      const updateOrder = await order.save();
      res.status(201).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const markOrderAsDeliverd = expressAsyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliverdAt = Date.now();
      const updateOrder = await order.save();
      res.status(201).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
