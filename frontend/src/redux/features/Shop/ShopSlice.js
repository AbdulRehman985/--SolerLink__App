import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  categories: [],
  products: [],
  checked: [],
  radio: [],
  brandCheckBoxes: {},
  checkedBrand: [],
};
const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setBrandCheckBoxes: (state, action) => {
      state.brandCheckBoxes = action.payload;
    },
    setCheckedBrand: (state, action) => {
      state.checkedBrand = action.payload;
    },
  },
});
export const {
  setCategories,
  setProduct,
  setChecked,
  setRadio,
  setBrandCheckBoxes,
  setCheckedBrand,
} = shopSlice.actions;

export default shopSlice.reducer;
