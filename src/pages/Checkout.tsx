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
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Stack
} from '@mui/material';
import { cartService } from '../services/cart.service';
import {
  LocationOn,
  Person,
  Phone,
  Email,
  CreditCard,
  LocalShipping,
  AccountBalance
} from '@mui/icons-material';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [shippingInfo, setShippingInfo] = useState({
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Fetch cart data
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await cartService.getMyCart();
      const cartData = response.data.items || [];
      
      // Transform cart data to match CartItem interface
      const transformedItems: CartItem[] = cartData.map((item: any) => ({
        id: item.id,
        name: item.product?.name || 'Sản phẩm',
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.product?.thumbnail || '/placeholder-image.jpg',
        variant: item.product_variant?.name || ''
      }));
      
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const shippingFee = 30000;
  const discount = 0;
  
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee - discount;
  };

  const handleSubmitOrder = () => {
    console.log('Order submitted:', {
      customerInfo,
      shippingInfo,
      paymentMethod,
      items: cartItems,
      total: calculateTotal()
    });
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
            <span style={{ marginRight: 8 }}>Trang chủ</span>
            <span>Thanh toán</span>
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Thanh toán
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', gap: 4, minHeight: '70vh' }}>
          {/* Left Column - Customer Info */}
          <Box sx={{ flex: 1, maxWidth: '50%' }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: 'fit-content' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: '#2196F3' }} />
                  Thông tin cá nhân
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Personal Info */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ tên đầy đủ *"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại *"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      variant="outlined"
                      required
                      helperText="Để liên hệ giao hàng"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      variant="outlined"
                      helperText="Gửi hóa đơn, xác nhận đơn hàng"
                    />
                  </Grid>


                  
                  {/* Address Info */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tỉnh/Thành phố *"
                      value={shippingInfo.province}
                      onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                      variant="outlined"
                      placeholder="Nhập tỉnh/thành phố"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Quận/Huyện *"
                      value={shippingInfo.district}
                      onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                      variant="outlined"
                      placeholder="Nhập quận/huyện"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phường/Xã *"
                      value={shippingInfo.ward}
                      onChange={(e) => setShippingInfo({...shippingInfo, ward: e.target.value})}
                      variant="outlined"
                      placeholder="Nhập phường/xã"
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ chi tiết *"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      variant="outlined"
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ghi chú giao hàng (tùy chọn)"
                      value={shippingInfo.note}
                      onChange={(e) => setShippingInfo({...shippingInfo, note: e.target.value})}
                      variant="outlined"
                      multiline
                      rows={2}
                      placeholder="Ví dụ: gọi trước khi giao, giao sau 18h..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Order Summary & Payment */}
          <Box sx={{ flex: 1, maxWidth: '50%' }}>
            <Stack spacing={3}>
              {/* Cart Total */}
              <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Tổng giỏ hàng
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Tạm tính</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(calculateSubtotal())}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Phí vận chuyển</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(shippingFee)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body1">Giảm giá</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(discount)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Tổng cộng</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#82ca9d' }}>
                      {formatPrice(calculateTotal())}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                    Phương thức thanh toán
                  </Typography>
                  
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShipping sx={{ color: '#4CAF50' }} />
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Thanh toán khi nhận hàng (COD)
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 2, alignItems: 'flex-start' }}
                      />
                      <FormControlLabel
                        value="vnpay"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard sx={{ color: '#2196F3' }} />
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                VNPay
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Thanh toán trực tuyến qua VNPay
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ mb: 3, alignItems: 'flex-start' }}
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                    }
                    label="Tôi đồng ý với điều khoản và chính sách"
                    sx={{ mb: 3 }}
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmitOrder}
                    disabled={!acceptTerms}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      backgroundColor: '#82ca9d',
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(130, 202, 157, 0.3)',
                      '&:hover': {
                        backgroundColor: '#6bb77b',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(130, 202, 157, 0.4)'
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc'
                      }
                    }}
                  >
                    Đặt hàng ngay
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;