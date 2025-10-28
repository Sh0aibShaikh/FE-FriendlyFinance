import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, LocalStorageKeys } from '../constants';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
      localStorage.removeItem(LocalStorageKeys.USER_ID);
      localStorage.removeItem(LocalStorageKeys.USER_DATA);
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

