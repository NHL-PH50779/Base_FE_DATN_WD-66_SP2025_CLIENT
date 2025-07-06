import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get('vnp_ResponseCode');
    
    // Nếu thanh toán thất bại, redirect về checkout
    if (responseCode !== '00') {
      navigate('/checkout');
    }
  }, [location.search, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} minHeight="60vh" justifyContent="center">
      <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
      <Typography variant="h3" gutterBottom color="success.main">
        Thanh toán thành công!
      </Typography>
      <Typography variant="h6" color="text.secondary" mb={4}>
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
      </Typography>
      <Box display="flex" gap={2}>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/orders')}
        >
          Xem đơn hàng
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/home')}
        >
          Tiếp tục mua sắm
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;