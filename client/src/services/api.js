import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 errors (unauthorized/forbidden) - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Experience APIs
export const experienceAPI = {
  getAll: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
};

// Booking APIs
export const bookingAPI = {
  create: async (bookingData) => {
    const response = await api.post('/experiences/bookings', bookingData);
    return response.data;
  },
  
  validatePromo: async (code) => {
    const response = await api.post('/promos/validate', { code });
    return response.data;
  },
};

export default api;

