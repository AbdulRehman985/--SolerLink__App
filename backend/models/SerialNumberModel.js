import mongoose from "mongoose";

const SerialSchema = new mongoose.Schema(
  {
    serialNumber: { type: Number, unique: true, required: true },
  },
  { timestamps: true }
);

export const SerialNumber = mongoose.model("Serial", SerialSchema);
