export interface DisplayProduct {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  brand_id: number;
  category_id: number;
  created_at: string;
  variant_id: number;
  sku: string;
  price: number;
  quantity: number;
  variant_image?: string;
  discount?: number;
  rating?: number;
  specs?: string;
  code?: string;
}

export interface Category {
  id: number;
  name: string;
  image?: string;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  created_at: string;
}