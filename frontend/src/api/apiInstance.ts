import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://10.0.2.2:3000', // Android emulator
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  async config => {
    return config;
  },
  error => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Có lỗi xảy ra khi gọi API';
    return Promise.reject(new Error(message));
  },
);

export default apiInstance;
