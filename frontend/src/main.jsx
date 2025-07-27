import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider, Route, createRoutesFromElements } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/features/store.js";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import { PrivateRoute } from "./components/Privateroute.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import Userlist from "./pages/Admin/Userlist.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import Productlist from "./pages/Admin/Productlist.jsx";
import Updateproduct from "./pages/Admin/Updateproduct.jsx";
import AllProduct from "./pages/Admin/AllProduct.jsx";
import Home from "./Home.jsx";
import FavoritesProduct from "./pages/Product/FavoritesProduct.jsx";
import ProductDetails from "./pages/Product/ProductDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favourite" element={<FavoritesProduct />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<Userlist />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<Productlist />} />
        <Route path="allproduct" element={<AllProduct />} />
        <Route path="product/update/:_id" element={<Updateproduct />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    <RouterProvider router={router} />
  </Provider>
);
