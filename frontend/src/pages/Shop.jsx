import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "../redux/api/CategorySlice";
import { useFilterdProductQuery } from "../redux/api/ProductApiSlice";
import {
  setCategories,
  setChecked,
  setProduct,
} from "../redux/features/Shop/ShopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Product/ProductCard";
const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const filterdProductQuery = useFilterdProductQuery({ checked, radio });
  // useEffect(() => {
  //   if (!categoriesQuery.isLoading) {
  //     dispatch(categoriesQuery.data);
  //   }
  // }, [categoriesQuery.data, dispatch]);
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filterdProductQuery.data || filterdProductQuery.isLoading) return;
    if (!checked.length || !radio.length) {
      if (!filterdProductQuery.isLoading) {
        const filterdProducts = filterdProductQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProduct(filterdProducts));
      }
    }
  }, [checked, radio, filterdProductQuery.data, dispatch, priceFilter]);
  const handleBrandClick = (brand) => {
    const productByBrand = filterdProductQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProduct(productByBrand));
  };
  const handleChecked = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filterdProductQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];
  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };
  return (
    <>
      <div className="container mx-auto">
        <div className="flex md:flex-row ml-[4.8rem]">
          {/* Sidebar */}
          <div className="bg-[#1a1a1a]/95 backdrop-blur p-6 mt-4 mb-4 rounded-2xl shadow-xl border border-gray-700 w-[18rem]">
            {/* CATEGORY FILTER */}
            <h2
              className="text-center py-2 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full 
        text-white text-base font-bold tracking-wide shadow-md mb-5"
            >
              Filter By Category
            </h2>
            <div className="space-y-4">
              {categories?.map((c) => (
                <label
                  key={c._id}
                  className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-800/40 p-2 rounded-lg transition"
                >
                  <input
                    type="checkbox"
                    onChange={(e) => handleChecked(e.target.checked, c._id)}
                    className="peer hidden"
                  />
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-gray-500
                group-hover:border-pink-400 peer-checked:border-pink-500 peer-checked:bg-pink-500
                shadow transition-all duration-200 ease-in-out"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white hidden peer-checked:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-pink-400">
                    {c.name}
                  </span>
                </label>
              ))}
            </div>

            {/* BRAND FILTER */}
            <h2
              className="text-center py-2 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full 
        text-white text-base font-bold tracking-wide shadow-md mt-8 mb-5"
            >
              Filter By Brand
            </h2>
            <div className="space-y-4">
              {uniqueBrands?.map((brand) => (
                <label
                  key={brand}
                  htmlFor={brand}
                  className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-800/40 p-2 rounded-lg transition"
                >
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    className="peer hidden"
                    onChange={() => handleBrandClick(brand)}
                  />
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-500
                group-hover:border-pink-400 peer-checked:border-pink-500 peer-checked:bg-pink-500
                transition-all duration-200 ease-in-out"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white hidden peer-checked:block" />
                  </span>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-pink-400">
                    {brand}
                  </span>
                </label>
              ))}
            </div>

            {/* PRICE FILTER */}
            <h2
              className="text-center py-2 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full 
        text-white text-base font-bold tracking-wide shadow-md mt-8 mb-5"
            >
              Filter By Price
            </h2>
            <div>
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter || ""}
                onChange={handlePriceChange}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-900/80 backdrop-blur border border-gray-600 
            text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 
            focus:border-pink-500 transition-all duration-300"
              />
            </div>
            <div className="pt-5">
              <button
                className="w-full py-2.5 rounded-lg font-semibold cursor-pointer text-white 
            bg-gradient-to-r from-pink-600 to-pink-400 hover:scale-[1.02] hover:shadow-lg 
            transition-transform duration-300"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Product Section */}
          <div className="py-5 px-6 flex-1">
            <div className="text-white text-lg font-semibold mb-6">
              Products ({products?.length})
            </div>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-3 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2h6v2m2 4H7a2 2 0 01-2-2V7h14v12a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium">No Products Found</p>
                <span className="text-sm">Try adjusting your filters</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products?.map((p) => (
                  <div
                    key={p._id}
                    className="transform hover:scale-[1.02] transition duration-300"
                  >
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
