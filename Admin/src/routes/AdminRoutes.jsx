import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import NotFound from "../pages/NotFound";

import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import CustomerDetails from "../pages/CustomerDetails";
import Transactions from "../pages/Transactions";
import TransactionDetails from "../pages/TransactionDetails";
import CashDeposit from "../pages/CashDeposit";
import CashWithdraw from "../pages/CashWithdraw";
import CashBook from "../pages/CashBook";
import Login from "../pages/Login";
import Admins from "../pages/Admins";
import Cashiers from "../pages/Cashiers";
import ActivityLogs from "../pages/ActivityLogs";
import TransactionReceipt from "../pages/TransactionReceipt";
import CashBookDetails from "../pages/CashBookDetails";
import CreateAdmin from "../pages/CreateAdmin";
import AdminDetails from "../pages/AdminDetails";
import EditAdmin from "../pages/EditAdmin";
import CreateCashier from "../pages/CreateCashier";
import CashierDetails from "../pages/CashierDetails";
import EditCashier from "../pages/EditCashier";
import ActivityDetails from "../pages/ActivityDetails";

const AppRoutes = () => {
  return (
    <Routes>
<Route path="*" element={<NotFound />} />

{/* Public Routes */}
<Route element={<PublicRoute />}>
  <Route path="/login" element={<Login />} />
</Route>
      

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route element={<AdminLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:customerId" element={<CustomerDetails />} />
          <Route path="/transactions" element={<Transactions />}/>
          <Route path="/transactions/:transactionId" element={<TransactionDetails />}/>
          <Route path="/cash-deposit" element={<CashDeposit />} />
          <Route path="/cash-deposit/receipt/:transactionId" element={<TransactionReceipt />}/> 
          <Route path="/cash-withdraw" element={<CashWithdraw />}/>
          <Route path="/cash-withdraw/receipt/:transactionId" element={<TransactionReceipt />}/>
          <Route path="/cash-book" element={<CashBook />} />
          <Route path="/cash-book/:cashBookId" element={<CashBookDetails />} />
          <Route element={<RoleProtectedRoute roles={["SUPER_ADMIN"]} />}>
          <Route path="/admins" element={<Admins />} />
          <Route path="/admins/:adminId" element={<AdminDetails />}/>
          <Route path="/admins/create" element={<CreateAdmin />}/>
          <Route path="/admins/edit/:adminId" element={<EditAdmin />}/>
          </Route>
          <Route element={<RoleProtectedRoute roles={["SUPER_ADMIN", "ADMIN"]} />}>
          <Route path="/cashiers" element={<Cashiers />} />
          <Route path="/cashiers/create" element={<CreateCashier />}/>
          <Route path="/cashiers/:cashierId" element={<CashierDetails />}/>
          <Route path="/cashiers/edit/:cashierId" element={<EditCashier />}/>          
          <Route path="/activity-logs" element={<ActivityLogs />} />  
          <Route path="/activity-logs/:activityId" element={<ActivityDetails />}/>
          </Route>

        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;