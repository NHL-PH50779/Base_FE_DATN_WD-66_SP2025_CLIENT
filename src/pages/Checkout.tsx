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
import { orderService } from '../services/order.service';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
  const paymentMethod = 'cod'; // Cố định COD
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

  const shippingFee = 30000; // Phí vận chuyển cố định 30k
  const discount = 0;
  
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee - discount;
  };

  const handleSubmitOrder = async () => {
    try {
      // Validate required fields
      if (!customerInfo.name || !customerInfo.phone || !shippingInfo.province || !shippingInfo.district || !shippingInfo.ward || !shippingInfo.address) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }

      const orderData = {
        // Backend expects these field names based on OrderController
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}`,
        note: shippingInfo.note,
        payment_method: 'cod',
        total: calculateTotal()
      };
      
      console.log('Order submitted:', orderData);
      
      // Gọi API tạo đơn hàng
      const response = await orderService.createOrder(orderData);
      console.log('Order response:', response);
      
      alert('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.');
      
      // Redirect đến trang đơn hàng
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Order error:', error);
      if (error.response?.status === 401) {
        alert('Vui lòng đăng nhập để đặt hàng!');
        navigate('/login');
      } else {
        alert('Có lỗi xảy ra khi đặt hàng: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                
                <Stack spacing={3}>
                  {/* Personal Info */}
                  <TextField
                    fullWidth
                    label="Họ tên đầy đủ *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    variant="outlined"
                    required
                  />
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại *"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      variant="outlined"
                      required
                      helperText="Để liên hệ giao hàng"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      variant="outlined"
                      helperText="Gửi hóa đơn, xác nhận đơn hàng"
                    />
                  </Box>

                  {/* Address Info */}
                  <TextField
                    fullWidth
                    label="Tỉnh/Thành phố *"
                    value={shippingInfo.province}
                    onChange={(e) => setShippingInfo({...shippingInfo, province: e.target.value})}
                    variant="outlined"
                    placeholder="Nhập tỉnh/thành phố"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Quận/Huyện *"
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                    variant="outlined"
                    placeholder="Nhập quận/huyện"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Phường/Xã *"
                    value={shippingInfo.ward}
                    onChange={(e) => setShippingInfo({...shippingInfo, ward: e.target.value})}
                    variant="outlined"
                    placeholder="Nhập phường/xã"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Địa chỉ chi tiết *"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    variant="outlined"
                    placeholder="Số nhà, tên đường, tòa nhà..."
                    required
                  />
                  
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
                </Stack>
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
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      p: 3, 
                      border: '2px solid #4CAF50', 
                      borderRadius: 2, 
                      backgroundColor: '#f1f8e9',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2 
                    }}>
                      <LocalShipping sx={{ color: '#4CAF50', fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          Thanh toán khi nhận hàng (COD)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng đến địa chỉ của bạn
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, mt: 1 }}>
                          ✓ An toàn - Kiểm tra hàng trước khi thanh toán
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
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
                    startIcon={<LocalShipping />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      backgroundColor: '#4CAF50',
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                      '&:hover': {
                        backgroundColor: '#45a049',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc'
                      }
                    }}
                  >
                    Đặt hàng - Thanh toán khi nhận
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