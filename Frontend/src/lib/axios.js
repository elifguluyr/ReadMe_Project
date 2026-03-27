import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for intercepting outgoing requests and attaching the Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor for response errors (e.g., handling 401 Unauthorized globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // You can trigger a logout or token refresh logic here
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Alternatively, handled in AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;
