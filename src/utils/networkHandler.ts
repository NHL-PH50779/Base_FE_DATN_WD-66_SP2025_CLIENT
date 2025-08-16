// Utility để xử lý lỗi mạng và timeout
export const networkHandler = {
  // Kiểm tra trạng thái mạng
  isOnline: () => navigator.onLine,
  
  // Retry logic cho API calls
  retryRequest: async (fn: () => Promise<any>, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        const isLastAttempt = i === maxRetries - 1;
        const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR';
        
        if (isLastAttempt || !isNetworkError) {
          throw error;
        }
        
        // Tăng delay theo cấp số nhân
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  },
  
  // Hiển thị thông báo lỗi mạng
  showNetworkError: (error: any) => {
    if (error.code === 'ECONNABORTED') {
      return 'Kết nối timeout. Vui lòng kiểm tra mạng và thử lại.';
    }
    if (!navigator.onLine) {
      return 'Không có kết nối internet. Vui lòng kiểm tra mạng.';
    }
    if (!error.response) {
      return 'Không thể kết nối đến server. Vui lòng thử lại sau.';
    }
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

export default networkHandler;