import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  CreditCard,
  AccountBalance,
  CheckCircle,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface OrderData {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  shippingInfo: {
    province: string;
    district: string;
    ward: string;
    address: string;
    note: string;
  };
  items: any[];
  total: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu từ checkout page
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Nếu không có dữ liệu, redirect về checkout
      navigate('/checkout');
    }
  }, [location, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePayment = async () => {
    if (!orderData) return;

    setLoading(true);
    try {
      if (paymentMethod === 'cod') {
        // Thanh toán khi nhận hàng
        await handleCODPayment();
      } else {
        // Thanh toán trước (VNPay, Banking)
        await handleOnlinePayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    // Gọi API tạo đơn hàng với payment_status = 1 (chưa thanh toán)
    const orderPayload = {
      ...orderData,
      payment_method: 'cod',
      payment_status: 1 // Chưa thanh toán
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/orders', { 
        state: { 
          message: 'Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.' 
        }
      });
    }, 2000);
  };

  const handleOnlinePayment = async () => {
    // Gọi API tạo đơn hàng và redirect đến cổng thanh toán
    const orderPayload = {
      ...orderData,
      payment_method: paymentMethod,
      payment_status: 2 // Đã thanh toán
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (paymentMethod === 'vnpay') {
      // Redirect to VNPay
      window.location.href = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${orderData.total * 100}&vnp_Command=pay&vnp_CreateDate=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh%20toan%20don%20hang&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:5173/payment/success&vnp_TmnCode=DEMO&vnp_TxnRef=${Date.now()}&vnp_Version=2.1.0`;
    } else {
      // Banking transfer
      setSuccess(true);
      setTimeout(() => {
        navigate('/payment/banking-info', { 
          state: { orderData }
        });
      }, 2000);
    }
  };

  if (!orderData) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin đơn hàng...</Typography>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
          {paymentMethod === 'cod' ? 'Đặt hàng thành công!' : 'Đang chuyển hướng...'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {paymentMethod === 'cod' 
            ? 'Đơn hàng của bạn đã được tạo. Bạn sẽ thanh toán khi nhận hàng.'
            : 'Vui lòng chờ trong giây lát...'
          }
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', py: 4, borderBottom: '1px solid #e2e8f0' }}>
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', textAlign: 'center' }}>
            Thanh toán đơn hàng
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Left - Order Summary */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Thông tin đơn hàng
                </Typography>

                {/* Customer Info */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    Thông tin khách hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.customerInfo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.customerInfo.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.customerInfo.email}
                  </Typography>
                </Box>

                {/* Shipping Address */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                    Địa chỉ giao hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.shippingInfo.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {orderData.shippingInfo.ward}, {orderData.shippingInfo.district}, {orderData.shippingInfo.province}
                  </Typography>
                  {orderData.shippingInfo.note && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Ghi chú: {orderData.shippingInfo.note}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tổng thanh toán:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f44336' }}>
                    {formatPrice(orderData.total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right - Payment Methods */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Chọn phương thức thanh toán
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%', mb: 4 }}>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {/* COD */}
                    <Card sx={{ mb: 2, border: paymentMethod === 'cod' ? '2px solid #4CAF50' : '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="cod"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <LocalShipping sx={{ color: '#4CAF50', fontSize: 30 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Thanh toán khi nhận hàng (COD)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Thanh toán bằng tiền mặt khi shipper giao hàng
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ margin: 0, width: '100%' }}
                        />
                      </CardContent>
                    </Card>

                    {/* VNPay */}
                    <Card sx={{ mb: 2, border: paymentMethod === 'vnpay' ? '2px solid #2196F3' : '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="vnpay"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CreditCard sx={{ color: '#2196F3', fontSize: 30 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  VNPay
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Thanh toán online qua VNPay (ATM, Visa, MasterCard)
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ margin: 0, width: '100%' }}
                        />
                      </CardContent>
                    </Card>

                    {/* Banking */}
                    <Card sx={{ border: paymentMethod === 'banking' ? '2px solid #FF9800' : '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <FormControlLabel
                          value="banking"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <AccountBalance sx={{ color: '#FF9800', fontSize: 30 }} />
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Chuyển khoản ngân hàng
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Chuyển khoản trực tiếp vào tài khoản ngân hàng
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ margin: 0, width: '100%' }}
                        />
                      </CardContent>
                    </Card>
                  </RadioGroup>
                </FormControl>

                {/* Payment Info */}
                {paymentMethod !== 'cod' && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      {paymentMethod === 'vnpay' 
                        ? 'Bạn sẽ được chuyển hướng đến trang thanh toán VNPay để hoàn tất giao dịch.'
                        : 'Sau khi đặt hàng, bạn sẽ nhận được thông tin tài khoản để chuyển khoản.'
                      }
                    </Typography>
                  </Alert>
                )}

                {/* Payment Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePayment}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    backgroundColor: paymentMethod === 'cod' ? '#4CAF50' : paymentMethod === 'vnpay' ? '#2196F3' : '#FF9800',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  {loading 
                    ? 'Đang xử lý...' 
                    : paymentMethod === 'cod' 
                      ? 'Đặt hàng (Thanh toán khi nhận)'
                      : paymentMethod === 'vnpay'
                        ? 'Thanh toán qua VNPay'
                        : 'Đặt hàng và nhận thông tin chuyển khoản'
                  }
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Payment;