
export interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Attribute {
  id: number;
  name: string;
}

interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

interface Comment {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  created_at: string;
  username: string;
  rating: number;
}

interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  discount?: number;
}

interface ProductVariantValue {
  id: number;
  variant_id: number;
  attribute_value_id: number;
}

interface DisplayProduct {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  created_at: string;
  selectedVariantId: number;
  sku: string;
  price: number;
  quantity: number;
  variantImage?: string;
  brand_name: string;
  category_name: string;
  displayPrice: number;
  originalPrice: number;
  discountPercentage?: number;
  attributes: { attribute_id: number; attribute_name: string; value_id: number; value: string }[];
  averageRating: number;
  totalReviews: number;
  cpu?: string;
  ram?: string;
  ssd?: string;
  vga?: string;
  display_size?: string;
  battery?: string;
  weight?: string;
}