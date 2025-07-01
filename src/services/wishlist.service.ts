import { useCartStore } from '../stores/cart.store';

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
  getWishlist: async () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return { data: wishlist };
  },

  toggleWishlist: async (productId: number) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const isWishlisted = wishlist.includes(productId);
    
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter((id: number) => id !== productId);
      useCartStore.getState().decrementWishlist();
    } else {
      newWishlist = [...wishlist, productId];
      useCartStore.getState().incrementWishlist();
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    return {
      success: true,
      message: isWishlisted ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích',
      is_favorited: !isWishlisted
    };
  },

  checkWishlist: async (productId: number) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return { is_favorited: wishlist.includes(productId) };
  },
};