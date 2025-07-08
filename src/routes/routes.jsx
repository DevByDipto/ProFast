import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../page/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../page/authentication/login/login";
import Register from "../page/authentication/Register/Register";
import Coverage from "../page/coverage/coverage";
import PrivateRoute from '../router/PrivateRoute'
import SendParcel from "../page/sendParcel/SendParcel";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path:'/coverage',
        loader:()=>fetch('../../public/serviceCenter.json'),
        element: <Coverage></Coverage>
      },
      {
        path:'sendParcel',
                loader:()=>fetch('../../public/serviceCenter.json'),
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
      }
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", element: <Login></Login> },
      {
        path: "register",
        element: <Register></Register>,
      },
    ],
  },
]);
