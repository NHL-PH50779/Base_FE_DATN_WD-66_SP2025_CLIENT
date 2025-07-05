import React, { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { useCartSync } from "./hooks/useCartSync";
import { CircularProgress, Box } from "@mui/material";
import ClientLayout from "./components/layouts/ClientLayout";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Lazy load các trang
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

// Import trực tiếp các trang nhỏ
import ClientLogin from "./pages/ClientLogin";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import Payment from "./pages/Payment";
import BankingInfo from "./pages/BankingInfo";
import ProductReview from "./pages/ProductReview";
import Invoice from "./pages/Invoice";
import ReviewDetail from "./pages/ReviewDetail";
import VNPayReturn from "./pages/VNPayReturn";
const Wallet = lazy(() => import("./pages/Wallet"));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress size={60} />
  </Box>
);
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
        element: <OrderDetail />,
      },
      {
        path: "review/:orderId",
        element: <ProductReview />,
      },
      {
        path: "invoice/:id",
        element: <Invoice />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "product/:productId/reviews",
        element: <ReviewDetail />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "vnpay-return",
        element: <VNPayReturn />,
      },
      {
        path: "wallet",
        element: <Wallet />,
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
  useCartSync();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main>{routes}</main>
    </Suspense>
  );
}

export default App;
