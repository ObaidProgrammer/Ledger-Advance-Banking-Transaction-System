import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";

const EditCashier = () => {
  const navigate = useNavigate();
  
  const { cashierId } = useParams();

const {
    cashiersLoading,
  loadCashierDetails,
  cashierDetails,
  updateCashierData,
} = useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadCashierDetails(cashierId);
  }, [cashierId]);

  useEffect(() => {
    if (cashierDetails) {
      setFormData({
        name: cashierDetails.name || "",
        email: cashierDetails.email || "",
      });
    }
  }, [cashierDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
await updateCashierData(cashierId, formData);
navigate("/cashiers");
    } catch (error) {}
  };

  if (cashiersLoading) {
    return (
    <Loader/>
    );
  }

  return (
    <div className="container-fluid">

      <div className="main-form">

        <div className="main-form-details">
          <h2>Edit Cashier</h2>  
          <form onSubmit={handleSubmit}>
              <label >
                Name
              </label>

              <input
                type="text"
                className="form-control "
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label >
                Email
              </label>

              <input
                type="email"
                className="form-control "
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            <div className="d-flex gap-1">

              <button
                type="submit"
                className="btn"
              >
                Update
              </button>

              <button
                type="button"
                className="btn cancel-btn"
                onClick={() => navigate("/admins")}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditCashier;