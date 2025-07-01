import { useEffect } from 'react';
import { useCartStore } from '../stores/cart.store';

import { wishlistService } from '../services/wishlist.service';

export const useCartSync = () => {
  const { setCartCount, setWishlistCount } = useCartStore();

  useEffect(() => {
    const syncCounts = async () => {
      try {
        // Chỉ sync wishlist từ localStorage (nhanh)
        const wishlistResponse = await wishlistService.getWishlist();
        const wishlistItems = wishlistResponse.data || [];
        setWishlistCount(wishlistItems.length);

        // Cart count sẽ được cập nhật khi user thêm/xóa sản phẩm
      } catch (error) {
        console.error('Error syncing counts:', error);
      }
    };

    syncCounts();
  }, [setCartCount, setWishlistCount]);
};