import instance from "../apis";

const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return data;
};

export const orderService = {
  // Tạo đơn hàng từ giỏ hàng
  checkout: async () => {
    try {
      const response = await instance.post("/orders/checkout");
      return parseResponse(response);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user
  getMyOrders: async () => {
    try {
      const response = await instance.get("/orders");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { data: [] };
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetail: async (orderId: number) => {
    try {
      const response = await instance.get(`/orders/${orderId}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  },

  // Hủy đơn hàng (chức năng này cần thêm vào API)
  cancelOrder: async (orderId: number) => {
    try {
      const response = await instance.put(`/orders/${orderId}/cancel`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  }
};