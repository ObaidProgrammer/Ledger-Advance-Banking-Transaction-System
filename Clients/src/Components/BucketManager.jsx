import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {formatAmount } from "../utils/format";


const BucketManager = () => {
  const { buckets, addBucket, deleteBucket, dashboard } = useContext(AppContext);
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");

  const totalBalance = dashboard?.totalBalance || 0; 
  const totalAllocated = buckets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const freeBalance = Math.max(0, totalBalance - totalAllocated);

  // Percentage calculations
  const allocatedPercentage = totalBalance > 0 ? ((totalAllocated / totalBalance) * 100).toFixed(2) : 0;
  const freePercentage = totalBalance > 0 ? ((freeBalance / totalBalance) * 100).toFixed(2) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (buckets.length >= 10) {
      toast.warning("Maximum allocation limit (10) reached!");
      return;
    }
    
    const response = await addBucket(desc, amt);
    if (response.success) {
      toast.success("Partition created successfully!");
      setDesc(""); 
      setAmt("");
    } else {
      toast.error(response.message || "Failed to create partition");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row Allocation">

        <div className="col-lg-12 Allocation-head">
              <h2>Cash Bucket Fund Allocation</h2>
        <small className="text-muted">Allocate and manage your money smartly. Divide your balance into buckets and track each allocation.</small>
        </div>

        {/* Total Account Balance */}
        <div className="col-xl-4 col-lg-4 col-md-4">
          <div className="total-balance box">
       <div className="text">
         <small>Total Account Balance</small>
            <h3>PKR {formatAmount(totalBalance)}</h3>
       </div>
       <div className="icon">
  <AccountBalanceWalletIcon/>
       </div>
          </div>
        </div>

        {/* Total Allocated Amount */}
        <div className="col-xl-4 col-lg-4 col-md-4">
          <div className="Allocated-amount box">
<small>Total Allocated Amount</small>
            <h3>PKR {formatAmount(totalAllocated)}</h3>
            <small className="progress-text">{allocatedPercentage}% of total</small>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${allocatedPercentage}%`, backgroundColor: "var(--text-received-color)" }}></div>
          </div>
          </div>
            
        </div>

        {/* Available Balance */}
        <div className="col-xl-4 col-lg-4 col-md-4">
            <div className="Allocated-balance box">
              <small>Available (Allocation Balance)</small>
            <h3>PKR {formatAmount(freeBalance)}</h3>
            <small className="progress-text">{freePercentage}% of total</small>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{ width: `${freePercentage}%` }}></div>
          </div>
            </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="row g-4">
        
        {/* 2. LEFT SIDE: ADD NEW ALLOCATION */}
        <div className="col-lg-4">
          <div className="Allocation-form">
              <div className="text">
                <h5>Add New Allocation</h5>
              <span>{buckets.length} / 10</span>
              </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label>Description</label>
                <input 
                  type="text"
                  className="form-control" 
                  placeholder="Enter your Description" 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  required
                />
              </div>

              <div className="mb-4">
                <label>Amount (PKR)</label>
                <div className="input-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Enter your amount" 
                    value={amt} 
                    onChange={e => setAmt(e.target.value)}
                    required
                  />
                  <span className="input-group-text">PKR</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn" >
                Add Allocation
              </button>
            </form>

            {/* Info Hint Box */}
            <div className="d-flex p-2 gap-2 align-items-start" style={{ backgroundColor: "var(--bg-balance-color)", borderRadius: "8px", border: "1px solid var(--border-primary-color)" }}>
              <InfoOutlinedIcon className="text-primary mt-05" style={{ fontSize: "1.2rem" }} />
              <small className="text-muted" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                You can add up to 10 allocations. Amounts are deducted from your total balance.
              </small>
            </div>
          </div>
        </div>

        {/* 3. RIGHT SIDE: YOUR ALLOCATIONS TABLE */}
        <div className="col-lg-8 Allocation-table">
          <div className="card">
            <div className="text">
              <h5>Your Allocations</h5>
            
            </div>
            {buckets.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr className="text-muted small uppercase">
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "35%" }}>Description</th>
                      <th style={{ width: "25%" }}>Amount</th>
                      <th style={{ width: "20%" }}>Percentage %</th>
                      <th className="text-end" style={{ width: "15%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buckets.map((b, index) => {
                      const itemPercentage = totalBalance > 0 ? ((b.amount / totalBalance) * 100).toFixed(2) : 0;
                      return (
                        <tr key={b._id}>
                          <td >{index + 1}</td>
                          <td>
                            <span>{b.description}</span>
                          </td>
                          <td>
                            PKR {formatAmount(b.amount)}
                          </td>
                          <td>
                            <span>{itemPercentage}%</span>
                            <div className="progress" >
                              <div className="progress-bar" role="progressbar" style={{ width: `${itemPercentage}%`,backgroundColor: "var(--text-received-color)" }}></div>
                            </div>
                          </td>
                          <td className="d-flex align-item-center justify-content-end">
                            <button 
                              className="btn btn-sm btn-outline-danger border-0" 
                              onClick={() => deleteBucket(b._id)}
                             
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p className="m-0">No active allocations. Start by adding one from the left panel!</p>
              </div>
            )}

            {/* Table Summary Footer */}
            <div className="Table-footer">
              <div className="box box1">
                <small>Total Allocated</small>
                <strong> PKR {formatAmount(totalAllocated)}</strong>
              </div>
              <div className="box box2">
                <small>Remaining Balance</small>
                <strong> PKR {formatAmount(freeBalance)}</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BucketManager;