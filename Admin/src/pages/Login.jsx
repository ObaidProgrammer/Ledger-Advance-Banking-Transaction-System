  import { useContext, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import assets from "../assets/assets";
  import { AdminContext } from "../context/AdminContext";

  const Login = () => {

    const navigate = useNavigate();

    const { login, loading } = useContext(AdminContext);

    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });


    const handleChange = (e) => {

      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });

    };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await login(
    formData.email,
    formData.password
  );

  if (result.success) {
    navigate("/dashboard");
  }
};

    return (

    <div className="Login d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card" >
<div className="logo">
                   <img src={assets.logo} className='w-36' alt='Ledger Logo' />
        </div>
                <h3 className="text-center mb-4">Administration Login</h3>

              <form onSubmit={handleSubmit}>

               
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
              required
                  />

               

                <div className="mb-3">

                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
placeholder="Enter password"
              required
                  />

                </div>

                <button
                  className="btn w-100 my-3"
                  disabled={loading}
                >

                  {
                    loading
                      ? "Logging in..."
                      : "Login"
                  }

                </button>

              </form>

            </div>

          </div>

    );

  };

  export default Login;