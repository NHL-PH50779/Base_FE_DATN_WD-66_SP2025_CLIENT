import React, { memo, useState, useCallback } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Chip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Visibility 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.type';

interface Props {
  product: Product;
}

const FastProductCard: React.FC<Props> = memo(({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const getDisplayPrice = useCallback(() => {
    if (product.price) {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price);
      if (price > 0) return price;
    }
    if (product.variants?.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return 0;
  }, [product.price, product.variants]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const getImageUrl = useCallback((thumbnail?: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://127.0.0.1:8000/storage/products/${thumbnail.replace('products/', '')}`;
  }, []);

  const hasStock = useCallback(() => {
    if (product.variants?.length > 0) {
      return product.variants.some(v => v.stock > 0);
    }
    return true;
  }, [product.variants]);

  const handleAddToCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }
    
    try {
      const { cartService } = await import('../services/cart.service');
      await cartService.addToCart(product.id, null, 1);
      showSnackbar('Đã thêm vào giỏ hàng!', 'success');
    } catch (error: any) {
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
  }, [product.id, showSnackbar]);

  const displayPrice = getDisplayPrice();
  const originalPrice = displayPrice * 1.2;

  return (
    <Card
      sx={{
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        boxShadow: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Chip
        label="-17%"
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 2,
          bgcolor: 'error.main',
          color: 'white'
        }}
      />

      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(255,255,255,0.9)'
        }}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(product.thumbnail)}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        {isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              component={Link}
              to={`/product/${product.id}`}
              variant="contained"
              startIcon={<Visibility />}
              size="small"
              sx={{ bgcolor: 'white', color: 'text.primary' }}
            >
              Xem chi tiết
            </Button>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            minHeight: '2.6rem',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {formatPrice(displayPrice)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
          >
            {formatPrice(originalPrice)}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          disabled={!hasStock() || displayPrice === 0}
          onClick={handleAddToCart}
          size="small"
          sx={{
            bgcolor: hasStock() && displayPrice > 0 ? 'primary.main' : 'grey.400',
            '&:hover': {
              bgcolor: hasStock() && displayPrice > 0 ? 'primary.dark' : 'grey.400'
            }
          }}
        >
          {!hasStock() ? 'Hết hàng' : displayPrice === 0 ? 'Liên hệ' : 'Thêm vào giỏ'}
        </Button>
      </CardContent>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
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
});

FastProductCard.displayName = 'FastProductCard';

export default FastProductCard;