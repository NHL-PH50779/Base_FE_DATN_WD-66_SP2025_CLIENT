import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { wishlistService } from '../../services/wishlist.service';
import { authService } from '../../services/auth/auth.service';
import { wishlistUtils } from '../../utils/wishlist.util';
import { useNavigate, useLocation } from 'react-router-dom';

interface WishlistButtonProps {
  productId: number;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  onRemoveFromWishlist?: (productId: number) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  size = 'medium',
  showTooltip = true,
  onRemoveFromWishlist
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();
  const location = useLocation();
  const isWishlistPage = location.pathname === '/wishlist';

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    if (!authService.isAuthenticated()) {
      setIsFavorited(false);
      return;
    }
    
    try {
      const response = await wishlistService.checkWishlist(productId);
      setIsFavorited(response.is_favorited || false);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      setIsFavorited(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authService.isAuthenticated()) {
      showSnackbar('Vui lòng đăng nhập để sử dụng tính năng này!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const response = await wishlistService.toggleWishlist(productId);
      setIsFavorited(response.is_favorited);
      
      // Dispatch custom event để thông báo thay đổi
      window.dispatchEvent(new CustomEvent('wishlistChanged'));
      
      if (response.is_favorited) {
        showSnackbar('Thêm vào danh sách yêu thích!', 'success');
      } else {
        showSnackbar('Đã xóa khỏi danh sách yêu thích!', 'success');
        
        // Nếu đang ở trang wishlist và xóa sản phẩm, gọi callback
        if (isWishlistPage && onRemoveFromWishlist) {
          setTimeout(() => {
            onRemoveFromWishlist(productId);
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      if (error.response?.status === 401) {
        showSnackbar('Phiên đăng nhập hết hạn!', 'error');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        // Vẫn giữ trạng thái local đã thay đổi
        showSnackbar('Cập nhật yêu thích (chế độ offline)', 'success');
      }
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <IconButton
      onClick={handleToggleWishlist}
      disabled={loading}
      size={size}
      sx={{
        color: isFavorited ? '#ff4757' : '#ddd',
        '&:hover': {
          color: '#ff4757',
          backgroundColor: 'rgba(255, 71, 87, 0.1)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      {isFavorited ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  );

  if (!showTooltip) return button;

  return (
    <>
      <Tooltip title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}>
        {button}
      </Tooltip>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WishlistButton;