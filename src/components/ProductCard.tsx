import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Chip,
  IconButton,
  Rating,
  Snackbar,
  Alert,
  LinearProgress
} from '@mui/material';
import WishlistButton from './common/WishlistButton';
import { 
  ShoppingCart, 
  Visibility,
  LocalFireDepartment
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.type';

interface ProductCardProps {
  product: Product & {
    isFlashSale?: boolean;
    originalPrice?: number;
    flashSaleItemId?: number;
    flashSaleData?: {
      sold_quantity: number;
      remaining_quantity: number;
      sold_percentage: number;
      discount_percentage: number;
    };
  };
  onRemoveFromWishlist?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onRemoveFromWishlist }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Lấy giá từ product.price hoặc variants
  const getDisplayPrice = () => {
    // Ưu tiên lấy giá từ product.price
    if (product.price) {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price);
      if (price > 0) {
        return price;
      }
    }
    // Nếu không có giá sản phẩm, lấy từ variants
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return 0;
  };
  
  const displayPrice = getDisplayPrice();
  const originalPrice = product.originalPrice || displayPrice * 1.2; // Sử dụng giá gốc từ props hoặc giả lập

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Xử lý ảnh sản phẩm
  const getImageUrl = (thumbnail?: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://127.0.0.1:8000/storage/products/${thumbnail.replace('products/', '')}`;
  };
  
  // Kiểm tra có tồn kho không
  const hasStock = () => {
    return true; // Luôn cho phép thêm vào giỏ hàng
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: product.isFlashSale ? 380 : 480,
        minHeight: product.isFlashSale ? 380 : 480,
        maxHeight: product.isFlashSale ? 380 : 480,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        borderRadius: product.isFlashSale ? 3 : 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid rgba(0,0,0,0.04)',
        '&:hover': {
          transform: product.isFlashSale ? 'translateY(-8px) scale(1.01)' : 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          borderColor: product.isFlashSale ? 'rgba(255, 71, 87, 0.3)' : 'rgba(130, 202, 157, 0.3)'
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Flash Sale Badge */}
      {product.isFlashSale ? (
        <Chip
          icon={<LocalFireDepartment sx={{ fontSize: '16px !important' }} />}
          label={`🔥 -${product.flashSaleData?.discount_percentage || 17}%`}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 3,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            background: 'linear-gradient(45deg, #ff4757 30%, #ff3742 90%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 71, 87, 0.6)',
            animation: 'pulse 2s infinite'
          }}
        />
      ) : (
        <Chip
          label="-17%"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 3,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            background: 'linear-gradient(45deg, #ff6b6b, #ff5252)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
          }}
        />
      )}

      {/* Wishlist Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 3,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <WishlistButton 
          productId={product.id} 
          size="medium" 
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      </Box>

      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: product.isFlashSale ? 180 : 240 }}>
        <CardMedia
          component="img"
          height={product.isFlashSale ? "180" : "240"}
          image={getImageUrl(product.thumbnail)}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        
        {/* Hover Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(130, 202, 157, 0.9) 0%, rgba(107, 183, 123, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to={`/product/${product.id}`}
              variant="contained"
              startIcon={<Visibility />}
              sx={{
                backgroundColor: 'white',
                color: '#2c3e50',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 3,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
                }
              }}
            >
              Xem chi tiết
            </Button>
          </Stack>
        </Box>
        
        {/* Flash Sale Progress Bar */}
        {product.isFlashSale && product.flashSaleData && (
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            zIndex: 3,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            p: 1.5,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', fontWeight: 600 }}>
                Đã bán {product.flashSaleData.sold_quantity}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem', fontWeight: 600 }}>
                Còn {product.flashSaleData.remaining_quantity}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={product.flashSaleData.sold_percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#ecf0f1',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ff4757',
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: product.isFlashSale ? 2 : 3, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: '#2c3e50',
            fontWeight: 700,
            fontSize: product.isFlashSale ? '0.9rem' : '1.1rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: product.isFlashSale ? 1.5 : 2,
            minHeight: product.isFlashSale ? '2.4rem' : '2.8rem',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: product.isFlashSale ? '#ff4757' : '#82ca9d'
            }
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        {!product.isFlashSale && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={4.5} precision={0.5} size="small" readOnly sx={{ color: '#ffc658' }} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: 500 }}>
              (128 đánh giá)
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: product.isFlashSale ? 2 : 3, mt: 'auto' }}>
          <Typography
            variant="h5"
            sx={{ 
              fontWeight: 800, 
              fontSize: product.isFlashSale ? '1.1rem' : '1.3rem',
              background: product.isFlashSale 
                ? 'linear-gradient(45deg, #ff4757, #ff3742)'
                : 'linear-gradient(45deg, #82ca9d, #6bb77b)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {formatPrice(displayPrice)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              textDecoration: 'line-through',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            {formatPrice(originalPrice)}
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          disabled={displayPrice === 0}
          onClick={async () => {
            
            // Kiểm tra đăng nhập
            const token = localStorage.getItem('token');
            if (!token) {
              showSnackbar('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
              setTimeout(() => window.location.href = '/login', 1500);
              return;
            }
            
            try {
              const { cartService } = await import('../services/cart.service');
              const { useCartStore } = await import('../stores/cart.store');
              
              const flashPrice = product.isFlashSale ? product.price : undefined;
              await cartService.addToCart(product.id, null, 1, flashPrice);
              
              // Sync cart count after adding
              const cartResponse = await cartService.getMyCart();
              const actualCount = cartResponse.data?.items?.length || 0;
              useCartStore.getState().setCartCount(actualCount);
              
              showSnackbar(product.isFlashSale ? 'Đã thêm flash sale vào giỏ hàng!' : 'Đã thêm vào giỏ hàng!', 'success');
            } catch (error: any) {
              console.error('Error adding to cart:', error);
              if (error.response?.status === 401) {
                showSnackbar('Phiên đăng nhập hết hạn!', 'error');
                setTimeout(() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }, 1500);
              } else {
                showSnackbar('Có lỗi khi thêm vào giỏ hàng!', 'error');
              }
            }
          }}
          sx={{
            background: displayPrice > 0 
              ? (product.isFlashSale 
                  ? 'linear-gradient(45deg, #ff4757 30%, #ff3742 90%)'
                  : 'linear-gradient(45deg, #82ca9d 30%, #6bb77b 90%)')
              : '#bbb',
            color: 'white',
            py: product.isFlashSale ? 1.2 : 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'none',
            boxShadow: displayPrice > 0 
              ? (product.isFlashSale 
                  ? '0 6px 20px rgba(255, 71, 87, 0.4)'
                  : '0 6px 20px rgba(130, 202, 157, 0.4)')
              : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: displayPrice > 0 
                ? (product.isFlashSale 
                    ? 'linear-gradient(45deg, #ff3742 30%, #e63946 90%)'
                    : 'linear-gradient(45deg, #6bb77b 30%, #5aa068 90%)')
                : '#bbb',
              transform: displayPrice > 0 ? 'translateY(-2px)' : 'none',
              boxShadow: displayPrice > 0 
                ? (product.isFlashSale 
                    ? '0 8px 25px rgba(255, 71, 87, 0.5)'
                    : '0 8px 25px rgba(130, 202, 157, 0.5)')
                : 'none'
            },
            '&:disabled': {
              background: '#bbb',
              color: 'white'
            }
          }}
        >
          {displayPrice === 0 ? 'Liên hệ' : (product.isFlashSale ? '⚡ Mua ngay' : 'Thêm vào giỏ')}
        </Button>
      </CardContent>
      
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
    </Card>
  );
};

export default ProductCard;