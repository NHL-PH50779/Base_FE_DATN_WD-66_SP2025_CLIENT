export interface ProductInfo {
  id: number;
  name: string;
  thumbnail: string;
}

export interface ProductVariant {
  sku: string;
  price: number;
  image: string;
}

export interface CartItem { // Export CartItem interface
  id: number; // id từ bảng cart_items
  variant_id: number; // id từ bảng product_variants
  product: ProductInfo;
  variant: ProductVariant;
  quantity: number;
}

export interface Coupon { // Export Coupon interface
  code: string;
  discount: number;
  expires_at: Date;
  type?: "percentage" | "fixed" | "freeship"; // Mặc định là percentage nếu không có
}
