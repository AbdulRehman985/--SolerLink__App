import mongoose from "mongoose";

const categoryScheme = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 32,
  },
});
export default mongoose.model("Category", categoryScheme);
