
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Divider, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
// import { OrderDetails } from '../../types/cart.type';

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
  id: number; 
  variant_id: number; 
  product: ProductInfo; 
  variant: ProductVariant; 
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number; 
  expires_at: Date; 
  type?: "percentage" | "fixed" | "freeship"; 
}
export interface CheckoutData {
  cartItems: CartItem[];
  subtotal: number;
  appliedCoupon: Coupon | null;
}
export interface OrderDetails {
  customerName: string;
  shippingAddress: string;
  customerPhone: string;
  paymentMethod: string;
  cartItems: CartItem[];
  subtotal: number;
  discount: number; // Tổng số tiền được giảm
  shippingFee: number;
  finalTotal: number;
  appliedCouponCode: string | null;
  orderId?: string; // ID đơn hàng từ backend
  orderDate?: string; // Ngày đặt hàng
}
const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy dữ liệu đơn hàng từ state của navigate
  const orderData = location.state as OrderDetails | null;

  // State để quản lý việc tải dữ liệu (có thể cần nếu bạn fetch từ API)
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Trong một ứng dụng thực tế, bạn sẽ nhận được một orderId từ trang Checkout
    // và sau đó gọi API để fetch chi tiết đơn hàng từ backend.
    // Ví dụ: const orderId = new URLSearchParams(location.search).get('orderId');
    // if (orderId) { fetchOrderDetails(orderId).then(data => setOrderDetails(data)); }

    // Hiện tại, chúng ta đang dùng dữ liệu được truyền qua state
    if (orderData) {
      setOrderDetails(orderData);
    } else {
      // Nếu không có dữ liệu, có thể chuyển hướng về trang chủ hoặc hiển thị lỗi
      // setTimeout(() => navigate('/'), 3000);
    }
    setLoading(false);
  }, [location.state, orderData]); // Phụ thuộc vào location.state và orderData

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  if (loading) {
    return (
      <Container className="py-8 text-center">
        <CircularProgress />
        <Typography variant="h6" className="mt-4">Đang tải thông tin xác nhận đơn hàng...</Typography>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container className="py-8">
        <Alert severity="error" className="text-center">
          Không tìm thấy thông tin đơn hàng để xác nhận. Vui lòng quay lại giỏ hàng hoặc trang chủ.
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => navigate('/cart')} sx={{ mr: 2 }}>
              Về giỏ hàng
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="order-confirmation-page py-8">
      <Typography variant="h4" className="text-center font-bold text-green-600 mb-8">
        Đặt hàng thành công!
      </Typography>

      <Box bgcolor="white" p={4} borderRadius={2} boxShadow={2}>
        <Typography variant="h6" className="mb-4 text-gray-800 font-semibold">
          Chi tiết đơn hàng {orderDetails.orderId ? `(#${orderDetails.orderId})` : ''}
        </Typography>
        <Divider className="mb-3" />
        <Typography variant="body1" className="mb-2">
          **Ngày đặt:** {orderDetails.orderDate ? new Date(orderDetails.orderDate).toLocaleString('vi-VN') : 'N/A'}
        </Typography>
        <Typography variant="body1" className="mb-2">
          **Tên người nhận:** {orderDetails.customerName}
        </Typography>
        <Typography variant="body1" className="mb-2">
          **Số điện thoại:** {orderDetails.customerPhone}
        </Typography>
        <Typography variant="body1" className="mb-2">
          **Địa chỉ giao hàng:** {orderDetails.shippingAddress}
        </Typography>
        <Typography variant="body1" className="mb-2">
          **Phương thức thanh toán:** {orderDetails.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
        </Typography>
        <Divider className="my-3" />
        <Typography variant="h6" className="mb-3 text-gray-800 font-semibold">
          Các sản phẩm đã đặt
        </Typography>
        {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
          <Box mb={3}>
            {orderDetails.cartItems.map((item) => (
              <Box key={item.id} className="flex justify-between items-center py-1">
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {item.product.name} ({item.variant.sku}) x {item.quantity}
                </Typography>
                <Typography variant="body2" className="font-medium text-right">
                  {formatPrice(item.variant.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider className="my-2" />
            <Box className="flex justify-between">
              <Typography variant="subtitle1" className="font-medium">Tạm tính:</Typography>
              <Typography variant="subtitle1">{formatPrice(orderDetails.subtotal)}</Typography>
            </Box>
            {orderDetails.appliedCouponCode && (
              <Box className="flex justify-between text-green-600">
                <Typography variant="subtitle2">Mã giảm giá ({orderDetails.appliedCouponCode}):</Typography>
                <Typography variant="subtitle2">- {formatPrice(orderDetails.discount)}</Typography>
              </Box>
            )}
            <Box className="flex justify-between">
              <Typography variant="subtitle1" className="font-medium">Phí vận chuyển:</Typography>
              <Typography variant="subtitle1">{formatPrice(orderDetails.shippingFee)}</Typography>
            </Box>
            <Divider className="my-2" />
            <Box className="flex justify-between">
              <Typography variant="h6" className="font-bold text-red-600">Tổng cộng:</Typography>
              <Typography variant="h6" className="font-bold text-red-600">{formatPrice(orderDetails.finalTotal)}</Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Không có sản phẩm nào trong đơn hàng.
          </Typography>
        )}
        <Divider className="my-4" />
        <Typography variant="body1" className="text-center text-gray-700 mb-4">
          Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi! Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </Typography>
        <Box textAlign="center">
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderConfirmation;