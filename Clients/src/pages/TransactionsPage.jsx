import React from "react";
import SideBar from "../Components/SideBar";
import LatestTransactions from "../Components/LatestTransactions"; 

const TransactionsPage = () => {
  return (
    <div className="container-fluid g-0">
      <div className="row">
        
        <div className="col-xl-2 col-lg-3 col-md-3 col-sm-12 sidebar-wrapper">
          <SideBar />
        </div>

        <div className="col-xl-10 col-lg-9 col-md-9 col-sm-12 content-wrapper">
             <LatestTransactions />
            
          
        </div>

      </div>
    </div>
  );
};

export default TransactionsPage;