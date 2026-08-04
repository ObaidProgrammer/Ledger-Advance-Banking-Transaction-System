import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    console.error("VITE_BACKEND_URL is missing!");
  }

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  

  // =====================
  // AUTH HEADER
  // =====================
const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // Logout ke waqt header ko delete karne ka sahi tareeqa
      delete axios.defaults.headers.common["Authorization"];
    }
  };
// FETCH USER
const fetchUser = async () => {
  if (!localStorage.getItem("token")) return;
  try {
    const res = await axios.get(`${backendUrl}/auth/me`); // No manual headers needed!
    setUser(res.data.user);
  } catch (err) {
    if (err.response?.status === 401) logout();
  }
};

// FETCH ACCOUNTS
const fetchAccounts = async () => {
  if (!localStorage.getItem("token")) return;
  try {
    const res = await axios.get(`${backendUrl}/accounts`);
    setAccounts(res.data.accounts);
    return res.data.accounts;
  } catch (err) {
    return [];
  }
};

// FETCH DASHBOARD
const fetchDashboard = async () => {
  if (!localStorage.getItem("token")) return;
  try {
    const res = await axios.get(`${backendUrl}/dashboard`);
    setDashboard(res.data);
  } catch (err) {
    console.log(err);
  }
};

// LOGIN
const login = async (email, password) => {
  try {
    const res = await axios.post(`${backendUrl}/auth/login`, { email, password });
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Fresh data calls
    await fetchUser();
    const userAccounts = await fetchAccounts();
    await fetchDashboard();

    const hasAccount = userAccounts && userAccounts.length > 0;
    return { success: true, hasAccount };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Login failed",
    };
  }
};

// REGISTER
const register = async (name, email, password) => {
  try {
    const res = await axios.post(`${backendUrl}/auth/register`, { name, email, password });
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    await fetchUser();
    const userAccounts = await fetchAccounts();
    await fetchDashboard();

    const hasAccount = userAccounts && userAccounts.length > 0;
    return { success: true, hasAccount };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Registration failed",
    };
  }
};
  // =====================
  // LOGOUT
  // =====================
const logout = async () => {
  try {
    // 1. Pehle backend ko token bhejein taake wo isay blacklist kar sake
    // Chunke interceptor laga hua hai, header khud hi chala jayega
    await axios.post(`${backendUrl}/auth/logout`);
    console.log("Backend blacklist entry successful");
  } catch (err) {
    console.error("Backend logout notification failed:", err?.response?.data || err.message);
  } finally {
    // 2. Frontend cleanup (Yeh hamesha chalega chahe backend fail ho ya pass)
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setAccounts([]);
    setDashboard(null);
  }
};
// AppContextProvider ke andar state add karein:
const [buckets, setBuckets] = useState([]);

// FETCH BUCKETS
const fetchBuckets = async () => {
  if (!localStorage.getItem("token")) return;
  try {
    const res = await axios.get(`${backendUrl}/auth/buckets`);
    setBuckets(res.data.buckets);
  } catch (err) {
    console.error("Failed to fetch buckets", err);
  }
};

// ADD BUCKET
// AppContext.js ke andar:
const addBucket = async (description, amount) => {
  try {
    const res = await axios.post(`${backendUrl}/auth/buckets`, { description, amount });
    setBuckets(res.data.buckets);
    return { success: true };
  } catch (err) {
    // Backend se aane wala message yahan se return hoga
    return { 
      success: false, 
      message: err.response?.data?.message || "Something went wrong" 
    };
  }
};

// DELETE BUCKET
const deleteBucket = async (bucketId) => {
  try {
    const res = await axios.delete(`${backendUrl}/auth/buckets/${bucketId}`);
    setBuckets(res.data.buckets); // Update UI
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message };
  }
};

  // =====================
  // AUTO LOGIN
  // =====================
useEffect(() => {
    if (token) {
      setAuthHeader(token);
      fetchUser();
      fetchAccounts();
      fetchDashboard();
      fetchBuckets();
    }
  }, [token]);

  // =====================
// LOOKUP ACCOUNT USER
// =====================
const lookupAccount = async (accountId) => {
  try {
    const res = await axios.get(`${backendUrl}/accounts/lookup/${accountId}`);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Account not found",
    };
  }
};

// =====================
// EXECUTE TRANSFER
// =====================
const executeTransfer = async (toAccount, amount) => {
    try {
      const fromAccount = accounts[0]?._id; 
      if (!fromAccount) throw new Error("Your primary account not found");

      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const isSystemUser = user && (
        user.systemUser === true || 
        user.systemUser === "true" ||
        user.role === "systemUser" || 
        user.name?.toLowerCase().includes("system")
      );

      const endpoint = isSystemUser 
        ? `${backendUrl}/transactions/cash/deposit` 
        : `${backendUrl}/transactions`;

      const payload = isSystemUser
        ? { toAccount, amount: Number(amount), idempotencyKey }
        : { fromAccount, toAccount, amount: Number(amount), idempotencyKey };

      console.log(`Sending transfer to: ${endpoint}`, payload);

      const res = await axios.post(endpoint, payload);

      await fetchDashboard();
      await fetchAccounts();

      // data return karein taake receipt ban sake
      return { success: true, message: res.data.message, transaction: res.data.transaction };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Transfer failed",
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        token,
        user,
        accounts,
        dashboard,
        register,
        login,
        logout,
        lookupAccount,
        executeTransfer,
        buckets,
        addBucket,
        deleteBucket,
        fetchAccounts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;