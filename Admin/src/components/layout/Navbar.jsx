import { useContext } from "react";
import { AccountCircle } from "@mui/icons-material";
import { AdminContext } from "../../context/AdminContext";
import {Logout,} from "@mui/icons-material";
import { formatTransactionType } from "../../utils/format";

const Navbar = () => {

  const { logout , admin} = useContext(AdminContext);

  const handleLogout = async () => {
  await logout();

  navigate("/login", {
    replace: true,
  });

};

  return (
      <div className="container-fluid">

    <div className="nav-bar">
<div className="text">
          <h3> Hello, {admin?.name}</h3>
        <h5>Welcome back to Ledger</h5>

</div>
<div className="role-logout">
 <div className="user">

          <AccountCircle
            style={{
              fontSize: "40px",
              color: "var(--bg-active-color)",
            }}
          />
               <span>{formatTransactionType(admin?.role || "")}</span>

 </div>


      {/* Logout */}
      <button className="btn" onClick={handleLogout}>
        <Logout />
      </button>


</div>
      </div>

    </div>

  );

};

export default Navbar;