import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false }, // keep old code working
    role: {
      type: String,
      enum: ["user", "shopkeeper", "admin"],
      default: "user",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Keep backward compatibility  autoset role if isAdmin true
userSchema.pre("save", function (next) {
  if (this.isAdmin) this.role = "admin";
  next();
});

export const User = mongoose.model("User", userSchema);
