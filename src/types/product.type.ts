
import Home from "../pages/Home";
export interface DisplayProduct {
  id: number; // product_id
  name: string; // product name
  thumbnail: string; 
  description: string;
  brand_id: number;
  category_id: number;
  created_at: string;
  variant_id: number;
  sku: string; // Tương ứng với trường sku trong product_variants
  price: number; // Tương ứng với trường price trong product_variants
  quantity: number; // Tương ứng với trường quantity trong product_variants
  variant_image?: string; // Tương ứng với trường image trong product_variants (nếu có)

  // Additional data for display (these would be derived from other tables in a real app)
  discount?: number; // Ví dụ: lấy từ bảng promotions hoặc tính toán từ giá
  rating?: number; // Ví dụ: tổng hợp từ bảng comments
  specs?: string; // Ví dụ: tổng hợp từ attribute_values
  code?: string; // Có thể là SKU hoặc một mã sản phẩm khác
}

// Interface cho Categories
export interface Category {
  id: number;
  name: string;
  // Có thể thêm icon hoặc image cho category nếu cần
  image?: string;
}

// Interface cho Brands
export interface Brand {
  id: number;
  name: string;
  // Có thể thêm logo cho brand nếu cần
  logo?: string;
}

// Interface cho News
export interface NewsItem {
  id: number;
  title: string;
  content: string; // Chỉ lấy một phần hoặc đoạn tóm tắt
  thumbnail?: string;
  created_at: string;
}
