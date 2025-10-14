import React from "react";
import { useGettopProductQuery } from "../redux/api/ProductApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Product/SmallProduct";
import ProductCorsul from "../pages/Product/ProductCorsul";

const Header = () => {
  const { data, isLoading, error } = useGettopProductQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="flex flex-col xl:flex-row justify-center xl:justify-start gap-8 xl:ml-20">
      {/* Grid only on XL screens */}
      <div className="hidden xl:block">
        <div className="grid grid-cols-2 gap-4">
          {data?.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel always visible */}
      <div className="flex justify-center w-full xl:w-auto">
        <ProductCorsul />
      </div>
    </div>
  );
};

export default Header;
