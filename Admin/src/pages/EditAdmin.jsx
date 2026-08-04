import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";


const EditAdmin = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const {
    adminDetails,
    adminsLoading,
    loadAdminDetails,
    updateAdminData,
  } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadAdminDetails(adminId);
  }, [adminId]);

  useEffect(() => {
    if (adminDetails) {
      setFormData({
        name: adminDetails.name || "",
        email: adminDetails.email || "",
      });
    }
  }, [adminDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateAdminData(adminId, formData);
      navigate("/admins");
    } catch (error) {}
  };

  if (adminsLoading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="container">

      <div className="main-form">

        <div className="main-form-details">
          <h2>Edit Admin</h2>
     
          <form onSubmit={handleSubmit}>

            
              <label >
                Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            

            
              <label>
                Email
              </label>

              <input
                type="email"
                className="form-control"
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

export default EditAdmin;