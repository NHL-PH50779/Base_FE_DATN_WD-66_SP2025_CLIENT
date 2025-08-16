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
  timeout: 10000, // Giảm xuống 10s để phát hiện timeout nhanh hơn
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Thêm retry config
  retry: 3,
  retryDelay: 1000,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const config = error.config;
    
    // Xử lý timeout và lỗi mạng
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn(`API Timeout: ${config?.url}`);
      
      // Retry logic cho timeout
      if (config && !config._retry && config.retry > 0) {
        config._retry = true;
        config.retry -= 1;
        
        // Đợi trước khi retry
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
        return axiosInstance(config);
      }
    }
    
    // Xử lý lỗi mạng (không có response)
    if (!error.response) {
      console.error("Network Error:", {
        url: config?.url,
        method: config?.method,
        online: navigator.onLine
      });
      
      // Retry cho lỗi mạng
      if (config && !config._retry && config.retry > 0 && navigator.onLine) {
        config._retry = true;
        config.retry -= 1;
        
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 2000));
        return axiosInstance(config);
      }
    }
    
    // Xử lý lỗi server
    if (error.response?.status >= 500) {
      console.error("Server Error:", error.response?.data || error.message);
    }
    
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

export default axiosInstance;
export { axiosInstance };
