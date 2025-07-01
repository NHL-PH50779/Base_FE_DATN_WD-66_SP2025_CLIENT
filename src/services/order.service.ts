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

export const orderService = {
  // Create order - POST /api/orders
  createOrder: async (orderData: any) => {
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    return response.data;
  },

  // Checkout - POST /api/orders/checkout
  checkout: async () => {
    const response = await axios.post(`${API_BASE_URL}/orders/checkout`);
    return response.data;
  },

  // Get user's orders - GET /api/my-orders
  getMyOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/my-orders`);
    return response.data;
  },

  // Get order detail - GET /api/orders/{id}
  getOrderDetail: async (orderId: number) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  },



  // Get order by ID - GET /api/orders/{id}
  getOrderById: async (orderId: number) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
    return response.data;
  },

  // Cancel order - PUT /api/orders/{id}/cancel
  cancelOrder: async (orderId: number, reason: string) => {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Confirm received order - Sử dụng API mới
  confirmReceived: async (orderId: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  },

  // Yêu cầu hoàn hàng
  requestRefund: async (orderId: number, reason: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders/${orderId}/refund-request`, {
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  },

  // Update order status - PUT /api/orders/{id}/status
  updateOrderStatus: async (orderId: number, statusId: number) => {
    const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status_id: statusId });
    return response.data;
  },

  // Admin: Tự động hoàn thành đơn hàng
  autoCompleteOrders: async () => {
    const response = await axios.post(`${API_BASE_URL}/admin/orders/auto-complete`);
    return response.data;
  },

  // Admin: Xử lý yêu cầu hoàn hàng
  processRefund: async (orderId: number, approve: boolean, adminNote?: string) => {
    const response = await axios.put(`${API_BASE_URL}/admin/orders/${orderId}/process-refund`, {
      approve: approve,
      admin_note: adminNote
    });
    return response.data;
  }
};

export const reviewService = {
  // Submit product review - using localStorage until API is ready
  submitReview: async (reviewData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Get existing reviews from storage
        const allReviews = JSON.parse(localStorage.getItem('product_reviews') || '[]');
        
        // Create new review
        const newReview = {
          id: Date.now() + Math.random(),
          product_id: reviewData.product_id,
          user_id: user.id || 999,
          user_name: user.name || 'Khách hàng',
          content: reviewData.comment,
          rating: reviewData.rating,
          order_id: reviewData.order_id,
          status: "approved", // Auto approve reviews from orders
          created_at: new Date().toISOString(),
          images: reviewData.images || []
        };
        
        // Add to reviews storage
        const updatedReviews = [newReview, ...allReviews];
        localStorage.setItem('product_reviews', JSON.stringify(updatedReviews));
        
        resolve({
          success: true,
          message: 'Đánh giá đã được gửi thành công'
        });
      }, 1000);
    });
  },

  // Get reviews for a product
  getProductReviews: async (productId: number) => {
    const allComments = JSON.parse(localStorage.getItem('all_comments') || '[]');
    const productReviews = allComments.filter((c: any) => 
      c.product_id === productId && c.rating > 0 && c.status === 'approved'
    );
    return { data: productReviews };
  },

  // Check if user can review a product from an order
  canReviewProduct: async (orderId: number, productId: number) => {
    // For now, always allow review if user is logged in
    const user = localStorage.getItem('user');
    return { data: { can_review: !!user } };
  }
};