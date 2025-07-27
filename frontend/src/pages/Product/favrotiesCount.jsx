import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites) || [];
  const count = favorites.length;

  if (!count) return null;

  return (
    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-pink-500 rounded-full">
      {count}
    </span>
  );
};

export default FavoritesCount;
