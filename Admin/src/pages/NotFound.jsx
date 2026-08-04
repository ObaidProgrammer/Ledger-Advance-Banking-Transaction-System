import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const NotFound = () => {
  const navigate = useNavigate();
const { token } = useContext(AdminContext);

const handleBack = () => {
  navigate(token ? "/dashboard" : "/login");
};
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
    >
      <h1 className="display-1">404</h1>

      <h3>Page Not Found</h3>

      <p className="text-muted">
        The page you are looking for does not exist.
      </p>

<button
  className="btn btn-primary"
  onClick={handleBack}
>
  {token ? "Go to Dashboard" : "Go to Login"}
</button>
    </div>
  );
};

export default NotFound;