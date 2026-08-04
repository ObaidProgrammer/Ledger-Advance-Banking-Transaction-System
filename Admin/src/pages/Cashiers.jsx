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

const Cashiers = () => {
  const navigate = useNavigate();
const {
  cashiers,
  cashiersLoading,
  cashierPage,
  cashierPages,
  loadCashiers,
  changeCashierStatus,
} = useContext(AdminContext);
  const [filterBy, setFilterBy] = useState("name");
  const [value, setValue] = useState("");
const [showModal, setShowModal] = useState(false);
const [selectedCashier, setSelectedCashier] = useState(null);
const [status, setStatus] = useState("");
useEffect(() => {
loadCashiers("?page=1");
  }, []);
   
    useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
  
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      bootstrap.Tooltip.getOrCreateInstance(tooltipTriggerEl);
    });
  
  }, [cashiers]);
  if (cashiersLoading) {
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
    loadCashiers(
      `?filterBy=${filterBy}&value=${value}&page=1`
    );
  };
  const handleReset = () => {

    setFilterBy("name");

    setValue("");

    loadCashiers("?page=1");

  };
const handleStatusChange = async () => {
  try {

    await changeCashierStatus(
      selectedCashier._id,
      status
    );

    await loadCashiers(`?page=${cashierPage}`);

    setShowModal(false);

  } catch (error) {
    console.log(error);
  }
};
  const handlePageChange = (page) => {
    loadCashiers(`?filterBy=${filterBy}&value=${value}&page=${page}`
  );
  };
  return (
    <div className="container-fluid main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 >Cashiers</h2>
        <span className="Create-user" onClick={() => navigate("/cashiers/create")} >
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
          {cashiers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">No Cashier Found</td>
            </tr>
          ) : ( cashiers.map((cashier, index) => (
              <tr key={cashier._id}>
                <td>{(cashierPage - 1) * 10 + index + 1}</td>
                <td>{cashier.name}</td>
                <td>{cashier.email}</td>
                <td>{cashier.createdBy?.name || "-"}</td>
                <td>
  <span className={`badge ${ cashier.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                    {cashier.status}
           </span>
                </td>
                <td className="Action-Admin">
                                   <span className="Edit-details"
                      onClick={() =>
                   navigate(`/cashiers/edit/${cashier._id}`)}>
                    <EditNoteIcon/>
                    </span>
                  <span className="View-details"
                   onClick={() =>
                   navigate(`/cashiers/${cashier._id}`)}>
                    <VisibilityIcon />
                    </span>
                   <span className="Edit-status"
  onClick={() => {
setSelectedCashier(cashier);
setStatus(cashier.status);
    setShowModal(true);
  }}
>
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
          Change cashier Status
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
          page={cashierPage}
          pages={cashierPages}
          onPageChange={handlePageChange}/>
      </div>

    </div>
    </div>

  );

};

export default Cashiers;