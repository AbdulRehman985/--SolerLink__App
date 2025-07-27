import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../../redux/api/ProductApiSlice";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import HeartIcon from "./HeartIcon";
import ReadMoreText from "../../components/ReadMore";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import Rating from "./Rating";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductTabs from "./ProductTabs";
const ProductDetails = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: Product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(id);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        ProductId: Product._id,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      // toast.error(error?.data || error.message);
      toast.error(error?.data?.error || error?.message || error);
    }
  };
  return (
    <div className="min-h-screen">
      {" "}
      <div className="">
        <Link to="/" className="ml-[10rem] font-bold text-white underline">
          Go back
        </Link>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message varient="danger">{error?.message || error}</Message>
      ) : (
        <>
          {" "}
          <div className="flex flex-wrap relative mt-[2rem] ml-[10rem] bg-[#2A2A2A] p-6 rounded-2xl shadow-lg max-w-5xl">
            {/* IMAGE */}
            <div className="relative">
              <img
                src={Product.image}
                alt={Product.name}
                className="w-full xl:w-[30rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] rounded-2xl shadow-md"
              />
              <HeartIcon product={Product} />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col justify-between ml-[3rem] text-gray-200">
              <h2 className="text-3xl font-bold mb-2">{Product.name}</h2>

              {/* Read More */}
              <ReadMoreText text={Product.description} />

              <p className="text-4xl mt-4 font-bold text-pink-400">
                ${Product.price}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
                <h1 className="flex items-center">
                  <FaStore className="mr-2 text-pink-400" /> Brand:{" "}
                  {Product.brand}
                </h1>
                <h1 className="flex items-center">
                  <FaClock className="mr-2 text-pink-400" /> Added:{" "}
                  {moment(Product.createdAt).fromNow()}
                </h1>
                <h1 className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" /> Reviews:{" "}
                  {Product.numReviews}
                </h1>
                <h1 className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" /> Rating:{" "}
                  {Product.rating}
                </h1>
                <h1 className="flex items-center">
                  <FaShoppingCart className="mr-2 text-green-400" /> Quantity:{" "}
                  {Product.quantity}
                </h1>
                <h1 className="flex items-center">
                  <FaBox className="mr-2 text-green-400" /> In Stock:{" "}
                  {Product.countInStock}
                </h1>
                <h1 className="flex items-center">
                  <Rating
                    value={Product.rating}
                    text={`${Product.numReviews} Reveiws`}
                  />
                </h1>
                {Product.countInStock > 0 && (
                  <div className="text-white">
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-white"
                    >
                      {[...Array(Product.countInStock).keys()].map((x) => (
                        <option
                          key={x + 1}
                          value={x + 1}
                          className="text-black"
                        >
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="btn-container ">
              <button
                // onClick={addToCartHandler}
                disabled={Product.countInStock === 0}
                className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0 cursor-pointer"
              >
                Add To Cart
              </button>
            </div>
          </div>
          <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
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
        </>
      )}
    </div>
  );
};

export default ProductDetails;
