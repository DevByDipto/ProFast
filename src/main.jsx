import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { router } from "./routes/routes.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./context/authContext/AuthProvider.jsx";

AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <div className="font-urbanist max-w-7xl mx-auto">
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
      </div>
  </StrictMode>
);
