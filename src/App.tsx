import React from "react";
import { useRoutes } from "react-router-dom";
import ClientLayout from "./components/layouts/ClientLayout";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Cart from "./pages/Cart"; // Đảm bảo đường dẫn đúng
import ClientLogin from "./pages/ClientLogin";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Contact from "./pages/Contact";
import Invoice from "./pages/Invoice";
const routeConfig = [
  {
    path: "/login",
    element: <ClientLogin />,
  },
  {
    path: "/register", 
    element: <Register />,
  },
  {
    path: "/",
    element: <ClientLogin />,
  },
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "forgot-password",
        element: <PasswordReset />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },
      {
        path: "orders/:id",
        element: <MyOrders />,
      },
      {
        path: "invoice/:id",
        element: <Invoice />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/admin",
    // element: <AdminLayout />,
    children: [
      {
        path: "",
        // element: <List />,
      },
      {
        path: "product/list",
        // element: <List />,
      },
      {
        path: "product/add",
        // element: <Add />,
      },
      {
        path: "product/edit/:id",
        // element: <Edit />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <>
        <Header />
        {/* <NotFound /> */}
        <Footer />
      </>
    ),
  },
];
function App() {
  const routes = useRoutes(routeConfig);
  return <main>{routes}</main>;
}

export default App;
