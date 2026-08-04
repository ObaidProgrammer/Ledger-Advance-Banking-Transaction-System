import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const { login, register, token } = useContext(AppContext);
  const navigate = useNavigate();

  // State control karegi ke 'Login' show karna hai ya 'Sign Up'
  const [currentState, setCurrentState] = useState("Login");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Agar user already logged in ho jaye to direct dashboard bhejo
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();
  let result;
  if (currentState === "Sign Up") {
    result = await register(name, email, password);
  } else {
    result = await login(email, password);
  }

  if (result && result.success) {
  success(`${currentState} Successful!`);
    
    if (result.hasAccount) {
      navigate("/dashboard");
    } else {
      toast.info("Please create a ledger account first!");
      navigate("/create-account");
    }
    
  } else {
    toast.error(result?.message || "Something went wrong");
  }
};

  return (
    <div className="Login d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card" >
<div className="logo">
          <img src={assets.logo} className='w-36' alt='Ledger Logo' />
       {/* Dynamic Title (Login ya Sign Up) */}
</div>        
        <h3 className="text-center mb-4">{currentState}</h3>

        <form onSubmit={handleSubmit}>
          
          {/* NAME FIELD: Sirf Sign Up state par render hoga */}
          {currentState === "Sign Up" && (
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {/* DYNAMIC ACTION BUTTON */}
          <button className="btn w-100 my-3" type="submit">
            {currentState === "Login" ? "Sign In" : "Sign Up"}
          </button>

          
          {/* State Toggle Context Link */}
          <div className="d-flex justify-content-center align-item-center text-sm mb-3 px-1">
            {currentState === "Login" ? (
              <small 
                onClick={() => setCurrentState("Sign Up")} 
                className="Create-account">
                Create account
              </small>
            ) : (
              <small 
                onClick={() => setCurrentState("Login")} 
                className="login-here">
                Login Here
              </small>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;