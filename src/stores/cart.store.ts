import { create } from "zustand";

interface CartStore {
  cartCount: number;
  wishlistCount: number;
  setCartCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
  incrementCart: () => void;
  decrementCart: () => void;
  incrementWishlist: () => void;
  decrementWishlist: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  setWishlistCount: (count) => set({ wishlistCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  decrementCart: () => set((state) => ({ cartCount: Math.max(0, state.cartCount - 1) })),
  incrementWishlist: () => set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
  decrementWishlist: () => set((state) => ({ wishlistCount: Math.max(0, state.wishlistCount - 1) })),
}));