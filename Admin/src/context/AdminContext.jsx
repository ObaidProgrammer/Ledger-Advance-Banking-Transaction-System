import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  getCashiers,
  getCashierDetails,
  createCashier,
  updateCashier,
  updateCashierStatus,
} from "../services/cashier.service";
import { getDashboard ,
  getAdmins,getAdminDetails,createAdmin,updateAdmin,updateAdminStatus
} from "../services/adminDashboard.service";
import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
  getCustomers,
  getCustomerDetails,
  getTransactions,
  getTransactionDetails,
  verifyAccount as verifyAccountService,
  executeCashDeposit,
  executeCashWithdraw,
  getCashBook,
  getCashBookDetails,
  getActivityLogs,
  getActivityDetails,
} from "../services/admin.service";

export const AdminContext = createContext();
const AdminProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const [admin, setAdmin] = useState(() => {
    const user = localStorage.getItem("adminUser");
    return user ? JSON.parse(user) : null;
  });
const [loading, setLoading] = useState(true);
const [loginLoading, setLoginLoading] = useState(false); 
const [dashboard, setDashboard] = useState(null);
const [dashboardLoading, setDashboardLoading] = useState(false);
const [customers, setCustomers] = useState([]);
const [customersLoading, setCustomersLoading] = useState(false);
const [customerDetails, setCustomerDetails] = useState(null);
const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
const [transactions, setTransactions] = useState([]);
const [transactionsLoading, setTransactionsLoading] = useState(false);
const [transactionDetails, setTransactionDetails] = useState(null);
const [depositLoading, setDepositLoading] = useState(false);
const [withdrawLoading, setWithdrawLoading] = useState(false);
const [cashBook, setCashBook] = useState([]);
const [cashBookLoading, setCashBookLoading] = useState(false);
const [transactionPage, setTransactionPage] = useState(1);
const [transactionPages, setTransactionPages] = useState(1);
const [transactionTotal, setTransactionTotal] = useState(0);
const [cashBookPage, setCashBookPage] = useState(1);
const [cashBookPages, setCashBookPages] = useState(1);
const [cashBookTotal, setCashBookTotal] = useState(0);
const [cashBookDetails, setCashBookDetails] = useState(null);
const [customerPage, setCustomerPage] = useState(1);
const [customerPages, setCustomerPages] = useState(1);
const [customerTotal, setCustomerTotal] = useState(0);
const [admins, setAdmins] = useState([]);
const [adminDetails, setAdminDetails] =  useState(null);
const [adminsLoading, setAdminsLoading] = useState(false);
const [adminPage, setAdminPage] = useState(1);
const [adminPages, setAdminPages] = useState(1);
const [adminTotal, setAdminTotal] = useState(0);
const [cashiers, setCashiers] = useState([]);
const [cashierDetails, setCashierDetails] = useState(null);
const [cashiersLoading, setCashiersLoading] = useState(false);
const [cashierPage, setCashierPage] = useState(1);
const [cashierPages, setCashierPages] = useState(1);
const [cashierTotal, setCashierTotal] = useState(0);
const [activityLogs, setActivityLogs] = useState([]);
const [activityDetails, setActivityDetails] = useState(null);
const [activityLogsLoading, setActivityLogsLoading] = useState(false);
const [activityPage, setActivityPage] = useState(1);
const [activityPages, setActivityPages] = useState(1);
const [activityTotal, setActivityTotal] = useState(0);

const login = async (email, password) => {

  try {

    setLoginLoading(true);

    const response = await loginAdmin({
      email,
      password,
    });

    localStorage.setItem(
      "adminToken",
      response.token
    );

    localStorage.setItem(
      "adminUser",
      JSON.stringify(response.user)
    );

    setToken(response.token);

    setAdmin(response.user);


    return {
      success: true,
    };

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Login Failed"
    );

    return {
      success: false,
    };

  } finally {

    setLoginLoading(false);

  }

};
  const loadAdmin = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      const response =
        await getCurrentAdmin();
      setAdmin(response.user);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.user)
      );
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setToken("");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAdmin();
  }, []);

const logout = async () => {
  try {

    const response = await logoutAdmin();

    toast.success(response.message);

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Logout Failed"
    );

  } finally {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setToken("");
    setAdmin(null);

  }
};
const loadDashboard = async () => {

  try {

    setDashboardLoading(true);

    const response = await getDashboard();

    setDashboard(response);

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Unable to load dashboard"

    );

  } finally {

    setDashboardLoading(false);

  }

};
const loadCustomers = async (query = "") => {

  try {

    setCustomersLoading(true);

const response = await getCustomers(query);


setCustomers(response.customers);

setCustomerPage(response.page);

setCustomerPages(response.pages);

setCustomerTotal(response.total);
  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to load customers"
    );

  } finally {

    setCustomersLoading(false);

  }

};
const loadCustomerDetails = async (customerId) => {

  try {

    setCustomerDetailsLoading(true);

    const response =
      await getCustomerDetails(customerId);

    setCustomerDetails(response.customer);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to load customer details"
    );

  } finally {

    setCustomerDetailsLoading(false);

  }

};
const loadTransactions = async (query = "") => {
  try {
    setTransactionsLoading(true);

    const response = await getTransactions(query);

    setTransactions(response.transactions);

setTransactionPage(response.page);

setTransactionPages(response.pages);

setTransactionTotal(response.total);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to load transactions"
    );

  } finally {

    setTransactionsLoading(false);

  }
};
const loadTransactionDetails = async (id) => {

  try {

    const response =
      await getTransactionDetails(id);

    setTransactionDetails(response.transaction);

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to load transaction"
    );

  }

};
const verifyAccount = async (accountId) => {

  try {

    const response =
      await verifyAccountService(accountId);

    return response;

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to verify account"
    );

    return null;

  }

};
const cashDeposit = async (data) => {

  try {

    setDepositLoading(true);

    const response =
      await executeCashDeposit(data);

    toast.success(response.message);

    return {
      success: true,
      transaction: response.transaction,
    };

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Cash Deposit Failed"
    );

    return {
      success: false,
    };

  } finally {

    setDepositLoading(false);

  }

};
const cashWithdraw = async (data) => {

  try {

    setWithdrawLoading(true);

    const response =
      await executeCashWithdraw(data);

    toast.success(response.message);

    return {

      success:true,

      transaction:response.transaction,

    };

  } catch(error){

    toast.error(

      error.response?.data?.message ||

      "Cash Withdraw Failed"

    );

    return {

      success:false,

    };

  } finally{

    setWithdrawLoading(false);

  }

}
const loadCashBook = async (query = "") => {

  try {

    setCashBookLoading(true);

    const response =
      await getCashBook(query);

setCashBook(response.cashBook);

setCashBookPage(response.page);

setCashBookPages(response.pages);

setCashBookTotal(response.total);

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Unable to load cash book"

    );

  } finally {

    setCashBookLoading(false);

  }

};
const loadCashBookDetails = async (id) => {

  try {

    const response =
      await getCashBookDetails(id);

    setCashBookDetails(response.cashBook);

  } catch (error) {
      console.log(error);

    toast.error(

      error.response?.data?.message ||

      "Unable to load cash book details"

    );

  }

};
const loadAdmins = async (query = "") => {

  try {

    setAdminsLoading(true);

    const response = await getAdmins(query);

    setAdmins(response.admins);

    setAdminPage(response.page);

    setAdminPages(response.pages);

    setAdminTotal(response.total);

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Unable to load admins"

    );

  } finally {

    setAdminsLoading(false);

  }

};
const loadAdminDetails = async (
  adminId
) => {

  try {

    setAdminsLoading(true);

    const response =
      await getAdminDetails(adminId);

    setAdminDetails(response.admin);

  } catch (error) {

    toast.error(

      error.response?.data?.message ||

      "Unable to load admin"

    );

  } finally {

    setAdminsLoading(false);

  }

};
const createNewAdmin = async (data) => {
  try {

    const response = await createAdmin(data);

    toast.success(response.message);

    return response;

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Unable to create admin"
    );

    throw error;
  }
};
const updateAdminData = async (adminId, data) => {

  try {

    const response = await updateAdmin(adminId, data);

    toast.success(response.message);

    return response;

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to update admin"
    );

    throw error;

  }

};
const changeAdminStatus = async (adminId, status) => {
  try {

    const response = await updateAdminStatus(
      adminId,
      status
    );

    toast.success(response.message);

    return response;

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to update status"
    );

    throw error;

  }
};
const loadCashiers = async (query = "") => {
  try {
    setCashiersLoading(true);

    const response = await getCashiers(query);

    setCashiers(response.cashiers);
    setCashierPage(response.page);
    setCashierPages(response.pages);
    setCashierTotal(response.total);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to fetch cashiers"
    );
  } finally {
    setCashiersLoading(false);
  }
};
const loadCashierDetails = async (cashierId) => {
  try {
    setCashiersLoading(true);
    const response =
      await getCashierDetails(cashierId);
    setCashierDetails(response.cashier);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to fetch cashier"
    );
  } finally {
    setCashiersLoading(false);
  }
};
const createNewCashier = async (formData) => {
  try {
    const response =
      await createCashier(formData);
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to create cashier"
    );
    throw error;
  }
};
const updateCashierData = async (cashierId, formData) => {
  try {
    const response =
      await updateCashier(
        cashierId,
        formData
      );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to update cashier"
    );
    throw error;
  }
};
const changeCashierStatus = async (cashierId, status) => {
  try {
    const response =
      await updateCashierStatus(
        cashierId,
        status
      );
    toast.success(response.message);
    return response;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to update cashier status"
    );
    throw error;
  }
};
async function loadActivityLogs(query = "") {
  try {
    setActivityLogsLoading(true);

    const response = await getActivityLogs(query);

    setActivityLogs(response.logs);
    setActivityPage(response.page);
    setActivityPages(response.pages);
    setActivityTotal(response.total);

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Unable to load activity logs"
    );
  } finally {
    setActivityLogsLoading(false);
  }
}
async function loadActivityDetails(activityId) {
  try {
    setActivityLogsLoading(true);

    const response = await getActivityDetails(activityId);

    setActivityDetails(response.activity);

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Unable to load activity details"
    );
  } finally {
    setActivityLogsLoading(false);
  }
}
  return (

<AdminContext.Provider
  value={{
    token,
    admin,
    loading,
    setLoading,
    loginLoading,
    dashboard,
    dashboardLoading,
    customers,
    customersLoading,
    customerDetailsLoading,
    customerDetails,
    transactions,
    transactionsLoading,
    transactionDetails,
    depositLoading,
    withdrawLoading,   
    cashBook,
    cashBookLoading,
    transactionPage,
    transactionPages,
    transactionTotal,
    cashBookPage, 
    cashBookPages,
    cashBookTotal,
    cashBookDetails,
    customerPage,
    customerPages,
    customerTotal,
    admins,
    adminDetails,
    adminsLoading,
    adminPage,
    adminPages,
    adminTotal,
    cashiers,
    cashierDetails,
    cashiersLoading,
    cashierPage,
    cashierPages,
    cashierTotal,
    activityLogs,
    activityDetails,
    activityLogsLoading,
    activityPage,
    activityPages,
    activityTotal,

    
    login,
    logout,
    loadAdmin,
    loadDashboard,
    loadCustomers,
    loadCustomerDetails,
    loadTransactions,
    loadTransactionDetails,
    verifyAccount,
    cashDeposit,
    cashWithdraw,
    loadCashBook,
    loadCashBookDetails,
    loadAdmins,
    loadAdminDetails,
    createNewAdmin,
    updateAdminData,
    changeAdminStatus,
    loadCashiers,
    loadCashierDetails,
    createNewCashier,
    updateCashierData,
    changeCashierStatus,
    loadActivityLogs,
    loadActivityDetails,


  }}
>

      {children}

    </AdminContext.Provider>

  );

};
export const useAppContext = () => useContext(AdminContext);
export default AdminProvider;