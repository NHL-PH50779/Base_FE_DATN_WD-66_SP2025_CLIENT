import axios from 'axios';

// Setup axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Comment {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
  };
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
    thumbnail?: string;
  };
  order_id?: number;
}

class CommentService {
  // === COMMENTS (Bình luận thường - rating = 0) ===
  
  async getComments(productId: number): Promise<Comment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments?product_id=${productId}`);
      const allComments = response.data.data || response.data || [];
      // Lọc chỉ lấy bình luận (rating = 0) và đã được duyệt
      return allComments.filter((c: Comment) => c.rating === 0 && c.status === 'approved');
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async addComment(productId: number, content: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để bình luận');
      }
      
      await axios.post(`${API_BASE_URL}/comments`, {
        product_id: productId,
        content: content.substring(0, 1000),
        rating: 0 // Bình luận thường
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // === REVIEWS (Đánh giá từ đơn hàng - rating > 0) ===
  
  async getReviews(productId: number): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments?product_id=${productId}`);
      const allComments = response.data.data || response.data || [];
      // Lọc chỉ lấy đánh giá (rating > 0) và đã được duyệt
      return allComments.filter((c: Comment) => c.rating > 0 && c.status === 'approved');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  async addReview(reviewData: {
    product_id: number;
    content: string;
    rating: number;
  }): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để đánh giá');
      }
      
      await axios.post(`${API_BASE_URL}/comments`, {
        product_id: reviewData.product_id,
        content: reviewData.content.substring(0, 1000),
        rating: reviewData.rating // Đánh giá có rating > 0
      });
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Get rating stats for product
  async getRatingStats(productId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}/rating-stats`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching rating stats:', error);
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentage_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }

  // === ADMIN FUNCTIONS ===
  
  async getAllComments(): Promise<Comment[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/comments`);
      const allComments = response.data.data || response.data || [];
      return allComments;
    } catch (error) {
      console.error('Error fetching all comments:', error);
      return [];
    }
  }

  async getAllReviews(): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/comments`);
      const allComments = response.data.data || response.data || [];
      // Lọc chỉ lấy đánh giá (rating > 0)
      return allComments.filter((c: Comment) => c.rating > 0);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }
  }

  async updateCommentStatus(id: number, status: 'approved' | 'rejected'): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/admin/comments/${id}/status`, { status });
    } catch (error) {
      console.error('Error updating comment status:', error);
      throw error;
    }
  }

  async deleteComment(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/admin/comments/${id}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Get stats for admin
  async getCommentStats() {
    try {
      const comments = await this.getAllComments();
      const onlyComments = comments.filter(c => c.rating === 0);
      return {
        total: onlyComments.length,
        pending: onlyComments.filter(c => c.status === 'pending').length,
        approved: onlyComments.filter(c => c.status === 'approved').length,
        rejected: onlyComments.filter(c => c.status === 'rejected').length
      };
    } catch (error) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }

  async getReviewStats() {
    try {
      const reviews = await this.getAllReviews();
      return {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
        averageRating: reviews.length > 0 ? 
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'
      };
    } catch (error) {
      return { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: '0' };
    }
  }
}

export const commentService = new CommentService();