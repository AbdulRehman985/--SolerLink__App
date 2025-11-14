import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/ProductApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/CategorySlice.js";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";
import Loader from "../../components/Loader.jsx";

const UpdateProduct = () => {
  const { slug } = useParams();
  console.log("🚀 ~ UpdateProduct ~  slug:", slug)
  const navigate = useNavigate();
  const { data: productData, isLoading: productLoading } = useGetProductByIdQuery(slug);
  const { data: categories } = useFetchCategoriesQuery();

  const [uploadProductImage, { isLoading: imageLoader }] = useUploadProductImageMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  console.log("🚀 ~ UpdateProduct ~ stock:", stock)
  const [serialNumbers, setSerialNumbers] = useState([""]);

  const selectedCategoryObj = categories?.find((c) => c._id === category);
  const showSerialSection = selectedCategoryObj?.isSerialTracked || false;
  // ✅ Pre-fill data
  useEffect(() => {
    if (productData) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category || "");
      setBrand(productData.brand || "");
      setQuantity(productData.quantity || "");
      setStock(productData.countInStock || 0);
      setImage(productData.image || "");
      setImageUrl(productData.image || "");
      setSerialNumbers(productData.serialNumbers || [""]);
    }
  }, [productData]);

  // ✅ Handle serial inputs
  const handleSerialChange = (index, value) => {
    const updated = [...serialNumbers];
    updated[index] = value;
    setSerialNumbers(updated);
  };

  const addSerialInput = () => setSerialNumbers([...serialNumbers, ""]);
  const removeSerialInput = (index) =>
    setSerialNumbers(serialNumbers.filter((_, i) => i !== index));

  // ✅ Image upload
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.imageUrl);
      setImageUrl(res.imageUrl);
    } catch (error) {
      toast.error(error?.data?.message || "Image upload failed");
    }
  };

  const getSerialNumbersArray = () => {
    if (!showSerialSection) return [];
    return serialNumbers
      .flatMap((sn) => sn.split(","))
      .map((sn) => sn.trim())
      .filter((sn) => sn !== "");
  };

  // ✅ Submit handler
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

      if (showSerialSection) {
        const serialArray = getSerialNumbersArray();
        if (serialArray.length !== Number(quantity)) {
          return toast.error(`Please provide exactly ${quantity} serial numbers.`);
        }
        formData.append("serialNumbers", serialArray.join(","));
      }

      const { data } = await updateProduct({ productId: slug, formData });
      console.log(data)
      if (data?.error) toast.error(data.error || "Product update failed.");
      else {
        toast.success(`${data.product.name} updated successfully`);
        navigate("/admin/allproduct");
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed.");
    }
  };

  // ✅ Delete product
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await deleteProduct(productData._id);
      toast.success(`${data.name} deleted successfully`);
      navigate("/admin/allproduct");
    } catch (error) {
      console.log(error);
      toast.error("Delete failed.");
    }
  };

  if (productLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[#0B0C10] rounded-xl shadow-lg border border-gray-800 text-white mt-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400">
        🛠️ Update Product
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

      {imageLoader ? (
        <Loader />
      ) : (
        <label className="block w-full cursor-pointer mb-4 text-center border border-dashed border-yellow-500/40 py-4 rounded-xl hover:border-yellow-400 transition-all duration-300">
          <span className="text-gray-300 text-sm">
            {image ? "Image uploaded" : " Click to Upload Product Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={uploadFileHandler}
            className="hidden"
          />
        </label>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Product Name", value: name, setValue: setName },
            { label: "Price (PKR)", value: price, setValue: setPrice, type: "number" },
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
                className="w-full p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-sm"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 text-xs text-gray-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-sm"
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

        {showSerialSection && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <label className="block mb-2 text-xs text-gray-400 font-semibold">
              Serial Numbers (for {selectedCategoryObj?.name})
            </label>

            {/* Textarea for bulk input */}
            <textarea
              placeholder="Paste comma-separated serial numbers here (e.g. SN001, SN002, SN003)"
              onChange={(e) => {
                const values = e.target.value
                  .split(",")
                  .map((sn) => sn.trim())
                  .filter((sn) => sn);
                setSerialNumbers(values);
              }}
              className="w-full p-2.5 mb-3 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-sm"
            ></textarea>

            {/* Individual inputs */}
            {serialNumbers.map((sn, index) => (
              <div key={index} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  placeholder={`Serial Number ${index + 1}`}
                  value={sn}
                  onChange={(e) => handleSerialChange(index, e.target.value)}
                  className="flex-1 p-2.5 bg-[#101113] border border-gray-700 rounded-lg text-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSerialInput(index)}
                  className="px-3 py-1 bg-red-500 rounded-lg text-white hover:bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSerialInput}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
            >
              + Add Serial Number
            </button>
            <p className="text-gray-400 text-xs mt-1">
              You can either add serial numbers manually or paste them all at once (comma-separated).
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md text-sm"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>

          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all duration-300 text-sm"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
