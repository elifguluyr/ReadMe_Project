import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend'in çalıştığı ana adres (Canlı Sunucu)
const API_URL = 'https://readme-api-m7pb.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Token okunurken hata oluştu:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = base64.replace(/=+$/, '');
    let output = '';
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
    return JSON.parse(decodeURIComponent(escape(output)));
  } catch (error) {
    console.error('Token çözümlenemedi:', error);
    return null;
  }
};

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password });
    return response.data;
  }
};

export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/profile/update', profileData);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await api.delete('/delete');
    return response.data;
  },
  toggleFollow: async (userId) => {
    const response = await api.post(`/follow/${userId}`);
    return response.data;
  }
};

export const bookAPI = {
  search: async (query) => {
    const response = await api.get(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default api;