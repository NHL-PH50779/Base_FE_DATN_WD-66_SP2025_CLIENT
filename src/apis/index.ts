import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 30000, // Tăng lên 30s
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor để xử lý Git conflicts và timeout
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('API Timeout:', error.config?.url);
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Interceptor để thêm token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default instance;
