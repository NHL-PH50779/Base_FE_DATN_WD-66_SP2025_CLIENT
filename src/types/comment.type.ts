// Bình luận và đánh giá sản phẩm
export type Comment = {
  id: number;
  user_id: number; // ID người dùng
  product_id: number; // ID sản phẩm
  content: string; // Nội dung bình luận
  rating: number; // Đánh giá sao (1-5)
  status: 'pending' | 'approved' | 'rejected'; // Trạng thái duyệt
  created_at: string; // Ngày tạo
  updated_at: string; // Ngày cập nhật
  user: {
    id: number;
    name: string;
  }; // Thông tin người dùng
  product: {
    id: number;
    name: string;
  }; // Thông tin sản phẩm
};

// Tham số tạo bình luận mới
export type CommentFormData = {
  product_id: number; // ID sản phẩm
  content: string; // Nội dung bình luận
  rating: number; // Đánh giá sao
};

// Thống kê bình luận (cho admin)
export type CommentStats = {
  total: number; // Tổng số bình luận
  pending: number; // Chờ duyệt
  approved: number; // Đã duyệt
  rejected: number; // Từ chối
  reviews: number; // Có đánh giá
  comments: number; // Chỉ bình luận
};