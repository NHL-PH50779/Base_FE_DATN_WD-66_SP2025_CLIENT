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
  // Create order (checkout) - POST /api/orders/checkout
  createOrder: async (orderData: any) => {
    const response = await axios.post(`${API_BASE_URL}/orders/checkout`, orderData);
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
  }
};

export const reviewService = {
  // Submit product review
  submitReview: async (reviewData: any) => {
    const formData = new FormData();
    formData.append('product_id', reviewData.product_id);
    formData.append('order_id', reviewData.order_id);
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    
    // Add images
    reviewData.images?.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });

    const response = await axios.post(`${API_BASE_URL}/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};