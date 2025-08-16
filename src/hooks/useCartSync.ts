import { useEffect } from 'react';
import { useCartStore } from '../stores/cart.store';
import { cartService } from '../services/cart.service';
import { authService } from '../services/auth/auth.service';

export const useCartSync = () => {
  const { setCartCount } = useCartStore();

  useEffect(() => {
    const syncCartCount = async () => {
      if (!authService.isAuthenticated()) {
        setCartCount(0);
        return;
      }

      try {
        const response = await cartService.getMyCart();
        const actualCount = response.data?.items?.length || 0;
        setCartCount(actualCount);
        console.log('Cart synced:', actualCount);
      } catch (error) {
        console.error('Error syncing cart:', error);
        setCartCount(0);
      }
    };

    syncCartCount();
  }, [setCartCount]);
};