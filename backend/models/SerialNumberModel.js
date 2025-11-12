import mongoose from "mongoose";

const SerialSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["available", "assigned", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const SerialNumber = mongoose.model("serialNumber", SerialSchema);
