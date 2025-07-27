import CategoryModel from "../models/CategoryModel.js";
import asyncHandler from "express-async-handler";
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = await new CategoryModel({ name }).save();
    return res.status(201).json(category); // 201 = created
  } catch (error) {
    console.error("Create Category Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryID } = req.params;
    const category = await CategoryModel.findOne({ _id: categoryID });
    if (!category) {
      return res.status(404).json({ error: "Category Not Found" });
    }
    category.name = name;
    const UpdateCategory = await category.save();
    res.json(UpdateCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const destoryCategory = async (req, res) => {
  try {
    const delCategory = await CategoryModel.findByIdAndDelete(
      req.params.categoryID
    );
    res.json(delCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listCategory = asyncHandler(async (req, res) => {
  try {
    const alllist = await CategoryModel.find({});
    res.json(alllist);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});
export const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await CategoryModel.findById({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});
