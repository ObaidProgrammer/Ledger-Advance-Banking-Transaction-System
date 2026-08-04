import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const FilterBar = ({
  filterBy,
  setFilterBy,
  value,
  setValue,
  from,
  setFrom,
  to,
  setTo,
  options,
  onApply,
  onReset,
}) => {

  const getValueOptions = () => {

    switch (filterBy) {

      case "transactionType":

        return [
          {
            label: "Cash Deposit",
            value: "CASH_DEPOSIT",
          },
          {
            label: "Cash Withdraw",
            value: "CASH_WITHDRAW",
          },
          {
            label: "Transfer",
            value: "TRANSFER",
          },
        ];

case "status": {
  const statusFilter = options.find(
    (item) => item.value === "status"
  );

  return statusFilter?.values || [
    { label: "Completed", value: "COMPLETED" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
    { label: "Reversed", value: "REVERSED" },
  ];
}
        case "type":

    return [

        {
            label: "Cash Deposit",
            value: "CASH_DEPOSIT",
        },

        {
            label: "Cash Withdraw",
            value: "CASH_WITHDRAW",
        },
        
    ];
    case "role":

return [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Admin", value: "ADMIN" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Customer", value: "CUSTOMER" },

];
case "entity":

return [

  { label: "Admin", value: "ADMIN" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Transaction", value: "TRANSACTION" },
  { label: "Account", value: "ACCOUNT" },
  { label: "System", value: "SYSTEM" },

];
case "action":

return [

  {
    label: "Create Admin",
    value: "CREATE_ADMIN",
  },

  {
    label: "Update Admin",
    value: "UPDATE_ADMIN",
  },

  {
    label: "Update Admin Status",
    value: "UPDATE_ADMIN_STATUS",
  },

  {
    label: "Create Cashier",
    value: "CREATE_CASHIER",
  },

  {
    label: "Update Cashier",
    value: "UPDATE_CASHIER",
  },

  {
    label: "Update Cashier Status",
    value: "UPDATE_CASHIER_STATUS",
  }
];

      default:

        return [];

    }

  };

  const valueOptions = getValueOptions();

const useDropdown =
    filterBy === "action" ||
    filterBy === "role" ||
    filterBy === "entity" ||
    filterBy === "status" ||
    filterBy === "transactionType" ||
    filterBy === "type";
  return (
<div className='FilterBar'>

            <select className="form-select filter-select"
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setValue("");
              }}>
              {options.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>

              ))}
            </select>


          {/* Value */}
          {
  filterBy === "date" ? (

<div className="date-filter">

<input
    type="date"
    className="form-control"
    value={from}
    onChange={(e) => setFrom(e.target.value)}
/>

<input
    type="date"
    className="form-control"
    value={to}
    onChange={(e) => setTo(e.target.value)}
/>

</div>
  ) : useDropdown ? (

                <select  className="form-select filter-value-select"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}>
                  <option value="">
                    Select Value
                  </option>
                  {
                    valueOptions.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}>
                        {item.label}
                      </option>
                    ))
                  }
                </select>
 
  ) : (

                <input
               className="form-control filter-input"
                  placeholder={`Enter ${filterBy}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
 
  )
}
          {/* Apply */}
            <button
              className="btn filter-btn search-btn"
              onClick={onApply}><SearchIcon/>
            </button>
          {/* Reset */}
            <button
              className="btn filter-btn reset-btn"
              onClick={onReset}
            >
              <ClearAllIcon/>
            </button>
</div>
  );

};

export default FilterBar;