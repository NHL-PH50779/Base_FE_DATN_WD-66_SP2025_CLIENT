import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Set up axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface VNPayPaymentRequest {
  order_id: number;
  amount: number;
  order_info?: string;
  bank_code?: string;
}

export interface VNPayResponse {
  success: boolean;
  payment_url?: string;
  message?: string;
  txn_ref?: string;
}

export const vnpayService = {
  // Tạo thanh toán VNPay
  createPayment: async (paymentData: VNPayPaymentRequest): Promise<VNPayResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/vnpay`, {
        amount: paymentData.amount,
        order_desc: paymentData.order_info || `Thanh toán đơn hàng #${paymentData.order_id}`,
        order_id: paymentData.order_id,
        bank_code: paymentData.bank_code
      });

      if (response.data.payment_url || response.data.paymentUrl) {
        return {
          success: true,
          payment_url: response.data.payment_url || response.data.paymentUrl,
          txn_ref: response.data.txn_ref
        };
      } else {
        return {
          success: false,
          message: 'Không thể tạo URL thanh toán'
        };
      }
    } catch (error: any) {
      console.error('VNPay create payment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi tạo thanh toán VNPay'
      };
    }
  },

  // Chuyển hướng đến VNPay
  redirectToVNPay: (paymentUrl: string) => {
    window.location.href = paymentUrl;
  },

  // Xử lý kết quả trả về từ VNPay
  processReturn: async (params: URLSearchParams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vnpay/process-return`, 
        Object.fromEntries(params.entries())
      );
      return response.data;
    } catch (error: any) {
      console.error('VNPay process return error:', error);
      throw error;
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (orderId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vnpay/check-payment/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('VNPay check payment status error:', error);
      throw error;
    }
  }
};