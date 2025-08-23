import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import ChatBot from "../ChatBot";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatBot />
    </>
  );
};

export default ClientLayout;
