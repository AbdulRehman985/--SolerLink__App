import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Product } from "../models/ProductModel.js";
import { SerialNumber } from "../models/SerialNumberModel.js";
import Category from "../models/CategoryModel.js";

export const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image,
      serialNumbers,
    } = req.fields;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!description)
      return res.status(400).json({ error: "Description is required" });
    if (!price) return res.status(400).json({ error: "Price is required" });
    if (!category)
      return res.status(400).json({ error: "Category is required" });
    if (!mongoose.Types.ObjectId.isValid(category))
      return res.status(400).json({ error: "Invalid category ID" });
    if (!quantity)
      return res.status(400).json({ error: "Quantity is required" });
    if (!brand) return res.status(400).json({ error: "Brand is required" });
    if (!image) return res.status(400).json({ error: "Image is required" });

    // Check if category requires serial numbers
    const categoryData = await Category.findById(category);
    let serialsArray = [];

    if (categoryData?.isSerialTracked) {
      if (!serialNumbers)
        return res.status(400).json({
          error: `Serial numbers are required for category ${categoryData.name}`,
        });

      if (typeof serialNumbers === "string") {
        serialsArray = serialNumbers
          .split(",")
          .map((sn) => sn.trim())
          .filter((sn) => sn !== "");
      } else if (Array.isArray(serialNumbers)) {
        serialsArray = serialNumbers.map((sn) => sn.trim());
      }

      if (serialsArray.length !== Number(quantity)) {
        return res.status(400).json({
          error: `Please provide exactly ${quantity} serial numbers.`,
        });
      }
    }

    // Create product
    const newProduct = new Product({ ...req.fields });
    await newProduct.save();

    // Insert serial numbers
    if (categoryData?.isSerialTracked && serialsArray.length > 0) {
      const serialDocs = serialsArray.map((sn) => ({
        serialNumber: sn,
        product: newProduct._id,
        status: "available",
      }));

      await SerialNumber.insertMany(serialDocs);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image,
      serialNumbers,
    } = req.fields;

    // ✅ Validate inputs
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!description)
      return res.status(400).json({ error: "Description is required" });
    if (!price) return res.status(400).json({ error: "Price is required" });
    if (!category)
      return res.status(400).json({ error: "Category is required" });
    if (!mongoose.Types.ObjectId.isValid(category))
      return res.status(400).json({ error: "Invalid category ID" });
    if (!quantity)
      return res.status(400).json({ error: "Quantity is required" });
    if (!brand) return res.status(400).json({ error: "Brand is required" });
    if (!image) return res.status(400).json({ error: "Image is required" });
    // ✅ Find existing product
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // ✅ Update basic product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.image = image;
    await product.save();

    // ✅ Handle serial numbers
    const categoryData = await Category.findById(category);
    let serialsArray = [];

    if (categoryData?.isSerialTracked) {
      if (!serialNumbers) {
        return res.status(400).json({
          error: `Serial numbers are required for category ${categoryData.name}`,
        });
      }

      // Convert serialNumbers into clean array
      if (typeof serialNumbers === "string") {
        serialsArray = serialNumbers
          .split(",")
          .map((sn) => sn.trim())
          .filter((sn) => sn !== "");
      } else if (Array.isArray(serialNumbers)) {
        serialsArray = serialNumbers.map((sn) => sn.trim());
      }

      if (serialsArray.length !== Number(quantity)) {
        return res.status(400).json({
          error: `Please provide exactly ${quantity} serial numbers.`,
        });
      }

      // ✅ Remove old serials
      await SerialNumber.deleteMany({ product: product._id });

      // ✅ Insert new serial numbers (avoid duplicates)
      const serialDocs = serialsArray.map((sn) => ({
        serialNumber: sn,
        product: product._id, // 🔥 FIXED (was Product._id)
        status: "available",
      }));

      await SerialNumber.insertMany(serialDocs);
    } else {
      // If category is not serial tracked, remove any old serials
      await SerialNumber.deleteMany({ product: product._id });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({ error: error.message });
  }
});

export const destroyProduct = asyncHandler(async (req, res) => {
  try {
    const delproduct = await Product.findByIdAndDelete(req.params.id);
    res.json(delproduct);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});
export const fetchProduct = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const product = await Product.find({ ...keyword }).limit(pageSize);
    res.json({
      product,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

export const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product Not found" });
  }
});
export const fetchallProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch all products error:", error);
    res.status(500).json(error);
  }
});

export const addProductReviews = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: "Product already reviewed" });
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error("Error adding review:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export const fetchTopProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error("Error fetching top products:", error.message);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});
export const fetchNewProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error("Error fetching New products:", error.message);
    res.status(500).json({ error: "Failed to fetch New products" });
  }
});

export const filterdProduct = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await Product.find(args);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
