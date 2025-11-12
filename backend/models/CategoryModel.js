import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  isSerialTracked: { type: Boolean, default: false },
});
export default mongoose.model("Category", categorySchema);
