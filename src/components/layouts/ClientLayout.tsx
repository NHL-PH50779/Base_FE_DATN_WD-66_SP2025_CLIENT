// src/layouts/ClientLayout.tsx (đường dẫn của bạn có thể khác)
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Banner from "../common/Banner";
import Breadcrumbs from "../common/Breadcrumbs"; // Import component Breadcrumbs mới tạo

const ClientLayout = () => {
  const location = useLocation();

  // Chỉ hiển thị Banner khi đường dẫn là '/' (trang chủ)
  const showBanner = location.pathname === "/";

  // Hiển thị Breadcrumbs nếu không phải trang chủ
  const showBreadcrumbs = location.pathname !== "/"; // Điều kiện này sẽ hiển thị ở tất cả các trang trừ Home

  return (
    <>
      <Header />

      {/* Chỉ hiển thị Banner nếu showBanner là true (tức là chỉ ở trang chủ) */}
      {showBanner && <Banner />}

      {/* Thêm Breadcrumbs ở đây, chỉ hiển thị nếu không phải trang chủ */}
      {showBreadcrumbs && <Breadcrumbs />}

      <Outlet />

      <Footer />
    </>
  );
};

export default ClientLayout;