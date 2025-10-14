import React from "react";
import Header from "../components/Header";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/ProductApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Product/Product";
import AdminMenu from "./Admin/AdminMenu";
import PrimarySearchAppBar from "../components/Navbar";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {/* Show Header only when no search keyword */}
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Something went wrong"}
        </Message>
      ) : (
        <>
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto mt-12 px-6 gap-4">
            <div className="w-full md:w-auto">
              <AdminMenu />
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              ✨ Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold 
                         rounded-full py-2 px-8 shadow-md shadow-pink-500/30 
                         transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-pink-400"
            >
              Shop Now →
            </Link>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto mt-10 px-6">
            {data?.product?.length === 0 ? (
              <p className="text-center text-gray-400 text-lg">
                No products found.
              </p>
            ) : (
              <div className="ml-[4rem] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {data?.product?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
