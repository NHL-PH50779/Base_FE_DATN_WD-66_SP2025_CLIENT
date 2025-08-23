import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Error,
  AccountBalanceWallet,
  ShoppingCart
} from '@mui/icons-material';
import axios from 'axios';

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    processVnpayReturn();
  }, []);

  const processVnpayReturn = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả params từ URL
      const params = Object.fromEntries(searchParams.entries());
      
      console.log('VNPay return params:', params);
      
      // Gọi API xử lý kết quả
      const response = await axios.get('http://127.0.0.1:8000/api/vnpay/return', {
        params: params
      });
      
      console.log('VNPay return response:', response.data);
      
      setResult(response.data);
    } catch (error: any) {
      console.error('VNPay return error:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán');
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
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Đang xử lý kết quả thanh toán...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: 'error.main' }}>
              Lỗi xử lý thanh toán
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Về trang chủ
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/wallet')}
            >
              Về ví của tôi
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const isSuccess = result?.success;
  const isWalletDeposit = result?.type === 'wallet_deposit';

  return (
    <Container sx={{ py: 8 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          {isSuccess ? (
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          ) : (
            <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          )}
          
          <Typography variant="h5" sx={{ mb: 2, color: isSuccess ? 'success.main' : 'error.main' }}>
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={isWalletDeposit ? <AccountBalanceWallet /> : <ShoppingCart />}
              label={isWalletDeposit ? 'Nạp tiền vào ví' : 'Thanh toán đơn hàng'}
              color={isSuccess ? 'success' : 'error'}
              sx={{ mb: 2 }}
            />
          </Box>

          {result?.amount && (
            <Typography variant="h6" sx={{ mb: 2 }}>
              Số tiền: {formatPrice(result.amount)}
            </Typography>
          )}

          {result?.transaction_id && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mã giao dịch: {result.transaction_id}
            </Typography>
          )}

          {result?.order_id && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Đơn hàng: #{result.order_id}
            </Typography>
          )}

          <Alert 
            severity={isSuccess ? 'success' : 'error'} 
            sx={{ mb: 3, textAlign: 'left' }}
          >
            {result?.message || (isSuccess ? 'Giao dịch đã được xử lý thành công' : 'Giao dịch thất bại')}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {isWalletDeposit ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate('/wallet')}
                  startIcon={<AccountBalanceWallet />}
                >
                  Xem ví của tôi
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Về trang chủ
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => navigate('/orders')}
                  startIcon={<ShoppingCart />}
                >
                  Xem đơn hàng
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Tiếp tục mua sắm
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VnpayReturn;