import instance from "../apis";

export const walletService = {
  // Lấy thông tin ví
  getWallet: async () => {
    try {
      const response = await instance.get('/wallet');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  // Lấy lịch sử giao dịch
  getTransactions: async () => {
    try {
      const response = await instance.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Tạo yêu cầu rút tiền
  createWithdrawRequest: async (data: {
    amount: number;
    bank_name: string;
    account_number: string;
    account_name: string;
  }) => {
    try {
      const response = await instance.post('/withdraw-requests', data);
      return response.data;
    } catch (error) {
      console.error('Error creating withdraw request:', error);
      throw error;
    }
  },

  // Lấy danh sách yêu cầu rút tiền
  getWithdrawRequests: async () => {
    try {
      const response = await instance.get('/withdraw-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching withdraw requests:', error);
      throw error;
    }
  },

  // Tạo yêu cầu hoàn hàng
  createReturnRequest: async (data: {
    order_id: number;
    reason: string;
  }) => {
    try {
      const response = await instance.post('/return-requests', data);
      return response.data;
    } catch (error) {
      console.error('Error creating return request:', error);
      throw error;
    }
  },

  // Lấy danh sách yêu cầu hoàn hàng
  getReturnRequests: async () => {
    try {
      const response = await instance.get('/return-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching return requests:', error);
      throw error;
    }
  }
};