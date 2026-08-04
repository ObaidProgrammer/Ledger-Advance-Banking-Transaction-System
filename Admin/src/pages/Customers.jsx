import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "../utils/format";
import FilterBar from "../components/common/FilterBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import VisibilityIcon from '@mui/icons-material/Visibility';



const Customers = () => {

  const navigate = useNavigate();

const {
admin,
  customers,

  customersLoading,

  customerPage,

  customerPages,

  loadCustomers,

} = useContext(AdminContext);
const [filterBy, setFilterBy] = useState("name");
const [value, setValue] = useState("");

useEffect(() => {

  loadCustomers("?page=1");

}, []);
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((el) => {
    bootstrap.Tooltip.getOrCreateInstance(el);
  });
}, [customers]);
  if (customersLoading) {
    return <div><Loader/></div>
  }
const filterOptions = [

  {
    label: "Customer Name",
    value: "name",
  },

  {
    label: "Email",
    value: "email",
  },

  {
    label: "Customer Account No",
    value: "accountId",
  },


];
const handleApply = () => {

  loadCustomers(

    `?filterBy=${filterBy}&value=${value}&page=1`

  );

};

const handleReset = () => {

  setFilterBy("name");

  setValue("");

  loadCustomers("?page=1");

};
  const handlePageChange = (page) => {

  loadCustomers(

    `?filterBy=${filterBy}&value=${value}&page=${page}`

  );

};


  return (
    <div className="container-fluid main">

      <h2 >Customers</h2>
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
            <th>Name</th>
            <th>Email</th>
          <th>Customer Account No</th>
            <th>Balance</th>
            <th>Currency</th>
            <th>Status</th>
          {admin?.role !== "CASHIER" && (
            <th>Action</th>
          )}
          </tr>
        </thead>

      <tbody>

  {customers.length === 0 ? (

    <tr>

      <td colSpan={8} className="text-center">

        No Customers Found

      </td>

    </tr>

  ) : (

    customers.map((customer, index) => (

      <tr key={customer.customerId}>

        <td>
          {(customerPage - 1) * 10 + index + 1}
        </td>

        <td>{customer.name}</td>

        <td>{customer.email}</td>

        <td>{customer.accountId}</td>

        <td>
         {formatAmount(customer.balance || 0)}
        </td>

        <td>{customer.currency}</td>

        <td>

          <span
            className={`badge ${
              customer.status === "ACTIVE"
                ? "bg-success"
                : "bg-danger"
            }`}
          >
            {customer.status}
          </span>

        </td>

        <td className="Action" >

{admin?.role !== "CASHIER" && (
  <span  onClick={() =>
      navigate(`/customers/${customer.customerId}`)
    }  >
    <VisibilityIcon/>
  </span>
)}

        </td>

      </tr>

    ))

  )}

</tbody>
      </table>
      </div>
<div className="d-flex justify-content-center mt-3">

  <Pagination

    page={customerPage}

    pages={customerPages}

    onPageChange={handlePageChange}

  />

</div>
    </div>
  );
};

export default Customers;