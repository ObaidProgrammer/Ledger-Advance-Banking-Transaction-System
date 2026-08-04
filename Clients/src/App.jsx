import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import AppContextProvider from "./context/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import TransferPage from "./pages/TransferPage";
import TransactionsPage from "./pages/TransactionsPage";
import BucketsPage from "./pages/BucketsPage";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// REQUEST INTERCEPTOR
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axios.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


const App = () => {

  return (
    <AppContextProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
<Routes>
  {/* Default Route */}
  <Route path="/" element={<Navigate to="/dashboard" />} />
  
  {/* Auth Routes */}
  <Route path="/login" element={<Login />} />
  
  {/* Create Account Route */}
  <Route path="/create-account" element={<CreateAccount />} />
  
  {/* Main Dashboard */}
  <Route path="/dashboard" element={<Dashboard />} />

{/* BUCKETS ROUTE (Accounts ki jagah) */}
          <Route path="/buckets" element={<BucketsPage />} />

  {/* 2. TRANSFER ROUTE (Yaqeen karlein ye bhi added ho quick transfer kelye) */}
  <Route path="/transfer" element={<TransferPage />} />

  <Route path="/transactions" element={<TransactionsPage />} />

</Routes>

      </Router>
    </AppContextProvider>
  );
};

export default App;