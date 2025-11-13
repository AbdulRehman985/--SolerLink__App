import mongoose from "mongoose";
import express from "express";
import path, { dirname } from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import categoryRouter from "./routes/CategoryRouter.js";
import productRouter from "./routes/ProductRouter.js";
import UploadRouter from "./routes/FileUploadRouter.js";
import { OrderRouter } from "./routes/OrderRouter.js";
import Order from "./models/OrderModel.js";
import { User } from "./models/userModel.js";
import { Product } from "./models/ProductModel.js";
import slugify from "slugify";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();
async function updateSlugs() {
  try {
    const products = await Product.find();

    for (const product of products) {
      // Skip if slug already exists
      if (product.slug) continue;

      // Create slug from product name
      const slug = slugify(product.name, { lower: true, strict: true });
      product.slug = slug;
      await product.save();
      console.log(`Updated slug for: ${product.name} → ${slug}`);
    }

    console.log("All products updated with slugs!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error updating slugs:", error);
    mongoose.disconnect();
  }
}

// updateSlugs();
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", UploadRouter);
app.use("/api/orders", OrderRouter);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
