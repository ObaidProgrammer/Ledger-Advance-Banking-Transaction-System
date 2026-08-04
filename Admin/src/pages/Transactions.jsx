import { useContext, useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { formatTransactionType, formatDateTime, formatAmount } from "../utils/format";
import Pagination from "../components/common/Pagination";
import FilterBar from "../components/common/FilterBar";
import Loader from "../components/common/Loader";
import VisibilityIcon from '@mui/icons-material/Visibility';



const Transactions = () => {
  const navigate = useNavigate();
  const {
 transactions,
  transactionsLoading,
  transactionPage,
  transactionPages,
  loadTransactions,
  } = useContext(AdminContext);
  const [filterBy,setFilterBy]=useState("transactionType");
  const [value,setValue]=useState("");
 
  useEffect(() => {
  loadTransactions("?page=1");
}, []);
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((el) => {
    bootstrap.Tooltip.getOrCreateInstance(el);
  });
}, [transactions]);

  if (transactionsLoading) {
    return <div><Loader/></div>
  }

const filterOptions = [

  {
    label: "Account ID",
    value: "accountId",
  },

  {
    label: "Transaction Type",
    value: "transactionType",
  },

  {
    label: "Status",
    value: "status",
  },

];
const handlePageChange = (page) => {

    loadTransactions(

`?filterBy=${filterBy}&value=${value}&page=${page}`

    );

};
const handleApply = () => {
  loadTransactions(
    `?filterBy=${filterBy}&value=${value}&page=1`
  );

};

const handleReset = () => {

    setValue("");

    setFilterBy("transactionType");

    loadTransactions("?page=1");

};
  return (
    <div className="container-fluid main">
      <h2 >Transactions</h2>
      <FilterBar

filterBy={filterBy}

setFilterBy={setFilterBy}

value={value}

setValue={setValue}

options={filterOptions}

onApply={handleApply}

onReset={handleReset}

/>
      <div className="main-table">
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Performed By</th>
            <th>Customer Account No</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id}>
      <td>
  {(transactionPage - 1) * 10 + index + 1}
</td>
              <td>{formatTransactionType(transaction.transactionType)}</td>
              <td>{formatAmount(transaction.amount)}</td>
              <td>{transaction.status}</td>
              <td>
                {transaction.performedBy?.name}
              </td>
<td>
  {transaction.fromAccount?._id ||
   transaction.toAccount?._id}
</td>
              <td>
                {formatDateTime(transaction.createdAt)}
              </td>
              <td className="Action">
                <span  onClick={() =>
                    navigate(
                      `/transactions/${transaction._id}`
                    )
                  }>
                  <VisibilityIcon/>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center mt-3">

  <Pagination
    page={transactionPage}
    pages={transactionPages}
    onPageChange={handlePageChange}
  />

</div>
    </div>
    </div>
  );

};

export default Transactions;