import axios from 'axios';

const API_URL = 'https://food-backend-ak09.onrender.com/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const menuAPI = {
  getAll: () => api.get('/menu'),
  getById: (id: string) => api.get(`/menu/${id}`),
  create: (data: any) => api.post('/menu', data),
  update: (id: string, data: any) => api.put(`/menu/${id}`, data),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  getMyOrders: () => api.get('/orders/myorders'),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
};
// Add this export
export const analyticsAPI = {
  getDaily: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/analytics/daily?${params.toString()}`);
  },
};
