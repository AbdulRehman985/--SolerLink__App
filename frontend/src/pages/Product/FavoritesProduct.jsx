import React from "react";
import { useSelector } from "react-redux";
import { selectFavoritesProduct } from "../../redux/features/Favorites/favSlice";
import Product from "./Product";

const FavoritesProduct = () => {
  const favorites = useSelector(selectFavoritesProduct) || []; // Fallback to []

  if (!favorites.length) {
    return (
      <div className="ml-[10rem] min-h-screen">
        <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
          FAVORITE PRODUCTS
        </h1>
        <p className="ml-[3rem] mt-4 text-gray-500">
          No favorite products yet.
        </p>
      </div>
    );
  }

  return (
    <div className="ml-[10rem] min-h-screen">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
        FAVORITE PRODUCTS
      </h1>
      <div className="flex flex-wrap">
        {favorites
          .filter((product) => product && product._id)
          .map((product) => (
            <Product key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default FavoritesProduct;
