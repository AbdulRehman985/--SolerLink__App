export const addToFavoritesToLocalStorage = (product) => {
  const favorites = getFavoritesfromloaclStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};
export const removeFavoritesFromLocalStorage = (productId) => {
  const favorites = getFavoritesfromloaclStorage();
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );
  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};
export const getFavoritesfromloaclStorage = () => {
  const favoritesJson = localStorage.getItem("favorites");
  return favoritesJson ? JSON.parse(favoritesJson) : [];
};
