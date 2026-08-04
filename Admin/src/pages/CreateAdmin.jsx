import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const CreateAdmin = () => {

  const navigate = useNavigate();

  const { createNewAdmin } = useContext(AdminContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await createNewAdmin(form);

    navigate("/admins");

  };

  return (
    <div className="container">
<div className="main-form">
<div className="main-form-details">


      <h2>Create Admin</h2>

      <form onSubmit={handleSubmit}>
 <label>Name</label>
        <input
          className="form-control"
          name="name"
          placeholder="Enter admin name"
          value={form.name}
          onChange={handleChange}
        />
<label>Email</label>
        <input
          className="form-control"
          name="email"
          placeholder="Enter admin email"
          value={form.email}
          onChange={handleChange}
        />
<label>Password</label>
        <input
          className="form-control"
          type="password"
          name="password"
          placeholder="Enter admin password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn">
          Create Admin
        </button>

      </form>

    </div>
    </div>
    </div>
  );
};

export default CreateAdmin;