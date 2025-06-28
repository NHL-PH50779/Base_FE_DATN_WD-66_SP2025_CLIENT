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
import { authService } from '../services/auth/auth.service';
import { voucherService } from '../services/voucher.service';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LocationOn,
  Person,
  Phone,
  Email,
  CreditCard,
  LocalShipping,
  AccountBalance,
  LocalOffer
} from '@mui/icons-material';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
  const location = useLocation();
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
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch cart data and user info
  useEffect(() => {
    fetchCartData();
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const user = authService.getUser();
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
      // Load address if available
      if (user.address) {
        setShippingInfo(prev => ({
          ...prev,
          address: user.address
        }));
      }
    }
  };

  const fetchCartData = async () => {
    try {
      // Check if coming from "Mua ngay" (direct buy)
      if (location.state?.directBuy && location.state?.orderData) {
        const orderData = location.state.orderData;
        setCartItems(orderData.items || []);
        return;
      }
      
      // Check if coming from cart with selected items
      const selectedItems = location.state?.selectedItems;
      if (selectedItems) {
        const transformedItems: CartItem[] = selectedItems.map((item: any) => ({
          id: item.id,
          name: item.product?.name || 'Sản phẩm',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.product?.thumbnail || '/placeholder-image.jpg',
          variant: item.product_variant?.Name || ''
        }));
        setCartItems(transformedItems);
      } else {
        // Fetch all cart items
        const response = await cartService.getMyCart();
        const cartData = response.data.items || [];
        
        const transformedItems: CartItem[] = cartData.map((item: any) => ({
          id: item.id,
          name: item.product?.name || 'Sản phẩm',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.product?.thumbnail || '/placeholder-image.jpg',
          variant: item.product_variant?.Name || ''
        }));
        
        setCartItems(transformedItems);
      }
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
  
  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee - couponDiscount;
  };

  const fetchAvailableVouchers = async () => {
    try {
      const orderAmount = location.state?.directBuy 
        ? (location.state.orderData?.total - 30000) 
        : calculateSubtotal();
      
      const response = await voucherService.getAvailableVouchers(orderAmount);
      setAvailableVouchers(response.data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      setAvailableVouchers([]);
    }
  };

  const handleShowVouchers = () => {
    fetchAvailableVouchers();
    setShowVoucherModal(true);
  };

  const handleSelectVoucher = (voucher: any) => {
    setCouponCode(voucher.code);
    setShowVoucherModal(false);
    // Auto apply the selected voucher
    setTimeout(() => {
      applyCoupon();
    }, 100);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      const orderAmount = location.state?.directBuy 
        ? (location.state.orderData?.total - 30000) 
        : calculateSubtotal();
      
      if (orderAmount <= 0) {
        setCouponError('Giá trị đơn hàng không hợp lệ');
        return;
      }
      
      const response = await voucherService.validateVoucher(couponCode, orderAmount);
      
      setCouponDiscount(response.data.discount_amount);
      setAppliedVoucher(response.data.voucher);
      setCouponError('');
      
      showSnackbar(`Áp dụng mã giảm giá thành công! Giảm ${formatPrice(response.data.discount_amount)}`, 'success');
      
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      setCouponDiscount(0);
      setAppliedVoucher(null);
      
      if (error.response?.status === 404) {
        setCouponError('Mã voucher không tồn tại');
      } else if (error.response?.status === 400) {
        setCouponError(error.response.data.message || 'Mã voucher không hợp lệ');
      } else {
        setCouponError('Lỗi khi áp dụng mã giảm giá');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (isSubmitting) return;
    
    try {
      // Validate required fields
      if (!customerInfo.name || !customerInfo.phone || !shippingInfo.province || !shippingInfo.district || !shippingInfo.ward || !shippingInfo.address) {
        showSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
      }

      if (cartItems.length === 0) {
        showSnackbar('Giỏ hàng trống!', 'error');
        return;
      }

      setIsSubmitting(true);

      const orderData = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}`,
        note: shippingInfo.note,
        payment_method: paymentMethod,
        total: calculateTotal(),
        coupon_code: appliedVoucher?.code || null,
        coupon_discount: couponDiscount,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Gọi API tạo đơn hàng
      const response = await orderService.createOrder(orderData);
      
      if (paymentMethod === 'vnpay') {
        // TODO: Implement VNPay integration
        showSnackbar('Đặt hàng thành công! Đang chuyển hướng đến VNPay...', 'success');
        // window.location.href = response.data.vnpay_url;
      } else {
        showSnackbar('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.', 'success');
      }
      
      // Clear cart items that were ordered (if from selected items)
      if (location.state?.selectedItems) {
        // Remove selected items from cart
        for (const item of cartItems) {
          try {
            await cartService.removeFromCart(item.id);
          } catch (error) {
            console.error('Error removing item from cart:', error);
          }
        }
      }
      
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Order error:', error);
      if (error.response?.status === 401) {
        showSnackbar('Vui lòng đăng nhập để đặt hàng!', 'error');
        navigate('/login');
      } else if (error.response?.status === 400) {
        showSnackbar('Lỗi: ' + (error.response?.data?.message || 'Số lượng sản phẩm không đủ'), 'error');
      } else {
        showSnackbar('Có lỗi xảy ra khi đặt hàng: ' + (error.response?.data?.message || error.message), 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
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
                    {location.state?.directBuy ? 'Thông tin đơn hàng' : 'Tổng giỏ hàng'}
                  </Typography>
                  
                  {/* Hiển thị sản phẩm */}
                  {cartItems.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      {cartItems.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                          <Box
                            component="img"
                            src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000/storage/products/${item.image}`}
                            alt={item.name}
                            sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>{item.name}</Typography>
                            {item.variant && (
                              <Typography variant="body2" color="text.secondary">{item.variant}</Typography>
                            )}
                            <Typography variant="body2" color="primary">
                              {formatPrice(item.price)} x {item.quantity}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={600}>
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Tạm tính</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(location.state?.directBuy ? (location.state.orderData?.total - 30000) : calculateSubtotal())}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Phí vận chuyển</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatPrice(shippingFee)}
                    </Typography>
                  </Box>
                  
                  {/* Coupon Section */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>Mã giảm giá</Typography>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<LocalOffer />}
                        onClick={handleShowVouchers}
                        sx={{ color: '#2196F3', textTransform: 'none' }}
                      >
                        Xem voucher có thể dùng
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="Nhập mã giảm giá hoặc chọn từ danh sách"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        error={!!couponError}
                        helperText={couponError}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="outlined"
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon}
                        sx={{ minWidth: 100 }}
                      >
                        {isApplyingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </Button>
                    </Box>
                    {couponDiscount > 0 && appliedVoucher && (
                      <Box sx={{ mt: 1, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, border: '1px solid #4caf50' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              ✓ {appliedVoucher.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Mã: {appliedVoucher.code} • Giảm {formatPrice(couponDiscount)}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              setCouponCode('');
                              setCouponDiscount(0);
                              setAppliedVoucher(null);
                              setCouponError('');
                            }}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body1">Giảm giá</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: couponDiscount > 0 ? 'success.main' : 'inherit' }}>
                      -{formatPrice(couponDiscount)}
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
                      {/* COD Payment */}
                      <Box sx={{ 
                        p: 3, 
                        border: paymentMethod === 'cod' ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                        borderRadius: 2, 
                        backgroundColor: paymentMethod === 'cod' ? '#f1f8e9' : '#fff',
                        mb: 2,
                        cursor: 'pointer'
                      }}>
                        <FormControlLabel
                          value="cod"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <LocalShipping sx={{ color: '#4CAF50', fontSize: 40 }} />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                                  Thanh toán khi nhận hàng (COD)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500, mt: 1 }}>
                                  ✓ An toàn - Kiểm tra hàng trước khi thanh toán
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ margin: 0, width: '100%' }}
                        />
                      </Box>

                      {/* VNPay Payment */}
                      <Box sx={{ 
                        p: 3, 
                        border: paymentMethod === 'vnpay' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        borderRadius: 2, 
                        backgroundColor: paymentMethod === 'vnpay' ? '#e3f2fd' : '#fff',
                        cursor: 'pointer'
                      }}>
                        <FormControlLabel
                          value="vnpay"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Box
                                component="img"
                                src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png"
                                alt="VNPay"
                                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                              />
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                  Thanh toán online VNPay
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Thanh toán qua thẻ ATM, Visa, MasterCard, QR Code
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500, mt: 1 }}>
                                  ✓ Bảo mật cao - Xử lý nhanh chóng
                                </Typography>
                              </Box>
                            </Box>
                          }
                          sx={{ margin: 0, width: '100%' }}
                        />
                      </Box>
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
                    disabled={!acceptTerms || isSubmitting}
                    startIcon={paymentMethod === 'cod' ? <LocalShipping /> : <CreditCard />}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      backgroundColor: paymentMethod === 'cod' ? '#4CAF50' : '#1976d2',
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: paymentMethod === 'cod' ? '0 4px 15px rgba(76, 175, 80, 0.3)' : '0 4px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        backgroundColor: paymentMethod === 'cod' ? '#45a049' : '#1565c0',
                        transform: 'translateY(-2px)',
                        boxShadow: paymentMethod === 'cod' ? '0 6px 20px rgba(76, 175, 80, 0.4)' : '0 6px 20px rgba(25, 118, 210, 0.4)'
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc'
                      }
                    }}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 
                      paymentMethod === 'cod' ? 'Đặt hàng - Thanh toán khi nhận' : 'Đặt hàng - Thanh toán VNPay'
                    }
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Voucher Modal */}
      <Dialog
        open={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        maxWidth="md"
        fullWidth
        disablePortal
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocalOffer />
          Voucher có thể sử dụng
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {availableVouchers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Không có voucher phù hợp với đơn hàng này
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Hãy tiếp tục mua sắm để nhận ưu đãi tốt hơn!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {availableVouchers.map((voucher) => (
                <Card 
                  key={voucher.id} 
                  sx={{ 
                    p: 3, 
                    border: '2px solid #e0e0e0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#2196F3',
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleSelectVoucher(voucher)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2196F3', mb: 1 }}>
                        {voucher.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {voucher.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Mã: ${voucher.code}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={voucher.discount_type === 'percentage' 
                            ? `Giảm ${voucher.discount_value}%` 
                            : `Giảm ${formatPrice(voucher.discount_value)}`
                          } 
                          size="small" 
                          color="success"
                        />
                        {voucher.min_order_amount > 0 && (
                          <Chip 
                            label={`Đơn tối thiểu ${formatPrice(voucher.min_order_amount)}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                        {voucher.max_discount_amount > 0 && voucher.discount_type === 'percentage' && (
                          <Chip 
                            label={`Giảm tối đa ${formatPrice(voucher.max_discount_amount)}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Hết hạn: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1, textTransform: 'none' }}
                      >
                        Chọn voucher
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoucherModal(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </Box>
  );
};

export default Checkout;