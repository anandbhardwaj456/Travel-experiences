import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeJwtPayload = (token) => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      // Convert base64url to base64
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Pad string to proper length (multiple of 4)
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const payloadJson = atob(base64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload?.username && payload?.id) {
        setUser({ username: payload.username, id: payload.id });
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      localStorage.setItem('token', data.token);
      const payload = decodeJwtPayload(data.token);
      if (payload?.username && payload?.id) {
        setUser({ username: payload.username, id: payload.id });
      } else {
        localStorage.removeItem('token');
        return { success: false, error: 'Invalid token received' };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (username, password) => {
    try {
      await authAPI.register(username, password);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

