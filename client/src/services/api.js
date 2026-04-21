import axios from 'axios';

export const AUTH_SESSION_INVALID_EVENT = 'voltkart:auth-session-invalid';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const authMessage = message.toLowerCase();
    const isSessionInvalid =
      status === 401 &&
      (authMessage.includes('token') ||
        authMessage.includes('not authorized') ||
        authMessage.includes('user no longer exists'));

    if (isSessionInvalid) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent(AUTH_SESSION_INVALID_EVENT, {
            detail: { message }
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export const imageFallback =
  'https://placehold.co/900x700/f8fafc/0f172a?text=VoltKart+Electricals';

export default api;
