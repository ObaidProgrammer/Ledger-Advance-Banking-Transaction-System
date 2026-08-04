import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function CreateAccount() {
  // Context se accounts state aur fetchAccounts handler nikala
  const { backendUrl, token, accounts, fetchAccounts } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Component load par unique idempotency key lock kar lein state me
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  // GUARD: Agar user ke paas pehle se account hai, to is page par rukne hi mat do
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      navigate("/dashboard");
    }
  }, [accounts, navigate]);

  const handleCreate = async () => {
    if (loading) return; // Double-click safety
    setLoading(true);
    
    try {
      const res = await axios.post(`${backendUrl}/accounts`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": idempotencyKey // Backend strict check ke liye header bhej diya
        }
      });

      // Status 201 ya 200 (existing check bypass) dono par processing allow karein
      if (res.status === 201 || res.status === 200) {
        toast.success("Banking Ledger Account Created Successfully!");
        
        // 1. Context ke accounts array ko refresh karein (Length 0 se 1 hojayegi)
        if (fetchAccounts) {
          await fetchAccounts(); 
        }
        
        // 2. Direct navigate karein (Bina window.location.reload() kiye)
        navigate("/dashboard");
      }
    } catch (err) {

  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    navigate("/login");
    return;
  }

  toast.error(err?.response?.data?.message);
} finally {
      setLoading(false);
    }
  };

  // Screen flash control guard
  if (accounts && accounts.length > 0) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-5 text-center" style={{ width: "450px", borderRadius: "12px" }}>
        <h3 className="mb-3 fw-bold">Setup Your Account</h3>
        <p className="text-muted mb-4">
          Welcome! To start managing your advance banking transactions system, you need to initialize a primary wallet ledger account.
        </p>
        
        <button 
          onClick={handleCreate} 
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Primary Account"}
        </button>
      </div>
    </div>
  );
}

export default CreateAccount;