export type OrderStatus = {
  id: number;
  name: string;
  description?: string;
};

export type PaymentStatus = {
  id: number;
  name: string;
  description?: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: number;
    name: string;
    thumbnail?: string;
    price?: number;
  };
  product_variant?: {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributeValues?: Array<{
      id: number;
      value: string;
      attribute_id: number;
    }>;
  };
};

export type Order = {
  id: number;
  user_id: number;
  order_status_id: number;
  payment_status_id: number;
  payment_method: string;
  total: number;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  voucher_code?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  order_status?: OrderStatus;
  payment_status?: PaymentStatus;
};

export type CreateOrderRequest = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  payment_method: string;
  total: number;
  coupon_code?: string;
  coupon_discount?: number;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
  }>;
};

export type OrderListResponse = {
  data: Order[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};