import { axiosInstance } from '../utils/axios.util';

export interface VnpayUrlRequest {
  orderId: number;
  amount: number;
}

export interface VnpayCallbackRequest {
  [key: string]: string;
}

export const paymentService = {
  createVnpayUrl: async (data: VnpayUrlRequest) => {
    const response = await axiosInstance.post('/payment/create-vnpay-url', data);
    return response.data;
  },

  vnpayReturn: async (params: VnpayCallbackRequest) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/payment/vnpay-return?${queryString}`);
    return response.data;
  },

  vnpayCallback: async (params: VnpayCallbackRequest) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/payment/vnpay-return?${queryString}`);
    return response.data;
  }
};