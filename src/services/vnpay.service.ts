import { axiosInstance } from '../utils/axios.util';

export interface CreatePaymentRequest {
  order_id: number;
  amount: number;
  order_desc?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  payment_url: string;
  txn_ref: string;
}

export interface PaymentReturnResponse {
  success: boolean;
  message: string;
  order_id?: number;
  amount?: number;
  transaction_id?: string;
  response_code?: string;
}

export const vnpayService = {
  // 🧩 1. Tạo URL thanh toán
  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    try {
      const response = await axiosInstance.post('/vnpay/create-payment', data);
      return response.data;
    } catch (error: any) {
      console.error('VNPay create payment error:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo thanh toán VNPay');
    }
  },

  // 🧩 3. Xử lý kết quả trả về
  handleReturn: async (params: URLSearchParams): Promise<PaymentReturnResponse> => {
    try {
      const queryString = params.toString();
      const response = await axiosInstance.get(`/vnpay/return?${queryString}`);
      return response.data;
    } catch (error: any) {
      console.error('VNPay handle return error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
      };
    }
  }
};