import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.type';

interface FastProductCardProps {
  product: Product & {
    isFlashSale?: boolean;
    originalPrice?: number;
    flashSaleData?: {
      sold_quantity: number;
      remaining_quantity: number;
      sold_percentage: number;
      discount_percentage: number;
    };
  };
  onPurchaseSuccess?: () => void;
}

const FastProductCard: React.FC<FastProductCardProps> = ({ product, onPurchaseSuccess }) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  
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

  const displayPrice = product.price || 0;
  const originalPrice = product.originalPrice || displayPrice * 1.2;
  const discountPercentage = product.flashSaleData?.discount_percentage || 
    Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: 360,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 32px rgba(255, 71, 87, 0.2)'
          }
        }}
      >
        {/* Discount Badge */}
        <Chip
          label={`-${discountPercentage}%`}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            background: 'linear-gradient(45deg, #ff4757 30%, #ff3742 90%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 71, 87, 0.4)',
            height: 24,
            minWidth: 48,
            borderRadius: '4px'
          }}
        />

        {/* Product Image */}
        <Box sx={{ position: 'relative', height: 200 /* Chiều cao cố định cho ảnh */ }}>
          <CardMedia
            component="img"
            image={getImageUrl(product.thumbnail)}
            alt={product.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '10px',
              backgroundColor: '#f8f9fa'
            }}
          />
          
          {/* Flash Sale Progress Bar */}
          {product.isFlashSale && product.flashSaleData && (
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 3,
              background: 'rgba(255,255,255,0.9)',
              p: 1
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
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
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#ecf0f1',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff4757',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="subtitle1"
            component={Link}
            to={`/product/${product.id}`}
            sx={{
              textDecoration: 'none',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1.5,
              height: '2.8rem', // Chiều cao cố định cho tên sản phẩm
              '&:hover': {
                color: '#ff4757'
              }
            }}
          >
            {product.name}
          </Typography>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: '#ff4757'
              }}
            >
              {formatPrice(displayPrice)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                textDecoration: 'line-through',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#999'
              }}
            >
              {formatPrice(originalPrice)}
            </Typography>
          </Box>
          
          {/* Buy Button */}
          <Box sx={{ mt: 'auto' }}>
            <Box
              onClick={async () => {
                // Kiểm tra còn hàng không
                const remainingQty = product.flashSaleData?.remaining_quantity || 0;
                if (product.isFlashSale && remainingQty <= 0) {
                  setSnackbar({
                    open: true,
                    message: 'Sản phẩm Flash Sale đã hết hàng!',
                    severity: 'error'
                  });
                  return;
                }
                
                try {
                  // Kiểm tra đăng nhập
                  const token = localStorage.getItem('token');
                  if (!token) {
                    setSnackbar({
                      open: true,
                      message: 'Vui lòng đăng nhập để mua sản phẩm!',
                      severity: 'error'
                    });
                    setTimeout(() => window.location.href = '/login', 1500);
                    return;
                  }
                  
                  if (product.isFlashSale) {
                    // Flash Sale: Chuyển thẳng sang checkout
                    const checkoutData = {
                      items: [{
                        product_id: product.id,
                        variant_id: null,
                        quantity: 1,
                        price: product.price,
                        product_name: product.name,
                        product_image: product.thumbnail,
                        isFlashSale: true
                      }],
                      total: product.price || 0
                    };
                    
                    // Lưu dữ liệu checkout vào localStorage
                    localStorage.setItem('flashSaleCheckout', JSON.stringify(checkoutData));
                    
                    // Chuyển sang trang checkout
                    window.location.href = '/checkout?flash=true';
                  } else {
                    // Sản phẩm thường: Thêm vào giỏ hàng
                    const { cartService } = await import('../services/cart.service');
                    const result = await cartService.addToCart(product.id, null, 1, product.price);
                    
                    if (result.isFlashSaleOwned) {
                      setSnackbar({
                        open: true,
                        message: result.message,
                        severity: 'info'
                      });
                      return;
                    }
                    
                    if (onPurchaseSuccess) {
                      onPurchaseSuccess();
                    }
                    
                    setSnackbar({
                      open: true,
                      message: 'Đã thêm sản phẩm vào giỏ hàng!',
                      severity: 'success'
                    });
                  }
                } catch (error: any) {
                  console.error('Error processing purchase:', error);
                  const errorMessage = error.message || 'Có lỗi khi xử lý mua hàng!';
                  setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                  });
                }
              }}
              sx={{
                backgroundColor: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? '#cccccc' : '#ff4757',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1,
                textAlign: 'center',
                borderRadius: 1,
                cursor: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? 'not-allowed' : 'pointer',
                boxShadow: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? 'none' : '0 4px 12px rgba(255, 71, 87, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? '#cccccc' : '#ff3742',
                  transform: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? 'none' : 'translateY(-2px)',
                  boxShadow: (product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? 'none' : '0 6px 16px rgba(255, 71, 87, 0.4)'
                }
              }}
            >
              {(product.isFlashSale && product.flashSaleData?.remaining_quantity <= 0) ? 'ĐÃ HẾT HÀNG' : 
               product.isFlashSale ? 'MUA NGAY' : 'THÊM VÀO GIỎ'}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar Notification */}
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

export default FastProductCard;