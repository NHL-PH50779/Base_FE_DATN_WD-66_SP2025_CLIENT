// src/types/product.ts (hoặc src/interfaces/product.ts)

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Attribute {
  id: number;
  name: string;
}

export interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

export interface Comment {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  created_at: string;
  username: string;
  rating: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  quantity: number; // Tồn kho
  image?: string;
  discount?: number; // Phần trăm giảm giá (ví dụ: 10 cho 10%)
  attribute_values?: AttributeValue[]; // Các giá trị thuộc tính của biến thể này
}

// Interface chính cho sản phẩm hiển thị, đã bao gồm các thuộc tính từ API
export interface DisplayProduct {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  created_at: string;
  cpu?: string;
  ram?: string;
  ssd?: string;
  vga?: string;
  display_size?: string;
  battery?: string;
  weight?: string;
  brand_name: string;
  category_name: string;
  averageRating: number;
  totalReviews: number;
  variants: ProductVariant[]; // Danh sách các biến thể của sản phẩm
  comments: Comment[]; // Danh sách bình luận

  // Các thuộc tính sau sẽ được tính toán hoặc lấy từ selectedVariant
  selectedVariantId?: number;
  sku?: string;
  price: number; // Giá của biến thể đang chọn
  quantity: number; // Tồn kho của biến thể đang chọn
  variantImage?: string;
  originalPrice: number; // Giá gốc của biến thể đang chọn (trước giảm giá)
  discountPercentage?: number;
  displayPrice: number; // Giá hiển thị (sau giảm giá)
  // attributes này đại diện cho các thuộc tính hiển thị của biến thể ĐANG ĐƯỢC CHỌN.
  // Nó có thể được lấy từ selectedVariant.attribute_values và bổ sung attribute_name.
  attributes: { attribute_id: number; attribute_name: string; value_id: number; value: string }[];
}