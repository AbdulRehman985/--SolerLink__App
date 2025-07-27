import { createSlice } from "@reduxjs/toolkit";

// Get favorites from localStorage
const getFavoritesFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing favorites from localStorage", error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: getFavoritesFromLocalStorage(),
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
        saveFavoritesToLocalStorage(state);
      }
    },
    removeFromFavorites: (state, action) => {
      const updatedState = state.filter(
        (product) => product._id !== action.payload
      );
      saveFavoritesToLocalStorage(updatedState);
      return updatedState;
    },
    setFavorites: (state, action) => {
      saveFavoritesToLocalStorage(action.payload);
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoritesSlice.actions;
export const selectFavoritesProduct = (state) => state.favorites;
export default favoritesSlice.reducer;
