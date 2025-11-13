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
import Home from "./pages/Home.jsx";
import FavoritesProduct from "./pages/Product/FavoritesProduct.jsx";
import ProductDetails from "./pages/Product/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrders from "./pages/Orders/PlaceOrders.jsx";
import Order from "./pages/Orders/Order.jsx";
import UserOrder from "./pages/User/UserOrder.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/favourite" element={<FavoritesProduct />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/user-orders" element={<UserOrder />} />
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="placeorder" element={<PlaceOrders />} />
        <Route path="order/:id" element={<Order />} />
      </Route>
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<Userlist />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<Productlist />} />
        <Route path="allproduct" element={<AllProduct />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="product/update/:slug" element={<Updateproduct />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<h1>Page not found</h1>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    <RouterProvider router={router} />
  </Provider>
);
