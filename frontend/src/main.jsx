import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "../components/Home/Home.jsx";
import Register from "../components/Register/Register.jsx";
import Login from "../components/Login/Login.jsx";
import Cart from "../components/Cart/Cart.jsx";
import ProductPage from "../components/ProductPage/ProductPage.jsx";
import Profile from "../components/Profile/Profile.jsx";
import OrderAddressPage from "../components/OrderAddress/OrderAddressPage.jsx";
import AddressSubmit from "../components/addressSubmit/AddressSubmit.jsx";
import OrderSummeryPage from "../components/OrderSummery/OrderSummeryPage.jsx";
import PaymentPage from "../components/PaymentPage/PaymentPage.jsx";
import Orders from "../components/Orders/Orders.jsx";
import OrderSuccessPage from "../components/OrderSuccessPage/OrderSuccessPage.jsx";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Wishlist from "../components/Wishlist/Wishlist.jsx";
import ForgetPassword from "../components/ForgetPassword/ForgetPassword.jsx";
import VerifyOtp from "../components/VerifyOtp/VerifyOtp.jsx";
import ResetPassword from "../components/ResetPassword/ResetPassword.jsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route
        path="product/:productId"
        element={<ProductPage />}
      />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="myCart" element={<Cart />} />
      <Route path="myAccount" element={<Profile />} />
      <Route path="addressPage" element={<OrderAddressPage />} />
      <Route path="addressSubmit" element={<AddressSubmit />} />
      <Route path="OrderSummery" element={<OrderSummeryPage />} />
      <Route path="PaymentPage" element={<PaymentPage />} />
      <Route path="orders" element={<Orders />} />
      <Route path="OrderSuccess" element={<OrderSuccessPage />} />
      <Route path="Edit-Profile" element={<EditProfileForm />} />
      <Route path="Wishlist" element={<Wishlist />} />
      <Route path="forget-password" element={<ForgetPassword />} />
      <Route path="Verify-OTP" element={<VerifyOtp />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Route>
  ),
  {
    hydrationData: null,
  }
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
