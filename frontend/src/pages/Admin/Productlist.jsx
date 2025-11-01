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
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

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
      if (data.error) toast.error("Product creation failed. Try again.");
      else {
        toast.success(`${data.name} created successfully`);
        navigate("/");
      }
    } catch (error) {
      toast.error("Product creation failed.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.imageUrl);
      setImageUrl(res.imageUrl);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[#0B0C10] rounded-xl shadow-lg border border-gray-800 text-white mt-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400">
        ⚙️ Add New Product
      </h2>

      <AdminMenu />

      {imageUrl && (
        <div className="flex justify-center mb-4">
          <img
            src={imageUrl}
            alt="product"
            className="h-36 object-contain rounded-lg border border-yellow-400/40 shadow-md shadow-yellow-600/30 p-2 bg-[#101113]"
          />
        </div>
      )}

      <label className="block w-full cursor-pointer mb-4 text-center border border-dashed border-yellow-500/40 py-4 rounded-xl hover:border-yellow-400 transition-all duration-300">
        <span className="text-gray-300 text-sm">
          {image ? image.name : "📸 Click to Upload Product Image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={uploadFileHandler}
          className="hidden"
        />
      </label>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Product Name", value: name, setValue: setName },
            { label: "Price ($)", value: price, setValue: setPrice, type: "number" },
            { label: "Quantity", value: quantity, setValue: setQuantity, type: "number" },
            { label: "Brand", value: brand, setValue: setBrand },
            { label: "Stock Count", value: stock, setValue: setStock, type: "number" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block mb-1 text-xs text-gray-400">{field.label}</label>
              <input
                type={field.type || "text"}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                required
                className="w-full p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition outline-none text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 text-xs text-gray-400">Category</label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition outline-none text-sm"
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

        <div>
          <label className="block mb-1 text-xs text-gray-400">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition outline-none h-28 resize-none text-sm"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all duration-300 text-sm"
          >
            {isLoading ? "Submitting..." : "Submit Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Productlist;
