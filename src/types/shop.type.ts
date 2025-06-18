// Định nghĩa các Interface cơ bản tương ứng với các bảng trong DB
export interface User {
    id: number;
    name: string;
    email: string;
    password?: string; // Không nên trả về password về frontend
    role: string;
    created_at: string; // Sử dụng string để biểu diễn DATETIME, có thể parse thành Date object sau
  }
  
  export interface Brand {
    id: number;
    name: string;
  }
  
  export interface Category {
    id: number;
    name: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    brand_id: number;
    category_id: number;
    thumbnail?: string; // `thumbnail` có thể null/undefined
    created_at: string;
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
  
  export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    price: number; // DECIMAL(10,2) trong DB thường là number trong TS
    quantity: number;
    image?: string; // `image` có thể null/undefined
    // Thêm trường discount nếu có trong DB hoặc xử lý ở backend
    discount?: number; // Giả định discount là phần trăm (0-100)
  }
  
  export interface ProductVariantValue {
    id: number; // Mặc dù không sử dụng trực tiếp, vẫn định nghĩa nếu có trong bảng
    variant_id: number;
    attribute_value_id: number;
  }
  
  export interface Cart {
    id: number;
    user_id: number;
  }
  
  export interface CartItem {
    id: number;
    cart_id: number;
    variant_id: number;
    quantity: number;
  }
  
  export interface OrderStatus {
    id: number;
    name: string;
  }
  
  export interface PaymentStatus {
    id: number;
    name: string;
  }
  
  export interface Order {
    id: number;
    user_id: number;
    order_status_id: number;
    payment_status_id: number;
    total: number; // DECIMAL(10,2)
    created_at: string;
  }
  
  export interface OrderItem {
    id: number;
    order_id: number;
    variant_id: number;
    quantity: number;
    price: number; // Giá tại thời điểm đặt hàng, DECIMAL(10,2)
  }
  
  export interface ReturnRequest {
    id: number;
    user_id: number;
    order_id: number;
    reason?: string; // TEXT có thể rỗng
    status: string;
    created_at: string;
  }
  
  export interface Refund {
    id: number;
    order_id: number;
    amount: number; // DECIMAL(10,2)
    status: string;
    created_at: string;
  }
  
  export interface Comment {
    id: number;
    user_id: number;
    product_id: number;
    content: string;
    created_at: string;
  }
  
  export interface News {
    id: number;
    title: string;
    content?: string; // TEXT có thể rỗng
    thumbnail?: string; // VARCHAR có thể rỗng
    created_at: string;
  }
  
  export interface NewsComment {
    id: number;
    news_id: number;
    user_id: number;
    content: string;
    created_at: string;
  }
  
  export interface Coupon {
    id: number;
    code: string;
    discount: number; // DECIMAL(10,2)
    max_uses: number;
    used_count: number;
    expires_at?: string; // DATETIME có
  }