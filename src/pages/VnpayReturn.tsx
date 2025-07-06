import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, Error, Home, Receipt } from '@mui/icons-material';
import { vnpayService } from '../services/vnpay.service';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      // 🧩 3. Gọi API xử lý kết quả
      const response = await vnpayService.handleReturn(searchParams);
      setResult(response);
    } catch (error: any) {
      console.error('Payment return error:', error);
      setResult({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang xử lý kết quả thanh toán...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{
          background: result?.success 
            ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
            : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center'
        }}>
          {result?.success ? (
            <CheckCircle sx={{ fontSize: 80, mb: 2 }} />
          ) : (
            <Error sx={{ fontSize: 80, mb: 2 }} />
          )}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {result?.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {result?.message || 'Đang xử lý...'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Thông tin giao dịch */}
          {result?.success && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Thông tin giao dịch
              </Typography>
              <Box sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                {result.order_id && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Mã đơn hàng:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      #{result.order_id}
                    </Typography>
                  </Box>
                )}
                {result.amount && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Số tiền:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                      {formatPrice(result.amount)}
                    </Typography>
                  </Box>
                )}
                {result.transaction_id && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">Mã giao dịch:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {result.transaction_id}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Thông báo */}
          <Alert 
            severity={result?.success ? 'success' : 'error'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {result?.success 
                ? 'Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.'
                : 'Thanh toán không thành công. Vui lòng thử lại.'
              }
            </Typography>
            {result?.response_code && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Mã lỗi: {result.response_code}
              </Typography>
            )}
          </Alert>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/home')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Về trang chủ
            </Button>
            
            {result?.success && (
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                onClick={() => navigate('/orders')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Xem đơn hàng
              </Button>
            )}
            
            {!result?.success && (
              <Button
                variant="outlined"
                onClick={() => navigate('/cart')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Quay lại giỏ hàng
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VNPayReturn;