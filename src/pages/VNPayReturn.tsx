import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { CheckCircle, Error, Home, Receipt } from '@mui/icons-material';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    const processVNPayReturn = () => {
      const vnpParams = Object.fromEntries(searchParams.entries());
      const responseCode = vnpParams.vnp_ResponseCode;
      const orderId = vnpParams.vnp_TxnRef;
      const amount = parseInt(vnpParams.vnp_Amount || '0') / 100;
      const transactionId = vnpParams.vnp_TransactionNo;

      if (responseCode === '00') {
        setStatus('success');
        setMessage('Thanh toán thành công!');
        setOrderInfo({
          orderId,
          amount,
          transactionId
        });
      } else {
        setStatus('failed');
        setMessage('Thanh toán thất bại. Vui lòng thử lại!');
      }
    };

    processVNPayReturn();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang xử lý kết quả thanh toán...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          {status === 'success' ? (
            <>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, color: 'success.main', fontWeight: 600 }}>
                Thanh toán thành công!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                {message}
              </Typography>
              
              {orderInfo && (
                <Box sx={{ mb: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Thông tin giao dịch</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Mã đơn hàng:</Typography>
                    <Typography fontWeight={600}>#{orderInfo.orderId}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Số tiền:</Typography>
                    <Typography fontWeight={600} color="success.main">
                      {orderInfo.amount > 0 ? formatPrice(orderInfo.amount) : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Mã giao dịch:</Typography>
                    <Typography fontWeight={600}>{orderInfo.transactionId || 'N/A'}</Typography>
                  </Box>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Receipt />}
                  onClick={() => navigate('/orders')}
                  sx={{ minWidth: 150 }}
                >
                  Xem đơn hàng
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/home')}
                  sx={{ minWidth: 150 }}
                >
                  Về trang chủ
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}>
                Thanh toán thất bại!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                {message}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/orders')}
                  sx={{ minWidth: 150 }}
                >
                  Thử lại
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate('/home')}
                  sx={{ minWidth: 150 }}
                >
                  Về trang chủ
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VNPayReturn;