import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/Cart/CartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: Product, isLoading, error, refetch } =
    useGetProductDetailsQuery(id);
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
      toast.error(error?.data?.error || error?.message || error);
    }
  };

  const addToCartHandler = async () => {
    try {
      dispatch(addToCart({ ...Product, qty }));
      navigate("/");
      toast.success(`${Product.name} added to cart`);
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen ml-15 bg-[#111827] text-gray-200 py-6 px-4 sm:px-6 lg:px-10">
      {/* Back Button */}
      <Link
        to="/"
        className="text-[#FEC84B] hover:text-[#FFD700] transition underline font-semibold"
      >
        ← Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.message || error}</Message>
      ) : (
        <>
          {/* PRODUCT MAIN CARD */}
          <div className="max-w-6xl mx-auto bg-[#1f1f1f] rounded-2xl shadow-xl p-4 sm:p-6 lg:p-10 mt-6 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* IMAGE */}
            <div className="relative w-full lg:w-[28rem] flex-shrink-0">
              <img
                src={Product.image}
                alt={Product.name}
                className="rounded-2xl shadow-lg w-full object-cover max-h-[25rem] sm:max-h-[30rem]"
              />
              <HeartIcon product={Product} />
            </div>

            {/* DETAILS */}
            <div className="flex flex-col flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 break-words leading-tight text-[#FEC84B]">
                {Product.name}
              </h1>

              <ReadMoreText text={Product.description} />

              <p className="text-2xl sm:text-3xl font-bold text-[#FFD700] mt-4 sm:mt-5">
                ${Product.price}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 mt-5 text-sm sm:text-base">
                <p className="flex items-center">
                  <FaStore className="mr-2 text-[#FEC84B]" /> <strong>Brand:</strong>{" "}
                  {Product.brand}
                </p>
                <p className="flex items-center">
                  <FaClock className="mr-2 text-[#FEC84B]" /> Added{" "}
                  {moment(Product.createdAt).fromNow()}
                </p>
                <p className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" /> Rating:{" "}
                  {Product.rating}
                </p>
                <p className="flex items-center">
                  <FaShoppingCart className="mr-2 text-[#9FE870]" /> Quantity:{" "}
                  {Product.quantity}
                </p>
                <p className="flex items-center">
                  <FaBox className="mr-2 text-[#9FE870]" /> In Stock:{" "}
                  {Product.countInStock}
                </p>
                <Rating
                  value={Product.rating}
                  text={` Reviews:${Product.numReviews}`}
                />
              </div>

              {Product.countInStock > 0 && (
                <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="p-2 rounded-lg bg-[#2d2d2d] border border-gray-600 text-white w-full sm:w-24"
                  >
                    {[...Array(Product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={addToCartHandler}
                    disabled={Product.countInStock === 0}
                    className=" bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 text-black transition py-2 px-6 rounded-lg font-semibold shadow-md w-full sm:w-auto"
                  >
                    Add To Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div
            className="max-w-6xl mx-auto mt-10 bg-[#1c1c1c] p-4 sm:p-6 rounded-xl 
            transition-transform duration-300 hover:scale-105 shadow-[#FEC84B]/20 shadow-md"
          >
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
