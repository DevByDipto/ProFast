import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../page/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../page/authentication/login/login";
import Register from "../page/authentication/Register/Register";
import Coverage from "../page/coverage/coverage";
import PrivateRoute from "../router/PrivateRoute";
import SendParcel from "../page/sendParcel/SendParcel";
import DashboardLayout from "../layout/DashboardLayout";
import Myparcels from "../page/dashboard/myParcels/Myparcels";
import Payment from "../page/dashboard/payment/payment";
import PaymentHistory from "./paymentHistory/PaymentHistory";
import Profile from "../page/dashboard/profile/Profile";
import BeARider from "../page/dashboard/beARider/BeARider";
import PendingRiders from "../page/dashboard/pendingRiders/PendingRiders";
import ActiveRiders from "../page/dashboard/activeRiders/ActiveRiders";
import Admin from "../page/dashboard/Admin/Admin";
import Forbiden from "../page/forbiden/Forbiden";
import AdmineRoute from "../router/AdmineRoute";
import AssignRider from "../page/dashboard/AssignRider/AssignRider";
import RiderRoute from "../router/RiderRoute";
import PendingDeliveries from "../page/dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../page/dashboard/completedDeliveris/CompletedDeliveris";
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
        path: "/forbiden",
        Component: Forbiden,
      },
      {
        path: "/coverage",
        loader: () => fetch("./serviceCenter.json"),
        element: <Coverage></Coverage>,
      },
      {
        path: "/beARider",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
      },
      {
        path: "sendParcel",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
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
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "my-parcels",
        element: <Myparcels></Myparcels>,
      },
      {
        path: "payment/:parcelId",
        element: <Payment></Payment>,
      },
      {
        path: "paymetHistory",
        element: <PaymentHistory></PaymentHistory>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "pending-riders",
        element: <PendingRiders></PendingRiders>,
      },
      {
        path: "active-riders",
        element: <ActiveRiders></ActiveRiders>,
      },
      // rider route
      {
        path: "pending-deliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries></CompletedDeliveries>
          </RiderRoute>
        ),
      },
      // admin route
      {
        path: "assignRider",
        element: (
          <AdmineRoute>
            <AssignRider></AssignRider>
          </AdmineRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdmineRoute>
            <Admin></Admin>
          </AdmineRoute>
        ),
      },
    ],
  },
]);
