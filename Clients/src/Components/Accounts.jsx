import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Accounts = () => {
  const { accounts } = useContext(AppContext);

  const handleCopyClick = (accountId) => {
    navigator.clipboard.writeText(accountId)
      .then(() => {
        toast.success("Account ID copied!");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  return (
    <section>
      {/* ACCOUNTS */}
      <div className="Accounts">
        {accounts?.length > 0 ? (
          accounts.map((acc) => (
            <div className="container-fluid" key={acc._id}>
             <div className="row">
              <div  className="account-id col-xl-8 col-lg-7 col-md-8">
                <h5>Accounts Details</h5>

                <p>
                  <span>Account ID:</span> {acc._id} 
                  {/* --- COPY ICON --- */}
                  <ContentCopyIcon 
                    onClick={() => handleCopyClick(acc._id)} 
                    style={{ cursor: "pointer", fontSize: "17px", marginLeft: "6px" }} 
                  />
                </p>
              </div>
              <div className="status-currency col-xl-4 col-lg-5 col-md-4">
              <a><span>Status:</span> {acc.status}</a>
              <a><span>Currency:</span> {acc.currency}</a>
              </div>
             </div>
            </div>
          ))
        ) : (
          <p>No accounts found</p>
        )}
      </div>
    </section>
  );
};

export default Accounts;