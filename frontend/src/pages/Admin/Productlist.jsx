import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/ProductApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/CategorySlice.js";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";

const Productlist = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();
  console.log(imageUrl);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1a1a1a] rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>
      <AdminMenu />

      {imageUrl && (
        <div className="flex justify-center mb-4">
          <img
            src={imageUrl}
            alt="product"
            className="h-48 object-contain rounded-lg"
          />
        </div>
      )}

      <label className="block w-full cursor-pointer mb-6 text-center border-2 border-dashed py-8 rounded-lg hover:bg-[#2c2c2c] transition">
        <span className="font-semibold text-gray-300">
          {image ? image.name : "Click to upload image"}
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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 transition text-white py-3 px-6 rounded-lg font-semibold text-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Productlist;
