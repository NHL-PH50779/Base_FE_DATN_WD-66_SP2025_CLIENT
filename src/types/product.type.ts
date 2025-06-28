// Giá trị thuộc tính sản phẩm (màu sắc, kích thước, v.v.)
export type AttributeValue = {
  id: number;
  value: string; // Giá trị thuộc tính
  attribute_id: number; // ID của thuộc tính
};

// Biến thể sản phẩm (các phiên bản khác nhau của cùng 1 sản phẩm)
export type ProductVariant = {
  id: number;
  Name: string; // Tên biến thể
  sku: string; // Mã SKU
  price: number; // Giá của biến thể
  stock: number; // Số lượng tồn kho
  attributeValues: AttributeValue[]; // Danh sách thuộc tính
};

// Thông tin sản phẩm chính
export type Product = {
  id: number;
  name: string; // Tên sản phẩm
  price?: number; // Giá cơ bản (tùy chọn)
  thumbnail?: string; // Ảnh đại diện
  description?: string; // Mô tả sản phẩm
  category_id: number; // ID danh mục
  brand_id: number; // ID thương hiệu
  is_active: boolean; // Trạng thái hoạt động
  created_at: string; // Ngày tạo
  updated_at: string; // Ngày cập nhật
  variants?: ProductVariant[]; // Danh sách biến thể
  brand?: {
    id: number;
    name: string;
  }; // Thông tin thương hiệu
  category?: {
    id: number;
    name: string;
  }; // Thông tin danh mục
};

// Danh mục sản phẩm
export type Category = {
  id: string;
  name: string; // Tên danh mục
  description: string; // Mô tả danh mục
};

// Tham số form tạo/sửa sản phẩm
export type ProductFormParams = {
  title: string; // Tiêu đề sản phẩm
  price: number; // Giá sản phẩm
  images: string; // Đường dẫn ảnh
  description: string; // Mô tả
  category: string; // Danh mục
  isShow: boolean; // Hiển thị hay không
};

// Item trong giỏ hàng
export type CartItem = {
  id: number;
  product: Product; // Thông tin sản phẩm
  productVariant?: ProductVariant | null; // Biến thể được chọn
  quantity: number; // Số lượng
  price: number; // Giá tại thời điểm thêm vào giỏ
};
