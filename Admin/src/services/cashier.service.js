import api from "../utils/axios";


export const getCashiers = async (query = "") => {
  const response = await api.get(`/admin/cashiers${query}`);
  return response.data;
};

export const getCashierDetails = async (cashierId) => {
  const response = await api.get(`/admin/cashiers/${cashierId}`);
  return response.data;
};

export const createCashier = async (data) => {
  const response = await api.post("/admin/cashiers", data);
  return response.data;
};

export const updateCashier = async (cashierId, data) => {
  const response = await api.patch(
    `/admin/cashiers/${cashierId}`,
    data
  );
  return response.data;
};

export const updateCashierStatus = async (
  cashierId,
  status
) => {
  const response = await api.patch(
    `/admin/cashiers/${cashierId}/status`,
    { status }
  );

  return response.data;
};