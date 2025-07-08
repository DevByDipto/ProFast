import { Navigate, useLocation } from "react-router";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>; // ⏳ যদি auth লোড হয়
  }

  if (!user) {
    return <Navigate to="/login" state={location.pathName} replace />;
  }

  return children; 
};

export default PrivateRoute;
