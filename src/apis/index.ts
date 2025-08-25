import axios from "axios";

// Network quality detection
let networkQuality = 'good';
let lastRequestTime = Date.now();

// Adaptive timeout - giảm thời gian chờ
const getAdaptiveTimeout = () => {
  switch (networkQuality) {
    case 'slow': return 20000;
    case 'medium': return 15000;
    default: return 10000;
  }
};

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: false,
  validateStatus: (status) => status < 500,
});

// Response interceptor với adaptive retry
instance.interceptors.response.use(
  (response) => {
    // Update network quality
    const responseTime = Date.now() - lastRequestTime;
    if (responseTime > 10000) networkQuality = 'slow';
    else if (responseTime > 5000) networkQuality = 'medium';
    else networkQuality = 'good';
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Timeout handling với retry
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn(`API Timeout: ${config?.url} (Network: ${networkQuality})`);
      
      if (!config._retryCount) config._retryCount = 0;
      
      if (config._retryCount < 2) {
        config._retryCount++;
        config.timeout = getAdaptiveTimeout() + (config._retryCount * 5000);
        
        console.log(`Retrying (${config._retryCount}/2) with timeout: ${config.timeout}ms`);
        await new Promise(resolve => setTimeout(resolve, config._retryCount * 1000));
        return instance(config);
      }
    }
    
    // Network error retry
    if (!error.response && navigator.onLine) {
      if (!config._retryCount) config._retryCount = 0;
      
      if (config._retryCount < 1) {
        config._retryCount++;
        config.timeout = getAdaptiveTimeout();
        
        console.log(`Network retry (${config._retryCount}/1)`);
        await new Promise(resolve => setTimeout(resolve, config._retryCount * 2000));
        return instance(config);
      }
    }
    
    console.error("API Error:", {
      status: error.response?.status,
      url: config?.url,
      online: navigator.onLine,
      networkQuality
    });
    
    return Promise.reject(error);
  }
);

// Request interceptor với adaptive timeout
instance.interceptors.request.use(
  (config) => {
    lastRequestTime = Date.now();
    
    // Set adaptive timeout
    if (!config.timeout || config.timeout === 10000) {
      config.timeout = getAdaptiveTimeout();
    }
    
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default instance;
