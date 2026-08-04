import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const CreateCashier = () => {

  const navigate = useNavigate();

const { createNewCashier } = useContext(AdminContext);

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
await createNewCashier(form);
navigate("/cashiers");

  };

  return (
    <div className="container">
<div className="main-form">
      <div className="main-form-details">
        <h2>Create Cashier</h2>

      <form onSubmit={handleSubmit}>
<label>Name</label>
        <input
          className="form-control mb-3"
          name="name"
          placeholder="Enter cashier name"
          value={form.name}
          onChange={handleChange}
        />
<label>Email</label>
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Enter cashier email"
          value={form.email}
          onChange={handleChange}
        />
<label>Password</label>
        <input
          className="form-control mb-3"
          type="password"
          name="password"
          placeholder="Enter cashier Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn">
          Create Cashier
        </button>

      </form>
      </div>
</div>
    </div>
  );
};

export default CreateCashier;