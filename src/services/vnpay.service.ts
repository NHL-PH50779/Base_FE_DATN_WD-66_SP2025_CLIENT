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
    const response = await axiosInstance.post('/vnpay/create-payment', data);
    return response.data;
  },

  // 🧩 3. Xử lý kết quả trả về
  handleReturn: async (params: URLSearchParams): Promise<PaymentReturnResponse> => {
    const queryString = params.toString();
    const response = await axiosInstance.get(`/vnpay/return?${queryString}`);
    return response.data;
  }
};