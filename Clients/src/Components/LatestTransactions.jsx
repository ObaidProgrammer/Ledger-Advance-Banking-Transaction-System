import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const LatestTransactions = () => {
  const { dashboard } = useContext(AppContext);
  
  const transactions = dashboard?.latestTransactions || [];
  const myAccounts = dashboard?.myAccounts || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const fromName = tx.fromAccount?.user?.name?.toLowerCase() || "";
const toName = tx.toAccount?.user?.name?.toLowerCase() || "";
const transactionType = (tx.transactionType || "").toLowerCase();

const term = searchTerm.toLowerCase().trim();

const matchesName =
  fromName.includes(term) ||
  toName.includes(term) ||
  transactionType.includes(term);
let matchesDate = true;

if (filterDate && tx.createdAt) {
  const d = new Date(tx.createdAt);

  const txDate =
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  matchesDate = txDate === filterDate;
}

    return matchesName && matchesDate;
  });

  const getAvatarColor = (name) => {
    if (!name || name === "Unknown") return "#6b7280";
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#3B82F6", // Blue
      "#10B981", // Emerald
      "#8B5CF6", // Violet
      "#EC4899", // Pink
      "#06B6D4"  // Cyan
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="container-fluid">
      <div className="Latest-Transaction">
        <h2 className="px-2 fw-bold">Recent Transactions</h2>
        
        {/* 🛠️ Controlled Search Filters */}
        <div className="d-flex gap-2 mb-4 px-2">
          <input 
            type="text" 
            placeholder="Search by username..." 
            className="form-control"
            value={searchTerm} // Controlled Input
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input 
            type="date" 
            className="form-control"
            value={filterDate} // Controlled Input
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>     

        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => {
let label = "";
let name = "";
let amountPrefix = "";

if (tx.transactionType === "CASH_DEPOSIT") {
  label = "To:";
  name = "Cash Deposit";
  amountPrefix = "+";
} 
else if (tx.transactionType === "CASH_WITHDRAW") {
  label = "From:";
  name = "Cash Withdraw";
  amountPrefix = "-";
} 
else {
  const fromId = tx.fromAccount?._id || tx.fromAccount;
  const isSent = myAccounts.includes(fromId);

  const otherParty = isSent ? tx.toAccount : tx.fromAccount;

  label = isSent ? "To:" : "From:";
  name = otherParty?.user?.name || "Unknown";
  amountPrefix = isSent ? "-" : "+";
}

const statusColor =
  tx.status === "COMPLETED"
    ? "var(--bg-active-color)"
    : tx.status === "PENDING"
    ? "#f59e0b"
    : "#ef4444";

            return (
              <div key={tx._id} className="boxes">
                <div className="box1">
                  <div 
                    className="icon" 
                    style={{ 
                      backgroundColor: `${getAvatarColor(name)}20`, 
                      color: getAvatarColor(name),
                      border: `1px solid ${getAvatarColor(name)}` 
                    }}
                  >
                    <h3 className="m-0">{name.charAt(0).toUpperCase()}</h3>
                  </div>
                  <div className="text">
                    <p className="m-0 fw-bold">
<small className="text-muted fw-normal">
    {label}{" "}
</small>
                      {name}
                    </p>
                    <small className="text-secondary">{formatDate(tx.createdAt)}</small>
                  </div>
                </div>

                <div className="box2 text-end">
                  <p className="m-0 fw-bold ">
        {amountPrefix} PKR {tx.amount?.toLocaleString()}
                  </p>
                  <span 
                    className="status-pill" 
                    style={{ 
                      backgroundColor: `${statusColor}15`, 
                      color: statusColor,
                      border: `1px solid ${statusColor}` 
                    }}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-5 text-muted">
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestTransactions;