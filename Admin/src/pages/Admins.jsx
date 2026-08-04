import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import FilterBar from "../components/common/FilterBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';


const Admins = () => {
  const navigate = useNavigate();
  const {admins, adminsLoading, adminPage, adminPages, loadAdmins, changeAdminStatus, } = useContext(AdminContext);
  const [filterBy, setFilterBy] = useState("name");
  const [value, setValue] = useState("");
const [showModal, setShowModal] = useState(false);
const [selectedAdmin, setSelectedAdmin] = useState(null);
const [status, setStatus] = useState("");
useEffect(() => {
    loadAdmins("?page=1");
  }, []);
  
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl);
  });

}, [admins]);
  if (adminsLoading) {
    return <div><Loader/></div>
  }
const filterOptions = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Status",
    value: "status",
    values: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
  },
];

  const handleApply = () => {
    loadAdmins(
      `?filterBy=${filterBy}&value=${value}&page=1`
    );
  };
  const handleReset = () => {

    setFilterBy("name");

    setValue("");

    loadAdmins("?page=1");

  };
const handleStatusChange = async () => {
  try {

    await changeAdminStatus(
      selectedAdmin._id,
      status
    );

    await loadAdmins(`?page=${adminPage}`);

    setShowModal(false);

  } catch (error) {
    console.log(error);
  }
};
  const handlePageChange = (page) => {
    loadAdmins(`?filterBy=${filterBy}&value=${value}&page=${page}`
  );
  };
  return (
    <div className="container-fluid main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admins</h2>
        <span className="Create-user" onClick={() => navigate("/admins/create")} >
          <PersonAddAlt1Icon/>
        </span>
      </div>
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
            <th>Created By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">No Admins Found</td>
            </tr>
          ) : ( admins.map((admin, index) => (
              <tr key={admin._id}>
                <td>{(adminPage - 1) * 10 + index + 1}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.createdBy?.name || "-"}</td>
                <td>
  <span className={`badge ${ admin.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                    {admin.status}
           </span>
                </td>
                <td className="Action-Admin">
                  <span className="Edit-details"
                  onClick={() =>
                   navigate(`/admins/edit/${admin._id}`)}><EditNoteIcon/></span>
<span className="View-details"
  onClick={() => navigate(`/admins/${admin._id}`)}
>
  <VisibilityIcon />
</span>
                   <span className="Edit-status"
                      onClick={() => {
    setSelectedAdmin(admin);
    setStatus(admin.status);
    setShowModal(true);
  }}>
<DriveFileRenameOutlineIcon/>
</span>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">

      <div className="modal-header">
        <h5 className="modal-title">
          Change Admin Status
        </h5>
      </div>

      <div className="modal-body">

        <label className="form-label">
          Status
        </label>

        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

      </div>

      <div className="modal-footer">

        <button
          className="btn btn-secondary"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={handleStatusChange}
        >
          Save
        </button>

      </div>

    </div>
  </div>
)}
      <div className="d-flex justify-content-center">
        <Pagination
          page={adminPage}
          pages={adminPages}
          onPageChange={handlePageChange}/>
      </div>

    </div>
    </div>

  );

};

export default Admins;