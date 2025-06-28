import instance from '../apis';

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'fixed' | 'percent';
  value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  quantity: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface VoucherValidationResponse {
  message: string;
  data: {
    voucher: Voucher;
    discount_amount: number;
  };
}

export const voucherService = {
  // Validate voucher code
  validateVoucher: async (code: string, orderAmount: number): Promise<VoucherValidationResponse> => {
    const response = await instance.post('/vouchers/validate', {
      code,
      order_amount: orderAmount
    });
    return response.data;
  },

  // Get all vouchers (admin)
  getAllVouchers: async () => {
    const response = await instance.get('/vouchers');
    return response.data;
  },

  // Get voucher by ID
  getVoucherById: async (id: number) => {
    const response = await instance.get(`/vouchers/${id}`);
    return response.data;
  },

  // Create voucher (admin)
  createVoucher: async (voucherData: Partial<Voucher>) => {
    const response = await instance.post('/vouchers', voucherData);
    return response.data;
  },

  // Update voucher (admin)
  updateVoucher: async (id: number, voucherData: Partial<Voucher>) => {
    const response = await instance.put(`/vouchers/${id}`, voucherData);
    return response.data;
  },

  // Delete voucher (admin)
  deleteVoucher: async (id: number) => {
    const response = await instance.delete(`/vouchers/${id}`);
    return response.data;
  },

  // Get available vouchers for order amount
  getAvailableVouchers: async (orderAmount: number) => {
    const response = await instance.get(`/vouchers/available?order_amount=${orderAmount}`);
    return response.data;
  }
};