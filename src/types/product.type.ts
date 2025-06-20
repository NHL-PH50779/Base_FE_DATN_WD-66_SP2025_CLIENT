export type Brand = {
  id: number;
  name: string;
};

// Định nghĩa kiểu cho một Category (Danh mục)
export type Category = {
  id: number;
  name: string;
};

// Định nghĩa kiểu cho một AttributeValue (Giá trị thuộc tính)
export type AttributeValue = {
  id: number;
  attribute_id: number;
  value: string;
  created_at?: string;
  updated_at?: string;
};

// Định nghĩa kiểu cho một Attribute (Thuộc tính)
export type Attribute = {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  values: AttributeValue[]; // Mảng các giá trị thuộc tính liên quan
};

// Định nghĩa kiểu cho một ProductVariant (Biến thể sản phẩm)
export type ProductVariant = {
  id: number;
  name: string; // Tên biến thể, ví dụ: "Gray - 8GB RAM - 256GB SSD"
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  // Giả định API trả về các giá trị thuộc tính đã liên kết với biến thể này
  attribute_values?: AttributeValue[];
};

// Định nghĩa kiểu cho một Product (Sản phẩm)
export type Product = {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Giả định API trả về thông tin chi tiết của brand và category
  brand?: Brand;
  category?: Category;
  // Giả định API trả về các biến thể sản phẩm
  variants?: ProductVariant[];
};

// Định nghĩa kiểu dữ liệu tổng quát cho phản hồi API
// Điều này giúp dễ dàng truy cập dữ liệu trong phản hồi
export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
  meta?: { // Thông tin phân trang nếu có
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
    from?: number;
    to?: number;
  };
};
export type Comment = {
  id: number;
  user_id: number;
  product_id: number;
  rating?: number; // Đánh giá từ 1-5 sao
  comment: string;
  created_at: string;
  updated_at: string;
  user_name?: string; // Tên người dùng bình luận, giả định API trả về
};
export type News = {
  id: number;
  title: string;
  content?: string;
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
  new_column?: string; // Thêm trường 'new_column' cho News
};
export type Banner = {
  id: number;
  image_url: string;
  link_to?: string; // Liên kết mà banner dẫn đến
  is_active?: boolean; // Trạng thái hoạt động của banner
  created_at?: string;
  updated_at?: string;
};