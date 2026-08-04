import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loader from "../components/common/Loader";
import {formatTransactionType, formatDateTimelong} from "../utils/format";


const ActivityDetails = () => {
  const navigate = useNavigate();
  const { activityId } = useParams();

  const {
    activityDetails,
    activityLogsLoading,
    loadActivityDetails,
  } = useContext(AdminContext);

  useEffect(() => {
    loadActivityDetails(activityId);
  }, []);

  const handleBack = () => {
    navigate("/activity-logs");
  };

  if (activityLogsLoading) {
    return <Loader/>;
  }

  if (!activityDetails) {
    return <h4>Activity not found.</h4>;
  }

  return (
    <div className="container-fluid">

      <div className="mainDetails">
        <h2>Activity Details</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Activity ID</th>
                <td>{activityDetails._id}</td>
              </tr>
              <tr>
                <th>Action</th>
                <td>{formatTransactionType(activityDetails.action)}</td>
              </tr> 
              <tr>
                <th>Entity</th>
                <td>{activityDetails.entity}</td>
              </tr>
              <tr>
                <th>Entity ID</th>
                <td>{activityDetails.entityId || "-"}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{formatDateTimelong(activityDetails.createdAt)}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{formatDateTimelong(activityDetails.updatedAt)}</td>
              </tr> 
              <tr>
                <th>User ID</th>
                <td>{activityDetails.user?._id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{activityDetails.user?.name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{activityDetails.user?.email}</td>
              </tr>
              <tr>
                <th>Role</th>
                <td>{formatTransactionType(activityDetails.user?.role)}</td>
              </tr> 
              <tr>
                <th>Description</th>
                <td>{activityDetails.description}</td>
              </tr>
            </tbody>
     </table>
       </div>

    </div>
  );
};

export default ActivityDetails;