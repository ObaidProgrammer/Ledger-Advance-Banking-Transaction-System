import { useContext, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { formatTransactionType, formatDate, formatAmount } from "../utils/format";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import cashOnHandAnimation from "../assets/lottie/cash-on-hand.json";
import customersAnimation from "../assets/lottie/Total-customer.json";
import transactionsAnimation from "../assets/lottie/Total-Transaction.json";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Loader from "../components/common/Loader";

const Dashboard = () => {
  const {
    dashboard,
    dashboardLoading,
    loadDashboard,
  } = useContext(AdminContext);

  useEffect(() => {
    loadDashboard();
  }, []);

  if (dashboardLoading) {
    return (
      <div>
  <Loader/>        
      </div>
    );
  }

  return (
    <div className="container-fluid Dashboard">
<h5>Overview</h5>
      <div className="row">

        <div className="col-lg-6 col-md-6">
<div className="box cash-on-hand">
                <div className="text">
                <h6>
                Cash On Hand
              </h6>
              <h3>
Rs. {formatAmount(dashboard?.cashOnHand || 0)}
              </h3>
              </div>
                          <div className="icon">
<DotLottieReact
  data={cashOnHandAnimation}
  loop
  autoplay
/>
              </div>

</div>
        </div>

        <div className="col-lg-3 col-md-6">
<div className="box total-customer">
                <div className="text">
                <h6>
                Customers
              </h6>
              <h3>
                {formatAmount(dashboard?.totalCustomers)}
              </h3>
              </div>
              <div className="icon">
 <DotLottieReact
  data={customersAnimation}
  loop
  autoplay
/>
</div>
</div>
        </div>

        <div className="col-lg-3 col-md-6">
<div className="box total-transcations">
                <div className="text">
                <h6>
                Transactions
              </h6>
              <h3>
                {formatAmount(dashboard?.totalTransactions || 0)}
              </h3>
              </div>
               <div className="icon">
  <DotLottieReact
  data={transactionsAnimation}
  loop
  autoplay
/>
</div>
</div>
        </div>

      </div>
      <div className="row">

        <div className="col-lg-6">
<div className="box total-Deposit">
      <div className="text">
                <h6>
                Total Deposit
              </h6>
              <h3>
                Rs. {formatAmount(dashboard?.totalDeposit || 0)}
              </h3>
            </div>
 <div className="icon">
                <ArrowCircleDownIcon/>
              </div>

</div>
        </div>

        <div className="col-lg-6">
<div className="box total-Withdraw">
  <div className="text">
                <h6>
                Total Withdraw
              </h6>
              <h3>
                Rs. {formatAmount(dashboard?.totalWithdraw || 0)}
              </h3>
</div>
<div className="icon">
                  <ArrowCircleUpIcon/>

</div>
</div>
            </div>

      </div>
<div className="row">
  {/* Latest Transactions */}

<div className="Latest-Transaction">
  <div className="text">
        <h3>
      Latest Transactions
    </h3>

  </div>
        <table className="table table-hover mb-0 align-middle">

        <thead className="table">

          <tr>

            <th>#</th>

            <th>Customer</th>

            <th>Type</th>

            <th>Amount</th>

            <th>Status</th>

            <th>Performed By</th>

            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {dashboard?.latestTransactions?.length > 0 ? (

            dashboard.latestTransactions.map((transaction, index) => (

              <tr key={transaction._id}>

                <td>
                  {index + 1}
                </td>

                <td>
                  {transaction.toAccount?.user?.name ||
                    transaction.fromAccount?.user?.name ||
                    "N/A"}
                </td>

                <td>
{formatTransactionType(transaction.transactionType)}
                </td>

                <td className="fw-bold">
                Rs. {formatAmount(transaction.amount || 0)}

                </td>

                <td>

                  <span
                    className={`badge ${
                      transaction.status === "COMPLETED"
                        ? "bg-success"
                        : transaction.status === "PENDING"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {transaction.status}
                  </span>

                </td>

                <td>
                  {transaction.performedBy?.name}
                </td>

                <td>
               {formatDate(transaction.createdAt)}
                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="7"
                className="text-center py-4"
              >

                No Transactions Found

              </td>

            </tr>

          )}

        </tbody>

      </table>

</div>
    </div>

  </div>

  );
};

export default Dashboard;