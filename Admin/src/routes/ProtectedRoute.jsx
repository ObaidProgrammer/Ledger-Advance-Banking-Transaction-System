import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AdminContext } from "../context/AdminContext";

const ProtectedRoute = () => {

  const { token, loading } = useContext(AdminContext);

  if (loading) {
    return 
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;