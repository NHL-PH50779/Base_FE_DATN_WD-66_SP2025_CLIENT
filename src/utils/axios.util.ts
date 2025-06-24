import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_AUTH_API_URL } from "./env";
// import { clearUserInfoAndToken, getCommonStateFromLocalStorage } from "./utils";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    
    // Nếu lỗi 401, xóa token và redirect về login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
