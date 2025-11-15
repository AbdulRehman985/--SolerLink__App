import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { Product } from "../models/ProductModel.js";
import { SerialNumber } from "../models/SerialNumberModel.js";
import Category from "../models/CategoryModel.js";
import slugify from "slugify";
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
    // Generate unique slug
    const baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    let existingProduct = await Product.findOne({ slug });

    let count = 1;
    while (existingProduct) {
      slug = `${baseSlug}-${count++}`;
      existingProduct = await Product.findOne({ slug });
    }

    // Create product
    const newProduct = new Product({ ...req.fields, slug });
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
// export const updateProductDetails = asyncHandler(async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       brand,
//       image,
//       serialNumbers,
//     } = req.fields;

//     const { slug } = req.params;
//     console.log("🚀 ~ slug :", slug);

//     // ✅ Validate fields
//     if (!name) return res.status(400).json({ error: "Name is required" });
//     if (!description)
//       return res.status(400).json({ error: "Description is required" });
//     if (!price) return res.status(400).json({ error: "Price is required" });
//     if (!category)
//       return res.status(400).json({ error: "Category is required" });
//     if (!mongoose.Types.ObjectId.isValid(category))
//       return res.status(400).json({ error: "Invalid category ID" });
//     if (!quantity)
//       return res.status(400).json({ error: "Quantity is required" });
//     if (!brand) return res.status(400).json({ error: "Brand is required" });
//     if (!image) return res.status(400).json({ error: "Image is required" });

//     //  Find product
//     const product = await Product.findOne({ slug });
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     //  Update slug if name changed
//     if (name && name !== product.name) {
//       const baseSlug = slugify(name, { lower: true, strict: true });
//       let slug = baseSlug;
//       let existingProduct = await Product.findOne({
//         slug,
//         _id: { $ne: id },
//       });
//       let count = 1;
//       while (existingProduct) {
//         slug = `${baseSlug}-${count++}`;
//         existingProduct = await Product.findOne({
//           slug,
//           _id: { $ne: id },
//         });
//       }
//       product.slug = slug;
//       product.name = name;
//     }

//     // Update other fields
//     product.description = description;
//     product.price = price;
//     product.category = category;
//     product.quantity = quantity;
//     product.brand = brand;
//     product.image = image;

//     //  Handle serial numbers
//     const categoryData = await Category.findById(category);
//     let serialsArray = [];

//     if (categoryData?.isSerialTracked) {
//       if (!serialNumbers) {
//         return res.status(400).json({
//           error: `Serial numbers are required for category ${categoryData.name}`,
//         });
//       }

//       // Clean serial numbers array
//       if (typeof serialNumbers === "string") {
//         serialsArray = serialNumbers
//           .split(",")
//           .map((sn) => sn.trim())
//           .filter((sn) => sn !== "");
//       } else if (Array.isArray(serialNumbers)) {
//         serialsArray = serialNumbers.map((sn) => sn.trim());
//       }

//       if (serialsArray.length !== Number(quantity)) {
//         return res.status(400).json({
//           error: `Please provide exactly ${quantity} serial numbers.`,
//         });
//       }

//       await SerialNumber.deleteMany({ product: product._id });

//       const serialDocs = serialsArray.map((sn) => ({
//         serialNumber: sn,
//         product: product._id,
//         status: "available",
//       }));

//       await SerialNumber.insertMany(serialDocs);
//     } else {
//       // If category not serial tracked clear old serials
//       await SerialNumber.deleteMany({ product: product._id });
//     }

//     await product.save();

//     res.status(200).json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error(" Update product error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
export const updateProductDetails = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    const { slug } = req.params;
    console.log("🚀 ~ Updating product with slug:", slug);

    // ✅ Validate required fields
    const requiredFields = {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image,
    };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value && value !== 0) {
        // Allow zero quantity
        res.status(400);
        throw new Error(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        );
      }
    }

    // ✅ Validate quantity is positive number
    if (quantity < 0) {
      res.status(400);
      throw new Error("Quantity cannot be negative");
    }

    // ✅ Find product
    const product = await Product.findOne({ slug }).session(session);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // ✅ Check if category exists
    const categoryData = await Category.findById(category).session(session);
    if (!categoryData) {
      res.status(404);
      throw new Error("Category not found");
    }

    // ✅ Update slug if name changed
    if (name && name !== product.name) {
      const baseSlug = slugify(name, { lower: true, strict: true });
      let newSlug = baseSlug;
      let count = 1;

      let existingProduct = await Product.findOne({
        slug: newSlug,
        _id: { $ne: product._id },
      }).session(session);

      while (existingProduct) {
        newSlug = `${baseSlug}-${count++}`;
        existingProduct = await Product.findOne({
          slug: newSlug,
          _id: { $ne: product._id },
        }).session(session);
      }

      product.slug = newSlug;
    }

    // ✅ Store old values
    const oldQuantity = product.quantity;
    const oldCategory = product.category.toString();
    const categoryChanged = oldCategory !== category;

    // ✅ Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.image = image;
    product.countInStock = quantity;

    // ✅ Handle serial numbers
    if (categoryData.isSerialTracked) {
      await handleSerialTrackedProduct(
        product,
        serialNumbers,
        quantity,
        session
      );
    } else {
      // Remove serial numbers if category is not serial tracked
      await SerialNumber.deleteMany({ product: product._id }).session(session);
    }

    // ✅ Save product
    await product.save({ session });

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    // ✅ Populate category for response
    const updatedProduct = await Product.findById(product._id).populate(
      "category",
      "name isSerialTracked"
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    // ✅ Rollback transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Update product error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

// ✅ FIXED: Handle serial tracked products
const handleSerialTrackedProduct = async (
  product,
  serialNumbers,
  quantity,
  session
) => {
  // Validate serial numbers are provided
  if (!serialNumbers) {
    throw new Error(`Serial numbers are required for serial-tracked products`);
  }

  // Parse serial numbers
  let serialsArray = [];
  if (typeof serialNumbers === "string") {
    serialsArray = serialNumbers
      .split(",")
      .map((sn) => sn.trim())
      .filter((sn) => sn !== "");
  } else if (Array.isArray(serialNumbers)) {
    serialsArray = serialNumbers.map((sn) => sn.trim());
  }

  console.log(
    `🔢 Serial numbers validation: Required ${quantity}, Received ${serialsArray.length}`
  );

  // ✅ FIXED: Proper validation with detailed logging
  if (serialsArray.length !== Number(quantity)) {
    console.log(
      `❌ Validation failed: Required ${quantity}, Got ${serialsArray.length}`
    );
    console.log(`📋 First few serials:`, serialsArray.slice(0, 5));
    throw new Error(
      `Please provide exactly ${quantity} serial numbers. Received: ${serialsArray.length}`
    );
  }

  // Check for empty serial numbers
  const emptySerials = serialsArray.filter((sn) => !sn);
  if (emptySerials.length > 0) {
    throw new Error(`Found ${emptySerials.length} empty serial numbers`);
  }

  // Check for duplicate serial numbers in the input
  const uniqueSerials = [...new Set(serialsArray)];
  if (uniqueSerials.length !== serialsArray.length) {
    throw new Error(`Duplicate serial numbers found in input`);
  }

  // Check for duplicate serial numbers in database (other products)
  const duplicateSerials = await SerialNumber.find({
    serialNumber: { $in: serialsArray },
    product: { $ne: product._id },
  }).session(session);

  if (duplicateSerials.length > 0) {
    throw new Error(
      `Serial numbers already exist: ${duplicateSerials
        .map((s) => s.serialNumber)
        .join(", ")}`
    );
  }

  // ✅ Delete existing serials and create new ones
  await SerialNumber.deleteMany({ product: product._id }).session(session);

  const serialDocs = serialsArray.map((serialNumber) => ({
    serialNumber,
    product: product._id,
    status: "available",
  }));

  await SerialNumber.insertMany(serialDocs, { session });

  console.log(`✅ Successfully created ${serialDocs.length} serial numbers`);
};
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
    const product = await Product.findOne({ slug: req.params.id });
    console.log("🚀 ~ req.params.slug:", req.params.id);
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
