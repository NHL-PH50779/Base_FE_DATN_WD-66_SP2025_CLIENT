import instance from '../apis';

// Cấu hình timeout cho wishlist API
instance.defaults.timeout = 10000; // 10s thay vì 20s

interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    thumbnail: string;
    brand?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
  };
}

export const wishlistService = {
  // Lấy danh sách sản phẩm yêu thích - sử dụng localStorage
  getWishlist: async () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return { data: wishlist };
  },

  // Toggle sản phẩm yêu thích - sử dụng localStorage
  toggleWishlist: async (productId: number) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isWishlisted = wishlist.includes(productId);
    
    let newWishlist;
    let message;
    
    if (isWishlisted) {
      // Remove from wishlist
      newWishlist = wishlist.filter((id: number) => id !== productId);
      message = 'Đã xóa khỏi yêu thích';
    } else {
      // Add to wishlist
      newWishlist = [...wishlist, productId];
      message = 'Đã thêm vào yêu thích';
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    return {
      success: true,
      message,
      is_favorited: !isWishlisted
    };
  },

  // Kiểm tra sản phẩm có được yêu thích không - sử dụng localStorage
  checkWishlist: async (productId: number) => {
    // Không gọi API, sử dụng localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isWishlisted = wishlist.includes(productId);
    
    return {
      is_favorited: isWishlisted
    };
  },


};