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
  Rating
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Visibility 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.type';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Lấy giá từ variant đầu tiên hoặc giá mặc định
  const getDisplayPrice = () => {
    if (product.variants && product.variants.length > 0) {
      // Lấy giá thấp nhất từ các variants
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }
    return 0;
  };
  
  const displayPrice = getDisplayPrice();
  const originalPrice = displayPrice * 1.2; // Giả lập giá gốc

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
    if (product.variants && product.variants.length > 0) {
      return product.variants.some(v => v.stock > 0);
    }
    return true; // Nếu không có variants thì mặc định là có hàng
  };

  return (
    <Card
      sx={{
        maxWidth: 320,
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      <Chip
        label="-17%"
        color="error"
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          fontWeight: 'bold'
        }}
      />

      {/* Favorite Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
        }}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        {isFavorite ? (
          <Favorite sx={{ color: '#ff4757' }} />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(product.thumbnail)}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
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
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Button
            component={Link}
            to={`/product/${product.id}`}
            variant="contained"
            startIcon={<Visibility />}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            Xem chi tiết
          </Button>
        </Box>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (128)
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            color="error"
            sx={{ fontWeight: 700, fontSize: '1.1rem' }}
          >
            {formatPrice(displayPrice)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            {formatPrice(originalPrice)}
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          disabled={!hasStock() || displayPrice === 0}
          sx={{
            backgroundColor: hasStock() && displayPrice > 0 ? '#2d3436' : '#ccc',
            color: 'white',
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: hasStock() && displayPrice > 0 ? '#636e72' : '#ccc',
            }
          }}
        >
          {!hasStock() ? 'Hết hàng' : displayPrice === 0 ? 'Liên hệ' : 'Thêm vào giỏ'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;