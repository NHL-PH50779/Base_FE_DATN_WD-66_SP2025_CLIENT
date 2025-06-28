const WISHLIST_STORAGE_KEY = 'wishlist';

export const wishlistUtils = {
  // Lấy wishlist từ localStorage
  getLocalWishlist: (): number[] => {
    try {
      const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting local wishlist:', error);
      return [];
    }
  },

  // Lưu wishlist vào localStorage
  setLocalWishlist: (wishlist: number[]): void => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error setting local wishlist:', error);
    }
  },

  // Kiểm tra sản phẩm có trong wishlist không
  isInLocalWishlist: (productId: number): boolean => {
    const wishlist = wishlistUtils.getLocalWishlist();
    return wishlist.includes(productId);
  },

  // Toggle sản phẩm trong wishlist
  toggleLocalWishlist: (productId: number): boolean => {
    const wishlist = wishlistUtils.getLocalWishlist();
    const isCurrentlyInWishlist = wishlist.includes(productId);
    
    let newWishlist: number[];
    if (isCurrentlyInWishlist) {
      // Remove from wishlist
      newWishlist = wishlist.filter(id => id !== productId);
    } else {
      // Add to wishlist
      newWishlist = [...wishlist, productId];
    }
    
    wishlistUtils.setLocalWishlist(newWishlist);
    return !isCurrentlyInWishlist; // Return new status
  },

  // Xóa sản phẩm khỏi wishlist
  removeFromLocalWishlist: (productId: number): void => {
    const wishlist = wishlistUtils.getLocalWishlist();
    const newWishlist = wishlist.filter(id => id !== productId);
    wishlistUtils.setLocalWishlist(newWishlist);
  },

  // Thêm sản phẩm vào wishlist
  addToLocalWishlist: (productId: number): void => {
    const wishlist = wishlistUtils.getLocalWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      wishlistUtils.setLocalWishlist(wishlist);
    }
  },

  // Xóa toàn bộ wishlist
  clearLocalWishlist: (): void => {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  }
};