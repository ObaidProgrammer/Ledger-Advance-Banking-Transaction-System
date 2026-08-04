import { useContext } from "react";
import {Link, NavLink,useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import assets from "../../assets/assets";
import {
  Dashboard,
  People,
  AccountBalance,
  ReceiptLong,
  Payments,
  MoneyOff,
  MenuBook,
  AdminPanelSettings,
  Badge,
  History,
} from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  
  const { admin} = useContext(AdminContext);

  const activeLinkStyle = ({ isActive }) => ({
    backgroundColor: isActive ? 'var(--bg-forth-color)' : 'var(--bg-secondary-color)',
    color: isActive ? 'var(--text-active-color)' : 'var(--text-secondary-color)'
  });
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";
const isAdmin = admin?.role === "ADMIN";
const isCashier = admin?.role === "CASHIER";

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

        {/* Navigation */}
<nav className="nav">

  {/* Dashboard */}
  <NavLink
    to="/dashboard"
    className="nav-link"
    style={activeLinkStyle}
  >
<span><Dashboard /></span>
    Dashboard
  </NavLink>


  <NavLink
    to="/customers"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}>
    <span><People /></span>
    Customers
  </NavLink>

  <hr className="text-secondary" />

  <NavLink
    to="/transactions"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <ReceiptLong className="me-2" />
    Transactions
  </NavLink>

  <NavLink
    to="/cash-deposit"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <Payments className="me-2" />
    Cash Deposit
  </NavLink>

  <NavLink
    to="/cash-withdraw"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <MoneyOff className="me-2" />
    Cash Withdraw
  </NavLink>

  <NavLink
    to="/cash-book"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <MenuBook className="me-2" />
    Cash Book
  </NavLink>

  <hr className="text-secondary" />

{isSuperAdmin && (
  <NavLink
    to="/admins"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <AdminPanelSettings className="me-2" />
    Admins
  </NavLink>
)}

  {!isCashier && (
  <NavLink
    to="/cashiers"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <Badge className="me-2" />
    Cashiers
  </NavLink>
)}

  {!isCashier && (
  <NavLink
    to="/activity-logs"
    className="nav-link mb-2 rounded"
    style={activeLinkStyle}
  >
    <History className="me-2" />
    Activity Logs
  </NavLink>
)}      

</nav>
      </div>


    </div>
  );
};

export default Sidebar;