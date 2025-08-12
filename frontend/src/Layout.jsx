import React, { useState, useEffect } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import { UserContextProvider } from "../context/UserContext/UserContext.jsx";
import { OrderContextProvider } from "../context/OrderContext/OrderContext.jsx";
import "nprogress/nprogress.css"; // make sure to import CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../utiles/Toast/toast.css";
import { HomeContextProvider } from "../context/HomeContext/HomeContext.jsx";
import HeaderWrapper from "../components/HeaderFooterWrapper/HeaderWrapper.jsx";
import FooterWrapper from "../components/HeaderFooterWrapper/FooterWrapper.jsx";
function Layout() {
  const navigation = useNavigation();
  return (
    <HomeContextProvider>
      <UserContextProvider>
        <OrderContextProvider>
          <HeaderWrapper />
          {navigation.state === "loading" ? <Loader /> : <Outlet />}
          <FooterWrapper />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </OrderContextProvider>
      </UserContextProvider>
    </HomeContextProvider>
  );
}
export default Layout;
