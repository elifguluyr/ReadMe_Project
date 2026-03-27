import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Component mount olduğunda token geçerliliğini kontrol et vb.
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Helper function to decode JWT robustly
  const decodeToken = (tokenStr) => {
    try {
      const decoded = jwtDecode(tokenStr);
      return { id: decoded._id, name: decoded.name, email: decoded.email };
    } catch (e) {
      return null;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      // Backend returns { token: '...' }
      const userObj = decodeToken(data.token);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      setToken(data.token);
      setUser(userObj);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, bio, profileImage) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password, bio, profileImage);
      const userObj = decodeToken(data.token);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      setToken(data.token);
      setUser(userObj);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
