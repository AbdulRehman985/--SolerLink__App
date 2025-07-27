import React from "react";
import Header from "./components/Header";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/ProductApiSlice";
import Loader from "./components/Loader";
import Message from "./components/Message";
import Product from "./pages/Product/Product";
import AdminMenu from "./pages/Admin/AdminMenu";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Something went wrong"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center max-w-screen-lg mx-auto mt-10">
            <AdminMenu />
            <h1 className="text-3xl font-bold">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-10"
            >
              Shop
            </Link>
          </div>
          <div className="flex justify-center flex-wrap mt-8">
            {data?.product?.map((product) => (
              <div key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
