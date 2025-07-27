import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/ProductApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/CategorySlice";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
const Updateproduct = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id); // not _id

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState("");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setCategory(productData.category);
      setBrand(productData.brand);
      setQuantity(productData.quantity);
      setPrice(productData.price);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      const { data } = await updateProduct({
        productId: params._id,
        formData: formData,
      });
      if (data.error) {
        toast.error("Product update failed. Try again.");
      } else {
        toast.success(`${data.name} is updated.`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleDelete = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirm) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`${data.name} is deleted.`);
      navigate("/admin/allproduct");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1a1a] rounded-xl shadow-lg text-white mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
      <AdminMenu />

      {image && (
        <div className="flex justify-center mb-4">
          <img
            src={`http://localhost:5001${image}`}
            alt="product"
            className="h-48 object-contain rounded-lg"
          />
        </div>
      )}

      <label className="block w-full cursor-pointer mb-6 text-center border-2 border-dashed py-8 rounded-lg hover:bg-[#2c2c2c] transition">
        <span className="font-semibold text-gray-300">
          {image ? image.name || "Image uploaded" : "Click to upload image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={uploadFileHandler}
          className="hidden"
        />
      </label>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Quantity</label>
            <input
              type="number"
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Brand</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Count In Stock</label>
            <input
              type="number"
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <select
              className="w-full p-3 rounded bg-[#101011] border border-gray-600"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Choose Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-3 rounded bg-[#101011] border border-gray-600 h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white py-3 px-6 rounded-lg font-semibold text-lg"
            type="submit"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 transition text-white py-3 px-6 rounded-lg font-semibold text-lg"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default Updateproduct;
