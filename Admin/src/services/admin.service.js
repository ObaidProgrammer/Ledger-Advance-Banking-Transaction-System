import api from "../utils/axios";

export async function loginAdmin(data) {
  const response = await api.post("/admin/login", data);
  return response.data;
}

export async function getCurrentAdmin() {
  const response = await api.get("/admin/me");
  return response.data;
}

export async function logoutAdmin() {
  const response = await api.post("/admin/logout");
  return response.data;
}

export async function getCustomers(query = "") {
  const response = await api.get(`/admin/customers${query}`);
  return response.data;
}

export async function getCustomerDetails(customerId) {
  const response = await api.get(`/admin/customers/${customerId}`);
  return response.data;
}

export async function getTransactions(query = "") {
  const response = await api.get(`/admin/transactions${query}`);
  
  return response.data;
}

export async function getTransactionDetails(transactionId) {
  const response = await api.get(`/admin/transactions/${transactionId}`);
  return response.data;
}

export async function executeCashDeposit(data) {
  const response = await api.post("/transactions/cash/deposit",data);
 return response.data;
}
export async function verifyAccount(accountId) {
  const response = await api.get(`/admin/accounts/verify/${accountId}`);
  return response.data;
}

export async function executeCashWithdraw(data) {
  const response = await api.post("/transactions/cash/withdraw", data);
  return response.data;
}

export async function getCashBook(query = "") {
  const response = await api.get(`/admin/cash-book${query}`);
  return response.data;

}

export async function getCashBookDetails(cashBookId) {
  const response = await api.get(`/admin/cash-book/${cashBookId}`);
 return response.data;

}

export async function getActivityLogs(query = "") {
  const response = await api.get(`/admin/activities${query}`);
  return response.data;
}

export async function getActivityDetails(activityId) {
  const response = await api.get(`/admin/activities/${activityId}`);
  return response.data;
}