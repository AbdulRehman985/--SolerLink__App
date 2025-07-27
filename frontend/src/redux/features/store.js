import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./auth/authSlice";
import favoritesReducers from "../../redux/features/Favorites/favSlice.js";
import { getFavoritesfromloaclStorage } from "../../Utils/localStorage";
const initialFavrites = getFavoritesfromloaclStorage() || [];
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducers,
  },
  preloadedState: {
    favorites: initialFavrites,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
