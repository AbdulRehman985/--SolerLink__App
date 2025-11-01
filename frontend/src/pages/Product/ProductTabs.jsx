import { useState } from "react";
import { Link } from "react-router-dom";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { useGettopProductQuery } from "../../redux/api/ProductApiSlice";
import Rating from "./Rating";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGettopProductQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const tabs = [
    { id: 1, name: "Write a Review" },
    { id: 2, name: "Customer Reviews" },
    { id: 3, name: "Related Products" },
  ];

  return (
    <div className="w-full  bg-[#111] text-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs Section */}
        <div className="flex md:flex-col gap-3 md:w-1/4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm sm:text-base font-semibold rounded-lg border transition-all duration-300
              ${activeTab === tab.id
                  ? " bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 text-white shadow-lg scale-105"
                  : "bg-[#1a1a1a] text-gray-300 border-gray-700 hover:bg-[#2a2a2a]"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="flex-1 md:w-3/4 bg-[#1a1a1a] rounded-lg p-5 sm:p-6 shadow-inner transition-all duration-300">
          {/* 1️⃣ Write Review */}
          {activeTab === 1 && (
            <>
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-5">
                  <div>
                    <label htmlFor="rating" className="block text-lg mb-2 text-gray-300">
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-700 bg-[#111] text-white focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select...</option>
                      <option value="1">⭐ Inferior</option>
                      <option value="2">⭐⭐ Decent</option>
                      <option value="3">⭐⭐⭐ Great</option>
                      <option value="4">⭐⭐⭐⭐ Excellent</option>
                      <option value="5">⭐⭐⭐⭐⭐ Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-lg mb-2 text-gray-300">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-700 bg-[#111] text-white focus:ring-2 focus:ring-pink-500 resize-none"
                      placeholder="Share your thoughts about the product..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-transform duration-300 hover:scale-105"
                  >
                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p className="text-gray-400">
                  Please{" "}
                  <Link to="/login" className="text-pink-500 underline hover:text-pink-400">
                    sign in
                  </Link>{" "}
                  to write a review.
                </p>
              )}
            </>
          )}

          {/* 2️⃣ All Reviews */}
          {activeTab === 2 && (
            <div>
              {product.reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No reviews yet.</p>
              ) : (
                <div className="space-y-5">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-[#141414] p-5 rounded-xl border border-gray-800 shadow-md hover:border-pink-600 transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-pink-400">{review.name}</strong>
                        <span className="text-sm text-gray-400">
                          {review.createdAt.substring(0, 10)}
                        </span>
                      </div>
                      <p className="text-gray-200 mb-3 leading-relaxed">{review.comment}</p>
                      <Rating value={review.rating} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3️⃣ Related Products */}
          {activeTab === 3 && (
            <div>
              {!data ? (
                <Loader />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
                  {data.map((p) => (
                    <SmallProduct key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
