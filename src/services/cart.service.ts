import instance from "../apis";
import { useCartStore } from "../stores/cart.store";



const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return data;
};

export const cartService = {
  // Lấy giỏ hàng của user hiện tại
  getMyCart: async () => {
    try {
      const response = await instance.get("/cart");
      const data = parseResponse(response);
      return { data: data.data || data };
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { data: { items: [], total: 0 } };
    }
  },

  // Thêm vào giỏ hàng
  addToCart: async (productId: number, productVariantId: number | null, quantity: number, flashSalePrice?: number) => {
    try {
      const payload: any = {
        product_id: productId,
        quantity
      };
      
      // Chỉ thêm product_variant_id nếu không null
      if (productVariantId !== null) {
        payload.product_variant_id = productVariantId;
      }
      
      // Chỉ thêm price nếu có flash sale và > 0
      if (flashSalePrice && flashSalePrice > 0) {
        payload.price = flashSalePrice;
      }
      
      console.log('Adding to cart with payload:', payload); // Debug
      
      const response = await instance.post("/cart", payload);
      // Không tự động increment - sẽ được sync khi fetch cart
      return parseResponse(response);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      const errorMessage = error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng';
      
      // Kiểm tra nếu là lỗi đã mua Flash Sale - trả về object đặc biệt thay vì throw error
      if (errorMessage.includes('đã sở hữu sản phẩm Flash Sale')) {
        return {
          success: false,
          isFlashSaleOwned: true,
          message: errorMessage
        };
      }
      
      throw new Error(errorMessage);
    }
  },

  // Cập nhật số lượng
  updateCartItem: async (cartItemId: number, quantity: number) => {
    try {
      const response = await instance.put(`/cart/${cartItemId}`, {
        quantity
      });
      return parseResponse(response);
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      // Throw error với message từ backend
      const errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật giỏ hàng';
      throw new Error(errorMessage);
    }
  },

  // Xóa khỏi giỏ hàng
  removeFromCart: async (cartItemId: number) => {
    try {
      const response = await instance.delete(`/cart/${cartItemId}`);
      // Không tự động decrement - sẽ được sync khi fetch cart
      return parseResponse(response);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }
};