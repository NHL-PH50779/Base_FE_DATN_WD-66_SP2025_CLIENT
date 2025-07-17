import instance from "../apis";

export interface FlashSaleItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    thumbnail: string;
    brand?: any;
    category?: any;
  };
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  quantity_limit: number;
  sold_quantity: number;
  remaining_quantity: number;
  sold_percentage: number;
  is_available: boolean;
}

export interface FlashSaleData {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  time_remaining: number;
  status: string;
  items: FlashSaleItem[];
}

export interface UpcomingFlashSale {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  countdown: number;
}

export const flashSaleService = {
  // Lấy flash sale hiện tại
  getCurrentFlashSale: async (forceRefresh = false): Promise<{ data: FlashSaleData | null }> => {
    try {
      // Luôn thêm timestamp để tránh cache
      const timestamp = Date.now();
      const url = `/flash-sale/current?t=${timestamp}`;
      const response = await instance.get(url, { 
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return { data: response.data.data };
    } catch (error) {
      // Silent fail - không log error
      return { data: null };
    }
  },

  // Lấy flash sale sắp tới
  getUpcomingFlashSale: async (): Promise<{ data: UpcomingFlashSale | null }> => {
    try {
      const response = await instance.get('/flash-sale/upcoming', { timeout: 5000 });
      return { data: response.data.data };
    } catch (error) {
      // Silent fail - không log error
      return { data: null };
    }
  },

  // Kiểm tra sản phẩm có trong flash sale không
  checkProduct: async (productId: number) => {
    try {
      const response = await instance.post('/flash-sale/check-product', {
        product_id: productId
      });
      return response.data;
    } catch (error) {
      console.error('Error checking flash sale product:', error);
      throw error;
    }
  },

  // Validate giá flash sale khi đặt hàng
  validateFlashPrice: async (productId: number, price: number, quantity: number = 1) => {
    try {
      const response = await instance.post('/flash-sale/validate-price', {
        product_id: productId,
        price: price,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error validating flash price:', error);
      throw error;
    }
  },

  // Mua sản phẩm flash sale
  purchaseFlashSale: async (flashSaleItemId: number, quantity: number = 1) => {
    try {
      const response = await instance.post('/flash-sale/purchase', {
        flash_sale_item_id: flashSaleItemId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing flash sale:', error);
      throw error;
    }
  },

  // Lấy thống kê flash sale (admin)
  getFlashSaleStats: async (flashSaleId: number) => {
    try {
      const response = await instance.get(`/flash-sale/${flashSaleId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flash sale stats:', error);
      throw error;
    }
  }
};

export default flashSaleService;