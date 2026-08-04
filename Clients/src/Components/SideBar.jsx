import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify';

// --- MUI ICONS IMPORTS ---
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";



const SideBar = () => {
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();
const handleLogoutClick = async () => {
  try {
    await logout();
    toast.success("Logged out successfully!");
    navigate('/login'); 
  } catch (error) {
    toast.error("Logout failed. Please try again.");
  }
};

  const activeLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'var(--bg-forth-color)' : 'var(--bg-secondary-color)',
    color: isActive ? 'var(--text-active-color)' : 'var(--text-secondary-color)'
  });

  return (
    <div className="SideBar">
      <div>
        {/* --- LOGO SECTION --- */}
        <div className="logo">
            <Link to='/dashboard'>
              <img src={assets.logo} alt='Ledger Logo' />
              <h2>Ledger</h2>
            </Link>
            
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div className="nav">
          
          <NavLink 
            to="/dashboard" 
            className="nav-link"
            style={activeLinkStyle}
          >
            <span><HomeIcon/></span> Home
          </NavLink>


          <NavLink 
            to="/transfer" 
            className="nav-link"
            style={activeLinkStyle}
          >
            <span><SendIcon/></span> Transfer
          </NavLink>

          <NavLink 
            to="/transactions" 
            className="nav-link"
            style={activeLinkStyle}
          >
            <span><HistoryIcon/></span> Transactions
          </NavLink>

          <NavLink 
            to="/buckets" 
            className="nav-link"
            style={activeLinkStyle}
          >
            <span><AccountBalanceIcon/></span> Buckets
          </NavLink>



        </div>
      </div>

      {/* --- LOGOUT BUTTON --- */}
      <button 
        onClick={handleLogoutClick} 
        className="btn">
        <span><LogoutIcon/></span> Logout
      </button>

    </div>
  );
};

export default SideBar;