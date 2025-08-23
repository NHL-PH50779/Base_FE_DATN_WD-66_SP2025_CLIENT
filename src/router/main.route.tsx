import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ClientLayout from '../components/layouts/ClientLayout';
import AdminLayout from '../components/layouts/AdminLayout';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Profile from '../pages/Profile';
import MyOrders from '../pages/MyOrders';
import OrderDetail from '../pages/OrderDetail';
import VnpayReturn from '../pages/VnpayReturn';
import PaymentSuccess from '../pages/PaymentSuccess';
import PasswordReset from '../pages/PasswordReset';
import VoucherManagement from '../pages/admin/VoucherManagement';
import Wishlist from '../pages/Wishlist';
import FlashSalePage from '../pages/FlashSalePage';
import Wallet from '../pages/Wallet';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ClientLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/shop',
        element: <Shop />
      },
      {
        path: '/product/:id',
        element: <ProductDetail />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/my-orders',
        element: <MyOrders />
      },
      {
        path: '/order/:id',
        element: <OrderDetail />
      },
      {
        path: '/vnpay-return',
        element: <VnpayReturn />
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess />
      },
      {
        path: '/reset-password',
        element: <PasswordReset />
      },
      {
        path: '/wishlist',
        element: <Wishlist />
      },
      {
        path: '/flash-sale',
        element: <FlashSalePage />
      },
      {
        path: '/wallet',
        element: <Wallet />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'vouchers',
        element: <VoucherManagement />
      }
    ]
  }
]);