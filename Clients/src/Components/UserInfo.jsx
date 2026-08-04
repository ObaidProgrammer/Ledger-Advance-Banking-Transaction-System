import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const UserInfo = () => {
  const { user } = useContext(AppContext);

  return (
    <section>
      
      {/* USER */}
      <div className="UserInfo">
        <h3>Hello,{user?.name}</h3>
         <h5>Welcome back to Ledger</h5>
      </div>
    </section>
  );
};

export default UserInfo;
