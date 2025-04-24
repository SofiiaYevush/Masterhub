import "./config/i18n";
import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import AboutUs from "./pages/aboutUs/AboutUs";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import RegisterTasker from "./pages/registerTasker/RegisterTasker";
import RegisterClient from "./pages/registerClient/RegisterClient";
import PreRegister from "./pages/preRegister/PreRegister";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Profile from "./pages/profile/Profile";
import MyGigs from "./pages/myGigs/MyGigs";
import Categories from "./pages/categories/Categories";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about-us",
          element: <AboutUs />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/pre-register",
          element: <PreRegister />,
        },
        {
          path: "/register-tasker",
          element: <RegisterTasker />,
        },
        {
          path: "/register-client",
          element: <RegisterClient />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/categories",
          element: <Categories />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
