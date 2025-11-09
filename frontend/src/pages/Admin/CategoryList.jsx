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
    if (!name) return toast.error("Category name is required");
    try {
      const res = await createCategory({ name }).unwrap();
      toast.success(`${res.name} created successfully`);
      setName("");
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save category");
      console.log(error)
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updateName) return toast.error("Category is required");
    try {
      const result = await updateCategory({
        categoryID: selectedCategory._id,
        updateCategory: { name: updateName },
      }).unwrap();
      toast.success(`${result.name} updated successfully`);
      setSelectedCategory(null);
      setUpdateName("");
      setModelVisible(false);
    } catch (error) {
      toast.error(error?.message || "Update failed");
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await deleteCategory({
        categoryID: selectedCategory._id,
      }).unwrap();
      toast.success(`${result.name} deleted`);
      setSelectedCategory(null);
      setModelVisible(false);
    } catch (error) {
      toast.error(error?.message || "Delete failed");
    }
  };

  return (
    <div className="ml-0 md:ml-16 px-4 md:px-6 py-6 text-white min-h-screen">
      <AdminMenu />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400">
          ⚙️ Manage Categories
        </h2>

        {/* Add Category Form */}
        <div className="bg-[#101113] border border-gray-700 rounded-xl shadow-md shadow-yellow-500/10 p-5 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">
            ➕ Add New Category
          </h3>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </div>

        {/* Existing Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">
            📂 Existing Categories
          </h3>

          {categories?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => {
                    setModelVisible(true);
                    setSelectedCategory(category);
                    setUpdateName(category.name);
                  }}
                  className="bg-gradient-to-r from-yellow-400/20 to-orange-400/10 
                    border border-yellow-500/30 rounded-lg py-2 px-4 
                    hover:from-yellow-400/40 hover:to-orange-400/30 
                    hover:border-yellow-400 text-yellow-300 font-medium 
                    shadow-md hover:shadow-yellow-400/20 transition-all duration-300 text-sm"
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No categories found.</p>
          )}
        </div>

        {/* Modal for Update/Delete */}
        <Model isOpen={modelVisible} onclose={() => setModelVisible(false)}>
          <CategoryForm
            value={updateName}
            setValue={setUpdateName}
            buttonText="Update"
            handleSubmit={handleUpdateCategory}
            handleDeleted={handleDeleteCategory}
          />
        </Model>
      </div>
    </div>
  );
};

export default CategoryList;
