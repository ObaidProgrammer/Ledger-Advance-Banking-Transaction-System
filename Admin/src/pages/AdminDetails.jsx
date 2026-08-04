import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";
import {formatTransactionType, formatDateTimelong} from "../utils/format";

const AdminDetails = () => {
const navigate = useNavigate();
  const { adminId } = useParams();
  const {
    adminDetails,
    adminsLoading,
    loadAdminDetails,
  } = useContext(AdminContext);

  useEffect(() => {
    loadAdminDetails(adminId);
  }, [adminId]);
  if (adminsLoading) {
    return <Loader/>;
  }
  if (!adminDetails) {
    return <h4>No Admin Found</h4>;
  }
const handleBack = () => {
  navigate("/admins");
};
  return (
    <div className="container">
<div className="mainDetails">
        <h2>
        Admin Details
      </h2>
    
      <table className="table table-bordered">
        <tbody>
  <tr>
  <th>Name</th>
  <td>{adminDetails.name}</td>
</tr>

<tr>
  <th>Email</th>
  <td>{adminDetails.email}</td>
</tr>

<tr>
  <th>Role</th>
  <td>{adminDetails.role}</td>
</tr>

<tr>
  <th>Status</th>
  <td>
    <span >
      {adminDetails.status}
    </span>
  </td>
</tr>

<tr>
  <th>Created By</th>
  <td>{adminDetails.createdBy?.name || "-"}</td>
</tr>

<tr>
  <th>Created By Email</th>
  <td>{adminDetails.createdBy?.email || "-"}</td>
</tr>

<tr>
  <th>Created At</th>
  <td>
    {new Date(adminDetails.createdAt).toLocaleString()}
  </td>
</tr>
        </tbody>

      </table>

</div>
    </div>

  );

};

export default AdminDetails;