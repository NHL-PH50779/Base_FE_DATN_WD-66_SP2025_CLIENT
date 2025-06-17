
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

export interface CartItem {
  id: number; 
  variant_id: number; 
  product: ProductInfo; 
  variant: ProductVariant; 
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number; 
  expires_at: Date; 
  type?: "percentage" | "fixed" | "freeship"; 
}
export interface CheckoutData {
  cartItems: CartItem[];
  subtotal: number;
  appliedCoupon: Coupon | null;
}
export interface OrderDetails {
  customerName: string;
  shippingAddress: string;
  customerPhone: string;
  paymentMethod: string;
  cartItems: CartItem[];
  subtotal: number;
  discount: number; // Tổng số tiền được giảm
  shippingFee: number;
  finalTotal: number;
  appliedCouponCode: string | null;
  orderId?: string; // ID đơn hàng từ backend
  orderDate?: string; // Ngày đặt hàng
}