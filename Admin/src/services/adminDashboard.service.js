import api from "../utils/axios";

export async function getDashboard() {
  const response = await api.get("/admin/dashboard");
  return response.data;
}
export const getAdmins = async (query = "") => {
  const response = await api.get(`/admin/admins${query}`);
  return response.data;
};

export const getAdminDetails = async (adminId) => {
  const response = await api.get(`/admin/admins/${adminId}`);
  return response.data;
};
 
export const createAdmin = async (data) => {
  const response = await api.post("/admin/admins", data);
  return response.data;
};

export const updateAdmin = async (adminId, data) => {
  const response = await api.patch(`/admin/admins/${adminId}`,data
  );
  return response.data;
};

export const updateAdminStatus = async (adminId, status) => {
  const response = await api.patch(`/admin/admins/${adminId}/status`,{ status }
  );
  return response.data;
};