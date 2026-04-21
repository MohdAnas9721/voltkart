import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api, { AUTH_SESSION_INVALID_EVENT } from '../services/api';

const AuthContext = createContext(null);
let sessionInvalidNoticeShown = false;

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const persist = (payload) => {
    sessionInvalidNoticeShown = false;
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      persist(data);
      toast.success('Logged in successfully');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      persist(data);
      toast.success('Account created');
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    toast.success('Logged out');
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    toast.success('Profile updated');
  };

  useEffect(() => {
    const handleSessionInvalid = () => {
      clearSession();

      if (!sessionInvalidNoticeShown) {
        sessionInvalidNoticeShown = true;
        toast.error('Session expired. Please login again.');
        window.setTimeout(() => {
          sessionInvalidNoticeShown = false;
        }, 1500);
      }
    };

    window.addEventListener(AUTH_SESSION_INVALID_EVENT, handleSessionInvalid);

    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      setUser(null);
    } else {
      api.get('/auth/me')
        .then(({ data }) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        })
        .catch(() => clearSession());
    }

    return () => window.removeEventListener(AUTH_SESSION_INVALID_EVENT, handleSessionInvalid);
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', loading, login, register, logout, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
