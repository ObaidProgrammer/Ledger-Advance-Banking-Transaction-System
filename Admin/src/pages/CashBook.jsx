import { useContext, useState,useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { formatTransactionType, formatDate, formatAmount } from "../utils/format";
import Pagination from "../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FilterBar from "../components/common/FilterBar";
import Loader from "../components/common/Loader";
import VisibilityIcon from '@mui/icons-material/Visibility';


const CashBook = () => {

  const navigate = useNavigate();
  const {
cashBook,

cashBookLoading,

cashBookPage,

cashBookPages,

loadCashBook,
  } = useContext(AdminContext);

  const [filterBy, setFilterBy] = useState("accountId");
const [value, setValue] = useState("");

  useEffect(() => {

    loadCashBook();

  }, []);
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((el) => {
    bootstrap.Tooltip.getOrCreateInstance(el);
  });
}, [cashBook]);

  if (cashBookLoading) {

    return <Loader/>;

  }
const handlePageChange = (page) => {

  loadCashBook(

`?filterBy=${filterBy}&value=${value}&page=${page}`

  );

};
const filterOptions = [

  {
    label: "Customer Account No",
    value: "accountId",
  },

  {
    label: "Transaction Type",
    value: "type",
  },


];
const handleApply = () => {

  loadCashBook(

`?filterBy=${filterBy}&value=${value}&page=1`

  );

};

const handleReset = () => {

  setFilterBy("accountId");

  setValue("");

  loadCashBook("?page=1");

};

  return (

    <div className="container main">

      <h2>

        Cash Book

      </h2>



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

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Customer Account No</th>
                <th>Amount</th>
                <th>Performed By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

<tbody>
  {cashBook.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center">
        No Cash Book Entries Found
      </td>
    </tr>
  ) : (
    cashBook.map((entry) => (
      <tr key={entry._id}>
  <td>
  {formatDate(entry.createdAt)}
</td>

     <td>
  {formatTransactionType(entry.type)}
</td>

        <td>{entry.account?.user?.name || "-"}</td>

        <td>{entry.account?._id || "-"}</td>

        <td>
         {formatAmount(entry.amount)}
        </td>

        <td>{entry.cashier?.name || "-"}</td>

        <td>{entry.transaction?.status || "-"}</td>

        <td className="Action">
<span  onClick={() =>
    navigate(`/cash-book/${entry._id}`)
  }
>
  <VisibilityIcon/>
</span>
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
<div className="d-flex justify-content-center mt-3">

<Pagination

page={cashBookPage}

pages={cashBookPages}

onPageChange={handlePageChange}

/>

</div>

        </div>
        </div>

  );

};

export default CashBook;