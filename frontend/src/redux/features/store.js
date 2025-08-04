import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "../api/apiSlice";
import authReducer from "./auth/authSlice";
import favoritesReducers from "../../redux/features/Favorites/favSlice.js";
import cartSliceReducer from "../features/Cart/CartSlice.js";
import { getFavoritesfromloaclStorage } from "../../Utils/localStorage";
import shopReducer from "./Shop/ShopSlice.js";
const initialFavrites = getFavoritesfromloaclStorage() || [];
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducers,
    cart: cartSliceReducer,
    shop: shopReducer,
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
