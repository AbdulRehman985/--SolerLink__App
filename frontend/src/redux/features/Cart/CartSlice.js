import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/Cart.js";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItem: [], shippingAddress: {}, paymentMethod: "easypaisa" };

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existingItem = state.cartItem.find((x) => x._id === item._id);
      if (existingItem) {
        state.cartItem = state.cartItem.map((x) =>
          x._id === existingItem._id ? item : x
        );
      } else {
        state.cartItem = [...state.cartItem, item];
      }
      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      state.cartItem = state.cartItem.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMetod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItem = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMetod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = CartSlice.actions;

export default CartSlice.reducer;
