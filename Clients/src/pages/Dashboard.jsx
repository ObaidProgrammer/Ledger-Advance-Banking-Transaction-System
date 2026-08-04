import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

import UserInfo from "../components/UserInfo";
import LatestTransactions from "../components/LatestTransactions";
import Balance from "../components/Balance"; 
import SideBar from "../components/SideBar";
import LedgerChart from "../components/LedgerChart";
import Accounts from "../components/Accounts";

const Dashboard = () => {
  const { token, accounts, fetchAccounts } = useContext(AppContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true); 

  useEffect(() => {
    const verifyUserStatus = async () => {
      const savedToken = localStorage.getItem("token");
      
      // Check 1: Agar token nahi hai, to login par bhejo
      if (!token && !savedToken) {
        navigate("/login");
        return;
      }

      // Agar context mein accounts empty hain, toh ek baar confirm fetch karlein
      if (accounts && accounts.length === 0 && fetchAccounts) {
        try {
          const freshAccounts = await fetchAccounts();
          if (freshAccounts && freshAccounts.length === 0) {
            navigate("/create-account");
            return;
          }
        } catch (err) {
          console.error("Error verifying accounts", err);
        }
      } else if (accounts && accounts.length === 0) {
        // Fallback agar fetchAccounts function na mile
        navigate("/create-account");
        return;
      }

      setChecking(false); // Verification complete ho gayi
    };

    verifyUserStatus();
  }, [token, accounts, navigate, fetchAccounts]);

  // Jab tak check chal raha hai ya user unauthorized hai, screen leak na ho
  if (checking || (!token && !localStorage.getItem("token")) || (accounts && accounts.length === 0)) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ); 
  }

  return (
    <div className="container-fluid g-0">
      <div className="row ">
        <div className="col-xl-2 col-lg-3 col-md-3 col-sm-12 sidebar-wrapper">
          <SideBar/>
        </div>
        <div className="col-xl-10 col-lg-9 col-md-9 col-sm-12 content-wrapper">
          <div className="row userInfo-accounts">
            <div className="col-xl-6 col-lg-6  col-md-12">
              <UserInfo/> 
            </div>
            <div className="col-xl-6 col-lg-6  col-md-12">
              <Accounts/>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <Balance/>
            </div>
            <div className="col-xl-12 chart">
              <LedgerChart/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;