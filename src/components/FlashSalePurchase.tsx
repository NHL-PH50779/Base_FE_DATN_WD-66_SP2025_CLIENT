import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import { LocalFireDepartment, Timer, ShoppingCart } from '@mui/icons-material';
import { flashSaleService } from '../services/flashSale.service';
import { cartService } from '../services/cart.service';

interface FlashSalePurchaseProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSuccess?: () => void;
}

const FlashSalePurchase: React.FC<FlashSalePurchaseProps> = ({
  open,
  onClose,
  productId,
  productName,
  onSuccess
}) => {
  const [flashSaleInfo, setFlashSaleInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (open && productId) {
      checkFlashSaleProduct();
    }
  }, [open, productId]);

  useEffect(() => {
    if (flashSaleInfo?.flash_sale?.time_remaining > 0) {
      const timer = setInterval(() => {
        const remaining = flashSaleInfo.flash_sale.time_remaining - 1;
        setFlashSaleInfo((prev: any) => ({
          ...prev,
          flash_sale: { ...prev.flash_sale, time_remaining: remaining }
        }));
        
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        setTimeLeft({ hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [flashSaleInfo]);

  const checkFlashSaleProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await flashSaleService.checkProduct(productId);
      if (response.data.is_in_flash_sale) {
        setFlashSaleInfo(response.data.flash_sale_item);
        
        // Set initial countdown
        const remaining = response.data.flash_sale_item.flash_sale.time_remaining;
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setError('Sản phẩm này không có trong chương trình Flash Sale hiện tại');
      }
    } catch (error) {
      setError('Không thể kiểm tra thông tin Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    setError('');
    
    try {
      // Không gọi API purchase nữa, chỉ chuyển thẳng đến checkout với thông tin flash sale
      const orderData = {
        items: [{
          id: flashSaleInfo.id,
          name: productName,
          price: flashSaleInfo.sale_price,
          quantity: 1,
          image: flashSaleInfo.product?.thumbnail || '',
          variant: 'Flash Sale'
        }],
        total: flashSaleInfo.sale_price + 30000 // Thêm phí ship
      };
      
      // Refresh flash sale data trước khi chuyển trang
      if (onSuccess) {
        onSuccess(); // Gọi callback để refresh data
      }
      
      // Close dialog and redirect to checkout
      onClose();
      window.location.href = `/checkout?directBuy=true&orderData=${encodeURIComponent(JSON.stringify(orderData))}`;
      
    } catch (error: any) {
      const errorMessage = 'Có lỗi xảy ra khi xử lý đơn hàng';
      setError(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        m: -3,
        mb: 3,
        p: 3
      }}>
        <LocalFireDepartment sx={{ mr: 1, fontSize: 30 }} />
        <Typography variant="h5" component="span" sx={{ fontWeight: 700 }}>
          Flash Sale
        </Typography>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Đang kiểm tra thông tin Flash Sale...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : flashSaleInfo ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              {productName}
            </Typography>

            {/* Countdown Timer */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              color: 'white',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                <Timer sx={{ mr: 0.5, fontSize: 16 }} />
                Kết thúc trong
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                {['hours', 'minutes', 'seconds'].map((unit) => (
                  <Box key={unit} sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      p: 1,
                      minWidth: 40
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      {unit === 'hours' ? 'H' : unit === 'minutes' ? 'M' : 'S'}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Price Info */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h5" sx={{ color: '#ff4757', fontWeight: 700 }}>
                  {formatPrice(flashSaleInfo.sale_price)}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textDecoration: 'line-through',
                    color: '#7f8c8d'
                  }}
                >
                  {formatPrice(flashSaleInfo.original_price)}
                </Typography>
                <Chip 
                  label={`-${flashSaleInfo.discount_percentage}%`}
                  sx={{ 
                    background: '#ff4757',
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 600 }}>
                Tiết kiệm: {formatPrice(flashSaleInfo.original_price - flashSaleInfo.sale_price)}
              </Typography>
            </Box>

            {/* Stock Info */}
            <Box sx={{ 
              background: '#f8fafc',
              borderRadius: 2,
              p: 2,
              mb: 3
            }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
                Số lượng còn lại: <strong>{flashSaleInfo.remaining_quantity}</strong> / {flashSaleInfo.quantity_limit}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Đã bán: <strong>{flashSaleInfo.sold_quantity}</strong> sản phẩm
              </Typography>
            </Box>

            {!flashSaleInfo.is_available && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Sản phẩm đã hết hàng trong chương trình Flash Sale
              </Alert>
            )}
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Hủy
        </Button>
        {flashSaleInfo && flashSaleInfo.is_available && (
          <Button
            variant="contained"
            onClick={handlePurchase}
            disabled={purchasing}
            startIcon={purchasing ? <CircularProgress size={20} /> : <ShoppingCart />}
            sx={{
              background: 'linear-gradient(45deg, #ff4757 30%, #ff3742 90%)',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #ff3742 30%, #ff4757 90%)'
              }
            }}
          >
            {purchasing ? 'Đang xử lý...' : 'Mua ngay'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FlashSalePurchase;