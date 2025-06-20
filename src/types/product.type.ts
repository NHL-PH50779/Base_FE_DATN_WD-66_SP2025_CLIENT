export type AttributeValue = {
  id: number;
  value: string;
  attribute_id: number;
};

export type ProductVariant = {
  id: number;
  Name: string;
  sku: string;
  price: number;
  stock: number;
  attributeValues: AttributeValue[];
};

export type Product = {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  isShow: boolean;
  variants?: ProductVariant[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type ProductFormParams = {
  title: string;
  price: number;
  images: string;
  description: string;
  category: string;
  isShow: boolean;
};

export type CartItem = {
  id: number;
  product: Product;
  productVariant?: ProductVariant | null;
  quantity: number;
  price: number;
};
