import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { formatDateTimelong } from "../utils/format";

const CashierDetails = () => {
const navigate = useNavigate();
const { cashierId } = useParams();
const {
    cashierDetails,
    cashiersLoading,
    loadCashierDetails,
} = useContext(AdminContext);
  useEffect(() => {
  loadCashierDetails(cashierId);
  }, [cashierId]);

  if (cashiersLoading) {
    return <h4>Loading...</h4>;
  }

  if (!cashierDetails) {

    return <h4>No Cashier Found</h4>;

  }
const handleBack = () => {
  navigate("/cashiers");
};
  return (

    <div className="container">
<div className="mainDetails">
  
      <h2> cashierDetails</h2>

      <table className="table table-bordered">

        <tbody>

  <tr>
  <th>Name</th>
  <td>{cashierDetails.name}</td>
</tr>

<tr>
  <th>Email</th>
  <td>{cashierDetails.email}</td>
</tr>

<tr>
  <th>Role</th>
  <td>{cashierDetails.role}</td>
</tr>

<tr>
  <th>Status</th>
  <td>
    <span>
      {cashierDetails.status}
    </span>
  </td>
</tr>

<tr>
  <th>Created By</th>
  <td>{cashierDetails.createdBy?.name || "-"}</td>
</tr>

<tr>
  <th>Created By Email</th>
  <td>{cashierDetails.createdBy?.email || "-"}</td>
</tr>

<tr>
  <th>Created At</th>
  <td>
    {formatDateTimelong(cashierDetails.createdAt)}
  </td>
</tr>
        </tbody>

      </table>

</div>
    </div>

  );

};

export default CashierDetails;