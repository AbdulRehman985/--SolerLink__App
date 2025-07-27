import React from "react";
import { useGettopProductQuery } from "../redux/api/ProductApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Product/SmallProduct";
import ProductCorsul from "../pages/Product/ProductCorsul";

const Header = () => {
  const { data, isLoading, error } = useGettopProductQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="flex justify-around">
      <div className="xl:block lg:hidden md:hidden sm:hidden">
        <div className="grid grid-cols-2 gap-4">
          {data?.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCorsul />
    </div>
  );
};

export default Header;
