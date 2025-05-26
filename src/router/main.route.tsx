<<<<<<< HEAD
import { createBrowserRouter, Link } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="about">About Us</Link>
      </div>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
=======
import { Navigate } from "react-router-dom";
import LaptopList from "../pages/LaptopList";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard"; // THÊM

const routes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> }, // THÊM
      { path: "laptops", element: <LaptopList /> },
    ],
  },
];

export default routes;
>>>>>>> b0aaf8e (gdadmin+mockdata)
