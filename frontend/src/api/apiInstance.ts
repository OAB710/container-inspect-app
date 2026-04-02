import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../stores/authStore';

const TOKEN_KEY = 'auth_token';

export class ApiError extends Error {
  status?: number;
  code?: string;
  payload?: unknown;

  constructor(message: string, status?: number, code?: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

const apiInstance = axios.create({
  // baseURL: 'https://container-inspect-app-2.onrender.com', // Android emulator
  baseURL: 'http://10.0.2.2:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  async config => {
    const token =
      useAuthStore.getState().token || (await AsyncStorage.getItem(TOKEN_KEY));
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  response => response.data,
  async error => {
    if (error?.response?.status === 401) {
      const {clearAuthState} = useAuthStore.getState();
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      clearAuthState();
    }

    const responseData = error?.response?.data;
    const normalizedMessage = Array.isArray(responseData?.message)
      ? responseData.message.join(', ')
      : responseData?.message;
    const message = normalizedMessage || error?.message || 'Có lỗi xảy ra khi gọi API';
    const status = error?.response?.status;
    const code = responseData?.code;

    return Promise.reject(new ApiError(message, status, code, responseData));
  },
);

export default apiInstance;
