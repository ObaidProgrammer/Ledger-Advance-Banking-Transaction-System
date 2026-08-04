import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const PublicRoute = () => {
  const { token, loading } = useContext(AdminContext);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;