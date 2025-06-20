import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Banner from "../common/Banner";

const ClientLayout = () => {
  const location = useLocation();

  const hideBanner =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/cart" ||
    location.pathname.startsWith("/invoice/") ||
    location.pathname.startsWith("/product/");

  return (
    <>
      <Header />
      {!hideBanner && <Banner />}

      <Outlet />

      <Footer />
    </>
  );
};

export default ClientLayout;
