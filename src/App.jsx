import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./Pages/Login/Login";
import Skills from "./Pages/Skills/Skills";
import Users from "./Pages/User/Users";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserDetils from "./Pages/User/UserDetils";
import OrderList from "./Pages/Order/OrderList";
import PostList from "./Pages/post/PostList";
import OrderDetails from "./Pages/Order/OrderDetails";
import NewCategory from "./Pages/Skills/NewCategory";
import BrandList from "./Pages/brands/BrandList";
import CreateBrand from "./Pages/brands/CreateBrand";
import EditCat from "./Pages/Skills/EditCat";
import EditPost from "./Pages/post/EditPost";
import BookingList from "./Pages/Booking/Booking";
import BookingDetails from "./Pages/Booking/BookingDetails";
import AddPost from "./Pages/post/AddPost";



const router = createBrowserRouter([
  {
    path: "/",
  
    element: <Dashboard />,
  },

  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "/category",
    element: <Skills />,
  },
  {
    path: "/add-category",
    element: <NewCategory />,
  },
  {
    path: "/add-post",
    element: <AddPost />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/orders",
    element: <OrderList />,
  },
  {
    path: "/bookings",
    element: <BookingList />,
  },
  {
    path: "/booking-details",
    element: <BookingDetails />,
  },
  {
    path: "/brands",
    element: <BrandList />,
  },
  {
    path: "/add-brand",
    element: <CreateBrand />,
  },
  {
    path: "/post",
    element: <PostList />,
  },
{ path: "/edit-category/:id",
   element: <EditCat />

},
{ path: "/edit-post/:id",
   element: <EditPost />

},
  {
    path: "/user/:id",
    element: <UserDetils />,
  },
  {
    path: "/order/:id",
    element: <OrderDetails />,
  },

]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
