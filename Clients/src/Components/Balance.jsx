import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import {formatAmount } from "../utils/format";

const Balance = () => {

  const { dashboard } = useContext(AppContext);
  return (
    <div>
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 Balance">
          <h5>Overview</h5>
          <div className="row m-0">
            <div className="col-xl-4 col-lg-4 col-md-4">
             <div className="total-balance">
         <div className="box">
                 <div className="text">
              <h5>Total Balance</h5>
        <h4>
          PKR {formatAmount(dashboard?.totalBalance || 0)}
        </h4>

              </div>
              <div className="icon">
                <AccountBalanceWalletIcon/>
              </div>                
              </div>
             </div>
              
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="total-sent">
              <div className="box">
                       <div className="text total-sent">
                <h5>Total Sent</h5>

        <h4>
          PKR {formatAmount(dashboard?.totalSent || 0)}
        </h4>

              </div>
              <div className="icon">
                <ArrowCircleUpIcon/>
              </div>                
              </div>
              </div>
        
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4">
              <div className="total-received">
<div className="box">
              <div className="text total-received">
                 <h5>Total Received</h5>

        <h4>
          PKR {formatAmount(dashboard?.totalReceived || 0)}
        </h4>
              </div>
              <div className="icon">
                <ArrowCircleDownIcon/>
              </div>                
              </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Balance;