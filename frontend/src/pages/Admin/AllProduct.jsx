import React from "react";
import { useAllProductsQuery } from "../../redux/api/ProductApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import moment from "moment";
import AdminMenu from "./AdminMenu";

const AllProduct = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-6">
        Error loading products
      </div>
    );

  return (
    <div className="container  mx-auto px-4 py-6">
      <div className="flex flex-col ml-[10rem]  md:flex-row gap-9">
        {/* Admin Menu */}

        <AdminMenu />

        {/* Product List */}
        <div className="md:w-3/4 w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
            All Products ({products?.length || 0})
          </h2>

          {products?.length === 0 ? (
            <div className="text-center text-gray-400">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-7">
              {products.map((product) => (
                <div
                  key={product?._id}
                  className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link
                    to={`/admin/product/update/${product?._id}`}
                    className="flex p-4 gap-4"
                  >
                    <img
                      src={product?.image}
                      alt={product?.name}
                      onError={(e) => (e.target.src = "/default-product.png")}
                      className="w-[8rem] h-[8rem] object-cover rounded-md"
                    />

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {product?.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {moment(product?.createdAt).format("MMMM Do YYYY")}
                        </p>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                          {product?.description?.substring(0, 100)}...
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-pink-500 font-bold text-lg">
                          ${product?.price}
                        </span>

                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-pink-700 rounded hover:bg-pink-800"
                        >
                          Update
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            fill="none"
                            viewBox="0 0 14 10"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
