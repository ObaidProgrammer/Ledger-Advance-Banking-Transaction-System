import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import { AdminContext } from "../context/AdminContext";
import {formatDateTimelong} from "../utils/format";

const CustomerDetails = () => {

  const { customerId } = useParams();

  const {
    customerDetails,
    customerDetailsLoading,
    loadCustomerDetails,
  } = useContext(AdminContext);

  useEffect(() => {

    loadCustomerDetails(customerId);

  }, [customerId]);

  if (customerDetailsLoading) {
    return <Loader/>;
  }

  if (!customerDetails) {
    return <h3>Customer not found.</h3>;
  }

  return (

    <div className="container-fluid">
<div className="mainDetails">
  
      <h2>
        Customer Details
      </h2>

      <table className="table table-bordered">

        <tbody>

          <tr>
            <th>Name</th>
            <td>{customerDetails.name}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>{customerDetails.email}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{customerDetails.status}</td>
          </tr>

          <tr>
            <th>Currency</th>
            <td>{customerDetails.currency}</td>
          </tr>

          <tr>
            <th>Balance</th>
            <td>{customerDetails.balance}</td>
          </tr>

          <tr>
            <th>Account ID</th>
            <td>{customerDetails.accountId}</td>
          </tr>

          <tr>
            <th>Customer ID</th>
            <td>{customerDetails.customerId}</td>
          </tr>

          <tr>
            <th>Created At</th>
<td>
  {formatDateTimelong(customerDetails.createdAt)}
</td>
          </tr>

        </tbody>

      </table>

</div>
    </div>

  );

};

export default CustomerDetails;