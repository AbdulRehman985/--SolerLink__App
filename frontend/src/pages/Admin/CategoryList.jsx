import React, { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/CategorySlice";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "react-toastify";
import Model from "../../components/Model";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [modelVisible, setModelVisible] = useState(false);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const res = await createCategory({ name }).unwrap();
      toast.success(`${res.name} is created`);
      setName("");
    } catch (error) {
      toast.error(error?.data?.error || "Category not saved. Try again.");
      console.error("Create Category Error:", error);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updateName) {
      toast.error("Category is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryID: selectedCategory._id,
        updateCategory: {
          name: updateName,
        },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdateName("");
        setModelVisible(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };
  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await deleteCategory({
        categoryID: selectedCategory._id,
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is Deleted`);
        setSelectedCategory(null);
        setModelVisible(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    }
  };
  return (
    <div className="ml-0 md:ml-40 px-4 py-6">
      <AdminMenu />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Categories
        </h2>

        {/* Category Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Add New Category
          </h3>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 my-6" />

        {/* Category List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Existing Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <button
                key={category._id}
                className="bg-pink-50 text-pink-600 border border-pink-400 rounded-lg py-2 px-4 hover:bg-pink-500 hover:text-white transition duration-200"
                onClick={() => {
                  setModelVisible(true);
                  setSelectedCategory(category);
                  setUpdateName(category.name);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
          <Model isOpen={modelVisible} onclose={() => setModelVisible(false)}>
            <CategoryForm
              value={updateName}
              setValue={(e) => setUpdateName(e)}
              buttonText="Update"
              handleSubmit={handleUpdateCategory}
              handleDeleted={handleDeleteCategory}
            />
          </Model>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
