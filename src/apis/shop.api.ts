import axios from "axios";
import type { DisplayProduct, Brand, Category, Attribute, AttributeValue } from "../types/product.type"; // Đảm bảo đường dẫn này đúng

const API_URL = "http://localhost:8000/api"; // Thay đổi nếu API của bạn ở địa chỉ khác

interface GetProductsParams {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  brandIds?: number[];
  attributeValueIds?: number[];
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

interface ProductsApiResponse {
  products: DisplayProduct[];
  totalProducts: number;
  // Bạn có thể thêm các thông tin khác từ API nếu có, ví dụ:
  // brands: Brand[];
  // categories: Category[];
  // attributes: Attribute[];
  // attributeValues: AttributeValue[];
}

// Hàm lấy danh sách sản phẩm với các bộ lọc, sắp xếp và phân trang
export const getShopProducts = async (params: GetProductsParams): Promise<ProductsApiResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString());
    if (params.minPrice !== undefined) queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.brandIds && params.brandIds.length > 0) queryParams.append("brandIds", params.brandIds.join(","));
    if (params.attributeValueIds && params.attributeValueIds.length > 0) queryParams.append("attributeValueIds", params.attributeValueIds.join(","));
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());

    const response = await axios.get<ProductsApiResponse>(`${API_URL}/shop/products?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm từ API:", error);
    throw error;
  }
};

// Hàm lấy tất cả thương hiệu (nếu backend có endpoint riêng)
export const getShopBrands = async (): Promise<Brand[]> => {
  try {
    const response = await axios.get<Brand[]>(`${API_URL}/brands`); // Giả định có endpoint /api/brands
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thương hiệu từ API:", error);
    throw error;
  }
};

// Hàm lấy tất cả danh mục (nếu backend có endpoint riêng)
export const getShopCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`); // Giả định có endpoint /api/categories
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải danh mục từ API:", error);
    throw error;
  }
};

// Hàm lấy tất cả thuộc tính và giá trị thuộc tính (nếu backend có endpoint riêng)
// Đây có thể là một endpoint kết hợp hoặc cần gọi nhiều lần
export const getShopAttributes = async (): Promise<{ attributes: Attribute[]; attributeValues: AttributeValue[] }> => {
  try {
    // Giả định có một endpoint trả về cả thuộc tính và giá trị
    const response = await axios.get<{ attributes: Attribute[]; attributeValues: AttributeValue[] }>(`${API_URL}/attributes`); 
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thuộc tính từ API:", error);
    throw error;
  }
};