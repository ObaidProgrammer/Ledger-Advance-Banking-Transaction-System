import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("adminToken");

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const isLoginRequest =
      error.config?.url?.includes("/admin/login");

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isRedirecting
    ) {
      isRedirecting = true;

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }

);

export default api;