import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const RoleProtectedRoute = ({ roles }) => {
  const { admin, loading } = useContext(AdminContext);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(admin.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
