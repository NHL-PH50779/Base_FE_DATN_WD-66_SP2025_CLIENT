// Checkout.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
export interface ProductInfo {
  id: number;
  name: string;
  thumbnail: string;
}
export interface ProductVariant {
  sku: string;
  price: number;
  image: string;
}
export interface CartItem { 
  id: number; // id từ bảng cart_items
  variant_id: number; // id từ bảng product_variants
  product: ProductInfo;
  variant: ProductVariant;
  quantity: number;
}

export interface Coupon { // Export Coupon interface
  code: string;
  discount: number;
  expires_at: Date;
  type?: "percentage" | "fixed" | "freeship"; // Mặc định là percentage nếu không có
}
const mockCurrentUser = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0912345678",
  address: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh",
};

// Phí vận chuyển giả định
const SHIPPING_FEE = 30000;

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [fullName, setFullName] = useState<string>(mockCurrentUser.name);
  const [phone, setPhone] = useState<string>(mockCurrentUser.phone);
  const [address, setAddress] = useState<string>(mockCurrentUser.address);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod"); // Default to Cash on Delivery

  const [loading, setLoading] = useState<boolean>(true);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Lấy dữ liệu giỏ hàng từ localStorage
    const storedCheckoutData = localStorage.getItem('checkoutData');
    if (storedCheckoutData) {
      try {
        const { cartItems, subtotal, total, appliedCoupon } = JSON.parse(storedCheckoutData);
        setCartItems(cartItems);
        setSubtotal(subtotal);
        setAppliedCoupon(appliedCoupon);
        // Tính toán lại tổng tiền để đảm bảo phí vận chuyển được tính đúng
        calculateFinalTotal(subtotal, appliedCoupon);
      } catch (error) {
        console.error("Failed to parse checkout data from localStorage", error);
        setErrorMessage("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại từ giỏ hàng.");
      }
    } else {
      setErrorMessage("Không có dữ liệu giỏ hàng để thanh toán. Vui lòng quay lại giỏ hàng.");
    }
    setLoading(false);
  }, []);

  const calculateFinalTotal = (currentSubtotal: number, currentCoupon: Coupon | null) => {
    let finalAmount = currentSubtotal;
    let shippingCost = SHIPPING_FEE;

    if (currentCoupon) {
      if (currentCoupon.type === "percentage") {
        finalAmount -= currentSubtotal * currentCoupon.discount;
      } else if (currentCoupon.type === "fixed") {
        finalAmount -= currentCoupon.discount;
      }
      if (currentCoupon.type === "freeship") {
        shippingCost = 0;
      }
    }
    finalAmount = Math.max(0, finalAmount); // Đảm bảo tổng không âm

    setTotal(finalAmount + shippingCost);
  };

  useEffect(() => {
    // Cập nhật lại tổng tiền khi subtotal hoặc appliedCoupon thay đổi
    calculateFinalTotal(subtotal, appliedCoupon);
  }, [subtotal, appliedCoupon]);


  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setErrorMessage("Giỏ hàng trống. Không thể đặt hàng.");
      return;
    }
    if (!fullName || !phone || !address) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    setPlacingOrder(true);
    setErrorMessage(null);
    setOrderSuccess(false);

    try {
      // Mô phỏng cuộc gọi API tạo đơn hàng
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      const orderData = {
        userId: mockCurrentUser.id, // Lấy từ user đang đăng nhập
        cartItems: cartItems.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.variant.price, // Giá tại thời điểm đặt hàng
        })),
        shippingAddress: address,
        customerName: fullName,
        customerPhone: phone,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        discount: subtotal - (total - (appliedCoupon?.type === 'freeship' ? SHIPPING_FEE : 0)), // Tính toán mức giảm giá thực tế
        shippingFee: appliedCoupon?.type === 'freeship' ? 0 : SHIPPING_FEE,
        finalTotal: total,
        appliedCouponCode: appliedCoupon ? appliedCoupon.code : null,
        orderStatus: "Processing", // Trạng thái ban đầu
        paymentStatus: paymentMethod === "cod" ? "Pending" : "Unpaid", // COD thì pending, còn lại là chưa thanh toán
      };

      console.log("Dữ liệu đơn hàng gửi đi:", orderData);

      // Trong thực tế, bạn sẽ nhận được một phản hồi từ API bao gồm ID đơn hàng
      // Ví dụ: const response = await api.post('/orders', orderData);
      // const orderId = response.data.orderId;

      setOrderSuccess(true);
      // Xóa dữ liệu giỏ hàng sau khi đặt hàng thành công
      localStorage.removeItem('checkoutData');
      // Có thể chuyển hướng người dùng đến trang xác nhận đơn hàng
      setTimeout(() => navigate('/order-confirmation'), 1500); // Chuyển hướng sau khi hiển thị thông báo thành công
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
      console.error("Lỗi khi đặt hàng:", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8 text-center">
        <CircularProgress />
        <Typography variant="h6" className="mt-4">Đang tải thông tin giỏ hàng...</Typography>
      </Container>
    );
  }

  if (errorMessage && !orderSuccess) {
    return (
      <Container className="py-8">
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/cart')}>
          Quay lại giỏ hàng
        </Button>
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <Container className="py-8 text-center">
        <Alert severity="success" sx={{ mb: 3 }}>
          Đặt hàng thành công! Cảm ơn bạn đã mua sắm.
        </Alert>
        <Typography variant="h6" className="mb-4">Bạn sẽ được chuyển hướng đến trang xác nhận đơn hàng.</Typography>
        <CircularProgress size={24} />
      </Container>
    );
  }

  const shippingFeeToDisplay = appliedCoupon?.type === 'freeship' ? 0 : SHIPPING_FEE;

  return (
    <Container className="checkout-page py-8">
      <Typography variant="h4" className="text-center font-bold text-gray-900 mb-8">
        Trang Thanh Toán
      </Typography>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Thông tin giao hàng và phương thức thanh toán */}
        <Box className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md space-y-6">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Thông tin giao hàng
          </Typography>
          <TextField
            label="Họ và tên"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Địa chỉ giao hàng"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Phương thức thanh toán
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              aria-label="payment-method"
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Box className="flex items-center border p-3 rounded-md mb-2 hover:bg-gray-50 transition-colors">
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label={<Typography variant="body1" className="font-medium">Thanh toán khi nhận hàng (COD)</Typography>}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box className="flex items-center border p-3 rounded-md hover:bg-gray-50 transition-colors">
                <FormControlLabel
                  value="bank_transfer"
                  control={<Radio />}
                  label={<Typography variant="body1" className="font-medium">Chuyển khoản ngân hàng</Typography>}
                  sx={{ width: '100%' }}
                />
              </Box>
              {/* Thêm các phương thức thanh toán khác nếu cần */}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Tóm tắt đơn hàng và nút đặt hàng */}
        <Box className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md sticky top-4 self-start">
          <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
            Đơn hàng của bạn
          </Typography>

          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <Box key={item.id} className="flex justify-between items-center text-gray-700 pb-2 border-b border-gray-100">
                <Typography variant="body2" className="flex-grow">
                  {item.product.name} x {item.quantity}
                </Typography>
                <Typography variant="body2" className="font-medium text-right">
                  {formatPrice(item.variant.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </div>

          <div className="space-y-3 text-gray-800 font-medium">
            <div className="flex justify-between">
              <Typography variant="body1">Tạm tính:</Typography>
              <Typography variant="body1">{formatPrice(subtotal)}</Typography>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <Typography variant="body1">Mã giảm giá ({appliedCoupon.code}):</Typography>
                <Typography variant="body1">
                  -{" "}
                  {appliedCoupon.type === "percentage"
                    ? `${(appliedCoupon.discount * 100).toFixed(0)}%`
                    : formatPrice(appliedCoupon.discount)}
                </Typography>
              </div>
            )}
            <div className="flex justify-between">
              <Typography variant="body1">Phí vận chuyển:</Typography>
              <Typography variant="body1">
                {shippingFeeToDisplay === 0 ? "Miễn phí" : formatPrice(shippingFeeToDisplay)}
              </Typography>
            </div>
            <Divider sx={{ my: 2 }} />
            <div className="flex justify-between font-bold text-xl text-red-600">
              <Typography variant="h6">Tổng cộng:</Typography>
              <Typography variant="h6">{formatPrice(total)}</Typography>
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handlePlaceOrder}
            disabled={placingOrder || cartItems.length === 0}
            sx={{ mt: 4, backgroundColor: '#f43f5e', '&:hover': { backgroundColor: '#e11d48' }, fontSize: '1.25rem', fontWeight: 'bold' }}
          >
            {placingOrder ? <CircularProgress size={24} color="inherit" /> : "ĐẶT HÀNG"}
          </Button>
        </Box>
      </div>
    </Container>
  );
};

export default Checkout;