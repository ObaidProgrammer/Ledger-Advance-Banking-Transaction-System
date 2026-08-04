import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import { formatTransactionType,formatDateTimelong } from "../utils/format";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterBar from "../components/common/FilterBar";
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';



const ActivityLogs = () => {
  const navigate = useNavigate();

  const {
    activityLogs,
    activityLogsLoading,
    activityPage,
    activityPages,
    loadActivityLogs,
  } = useContext(AdminContext);

const [filterBy, setFilterBy] = useState("action");
const [value, setValue] = useState("");
const [from, setFrom] = useState("");
const [to, setTo] = useState("");

const filterOptions = [
  {
    label: "Action",
    value: "action",
  },
  {
    label: "Role",
    value: "role",
  },
  {
    label: "Entity",
    value: "entity",
  },
  {
    label: "Performed By ID",
    value: "userId",
  },
  {
    label: "Entity ID",
    value: "entityId",
  },
  {
    label: "Date",
    value: "date",
  },
];
  useEffect(() => {
    loadActivityLogs("?page=1");
  }, []);

  if (activityLogsLoading) {
    return <Loader/>;
  }

const buildQuery = (page = 1) => {

  let query = `?page=${page}`;

  if (filterBy === "date") {

    if (from) {
      query += `&from=${from}`;
    }

    if (to) {
      query += `&to=${to}`;
    }

  } else if (value) {

    query += `&${filterBy}=${encodeURIComponent(value)}`;

  }

  return query;

};
  const handleApply = () => {
    loadActivityLogs(buildQuery(1));
  };
const handleReset = () => {

  setFilterBy("action");
  setValue("");
  setFrom("");
  setTo("");

  loadActivityLogs("?page=1");

};

  const handlePageChange = (page) => {
    loadActivityLogs(buildQuery(page));
  };

  return (
    <div className="container-fluid main">

        <h2>Activity Logs</h2>

<div className="card mb-4">

  <FilterBar
    filterBy={filterBy}
    setFilterBy={setFilterBy}
    value={value}
    setValue={setValue}
    options={filterOptions}
    onApply={handleApply}
    onReset={handleReset}
    from={from}
    setFrom={setFrom}
    to={to}
    setTo={setTo}
    
  />

</div>

 
  <div className="activity-log-list">

  {activityLogs.length === 0 ? (

    <div className="text-center py-5">
      No Activity Logs Found
    </div>

  ) : (

    activityLogs.map((log) => (

      <div
        className="activity-card"
        key={log._id}
      >
            <div
        className="activity-view"
        onClick={() => navigate(`/activity-logs/${log._id}`)}
    >
        <VisibilityIcon/>
    </div>
<div className="activity">
  
        <div className="activity-top">

    <div className="activity-user">

        <div className="detail-row">
            <span>Name</span>
            <small>{log.user?.name || "-"}</small>
        </div>

        <div className="detail-row">
            <span>Role</span>
            <small>{formatTransactionType(log.user?.role) || "-"}</small>
        </div>

        <div className="detail-row">
            <span>ID</span>
            <small>{log.user?._id}</small>
        </div>
<div className="detail-row">
    <span>Entity ID</span>
    <small>{log.entityId || "-"}</small>
</div>
    </div>

    <div className="activity-action">

        <span>
            Action
        </span>

        <p className={`action-badge ${log.action.toLowerCase()}`}>
            {formatTransactionType(log.action)}
        </p>

    </div>


</div>


    <div className="activity-description">

        <span>
            Description
        </span>

        <p>{log.description}</p>

        <small>
            {formatDateTimelong(log.createdAt)}
        </small>

</div>
</div>

      </div>

    ))

  )}

</div>
      <div className="d-flex justify-content-center">
        <Pagination
          page={activityPage}
          pages={activityPages}
          onPageChange={handlePageChange}
        />

      </div>

    </div>
  );
};

export default ActivityLogs;