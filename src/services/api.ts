import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/api/auth/login", data),
  register: (data: { name: string; email: string; password: string }) => api.post("/api/auth/register", data),
  getProfile: () => api.get("/api/auth/profile"),
};

export const menuAPI = {
  getAll: () => api.get("/api/menu"),
  create: (data: FormData | object) => api.post("/api/menu", data),
  update: (id: string, data: FormData | object) => api.put(`/api/menu/${id}`, data),
  delete: (id: string) => api.delete(`/api/menu/${id}`),
};

export const orderAPI = {
  create: (data: object) => api.post("/api/orders", data),
  getMyOrders: () => api.get("/api/orders/my"),
  getAll: (page = 1) => api.get(`/api/orders?page=${page}`),
  updateStatus: (id: string, status: string) => api.put(`/api/orders/${id}/status`, { status }),
};

export default api;
