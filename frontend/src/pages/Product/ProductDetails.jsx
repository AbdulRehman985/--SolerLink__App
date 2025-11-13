import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCreateReviewMutation, useGetProductDetailsQuery } from "../../redux/api/ProductApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import HeartIcon from "./HeartIcon";
import ReadMoreText from "../../components/ReadMore";
import ProductTabs from "./ProductTabs";
import Rating from "./Rating";
import { addToCart } from "../../redux/features/Cart/CartSlice";

import { FaBox, FaClock, FaShoppingCart, FaStore, FaArrowLeft, FaTag, FaCheckCircle } from "react-icons/fa";

const ProductDetails = () => {
  const { slug } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: Product, isLoading, error, refetch } = useGetProductDetailsQuery(slug);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ ProductId: Product._id, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error(err?.data?.error || err?.message || err);
    }
  };

  const addToCartHandler = () => {
    try {
      dispatch(addToCart({ ...Product, qty }));
      navigate("/");
      toast.success(`${Product.name} added to cart`);
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.message || error}</Message>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 ml-15 text-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#FEC84B] hover:text-[#FFD700] transition font-medium mb-6 group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      {/* MAIN PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex flex-col lg:flex-row">

            {/* IMAGE SECTION */}
            <div className="relative lg:w-1/2 p-6 lg:p-8">
              <div className="relative group">
                <img
                  src={Product.image}
                  alt={Product.name}
                  className="rounded-xl shadow-2xl w-full h-auto max-h-[500px] object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={Product} />
                </div>

                {/* Stock Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${Product.countInStock > 0
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
                  }`}>
                  {Product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="lg:w-1/2 p-6 lg:p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
              {/* Product Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FaTag className="text-[#FEC84B] text-sm" />
                  <span className="text-gray-400 text-sm uppercase tracking-wide">{Product.brand}</span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {Product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <Rating value={Product.rating} color="#FEC84B" />
                  <span className="text-gray-400">({Product.numReviews} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-[#FEC84B]">
                  PKR {Product.price}
                </p>
                <p className="text-gray-400 text-sm mt-1">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <ReadMoreText text={Product.description} />
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <FaStore className="text-[#FEC84B] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Brand</p>
                    <p className="font-medium">{Product.brand}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <FaClock className="text-[#FEC84B] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Added</p>
                    <p className="font-medium">{moment(Product.createdAt).fromNow()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <FaShoppingCart className="text-[#9FE870] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Available Quantity</p>
                    <p className="font-medium">{Product.quantity} units</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <FaBox className="text-[#9FE870] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">In Stock</p>
                    <p className="font-medium">{Product.countInStock} items</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              {Product.countInStock > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Quantity
                      </label>
                      <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-[#FEC84B] focus:border-transparent transition-all"
                      >
                        {[...Array(Product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={addToCartHandler}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl duration-300 mt-6"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaShoppingCart />
                        Add To Cart
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <FaCheckCircle />
                    <span>Free shipping on orders over PKR 5000</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-semibold">Out of Stock</p>
                  <p className="text-gray-400 text-sm mt-1">We'll restock soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={Product}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;