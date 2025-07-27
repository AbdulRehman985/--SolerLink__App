import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavoritesProduct,
} from "../../redux/features/Favorites/favSlice";
import { toast } from "react-toastify";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoritesProduct) || [];

  if (!product || !product._id) return null;

  const isFavorite = favorites.some((p) => p?._id === product._id);

  const toggleFavorites = () => {
    if (!product) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      toast.info(`${product.name} removed from favorites`);
    } else {
      dispatch(addToFavorites(product));
      toast.success(`${product.name} added to favorites`);
    }
  };

  return (
    <div
      className="absolute top-5 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500 text-xl" />
      ) : (
        <FaRegHeart className="text-white text-xl" />
      )}
    </div>
  );
};

export default HeartIcon;
