import { ToastContainer } from "react-toastify";
import AdminRoutes from "./routes/AdminRoutes";
import Loader from "./components/common/Loader";
import { useAppContext } from "./context/AdminContext";

function App() {
  const { loading } = useAppContext();

  return (
    <>
      {loading && <Loader />}

      <AdminRoutes />

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
}

export default App;