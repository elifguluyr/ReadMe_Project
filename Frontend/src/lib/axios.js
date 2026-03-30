import axios from 'axios';

const ortamLinkimiz = import.meta.env.MODE === 'production'
  ? 'https://readme-api-m7pb.onrender.com/api' // Canlıdayken Render'a git
  : '/api'; // Kendi bilgisayarındayken vite proxy'sini kullan

const api = axios.create({
  baseURL: ortamLinkimiz,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
