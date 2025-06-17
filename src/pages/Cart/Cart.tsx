// src/pages/Cart/Cart.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Alert,
  TextField,
  InputAdornment
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
// import { CartItem, Coupon, CheckoutData } from "../../types/cart.type";

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

// Dữ liệu giỏ hàng giả định
const initialMockCartItems: CartItem[] = [
  {
    id: 1, // ID của CartItem (có thể là unique ID của cart)
    variant_id: 101, // ID của biến thể sản phẩm trong DB
    product: {
      id: 1,
      name: "Laptop Gaming ASUS ROG Strix",
      thumbnail: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Laptop1",
    },
    variant: {
      sku: "ROG-STRIX-I7-16-512",
      price: 25000000,
      image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Laptop1",
    },
    quantity: 2,
  },
  {
    id: 2,
    variant_id: 202,
    product: {
      id: 2,
      name: "Chuột Gaming Logitech G502",
      thumbnail: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Mouse1",
    },
    variant: {
      sku: "LOGI-G502-HERO",
      price: 850000,
      image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Mouse1",
    },
    quantity: 1,
  },
  {
    id: 3,
    variant_id: 303,
    product: {
      id: 3,
      name: "Bàn phím cơ Anne Pro 2",
      thumbnail: "https://via.placeholder.com/150/008000/FFFFFF?text=Keyboard1",
    },
    variant: {
      sku: "ANNE-PRO2-BROWN",
      price: 1500000,
      image: "https://via.placeholder.com/150/008000/FFFFFF?text=Keyboard1",
    },
    quantity: 1,
  },
];

// Mã giảm giá giả định
const mockCoupons: Coupon[] = [
  { code: "GIAM10PT", discount: 0.1, expires_at: new Date(Date.now() + 86400000), type: "percentage" }, // 10%
  { code: "GIAM50K", discount: 50000, expires_at: new Date(Date.now() + 86400000), type: "fixed" }, // 50k
  { code: "FREESHIP", discount: 0, expires_at: new Date(Date.now() + 86400000), type: "freeship" }, // Miễn phí ship
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialMockCartItems);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState<string>("");
  const [couponError, setCouponError] = useState<string | null>(null);

  // Cập nhật subtotal khi giỏ hàng thay đổi
  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    const foundCoupon = mockCoupons.find((c) => c.code === couponCodeInput.toUpperCase());

    if (!foundCoupon) {
      setCouponError("Mã giảm giá không hợp lệ hoặc không tồn tại.");
      setAppliedCoupon(null);
      return;
    }

    if (foundCoupon.expires_at < new Date()) {
      setCouponError("Mã giảm giá đã hết hạn.");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(foundCoupon);
    // Bạn có thể thêm alert hoặc Snackbar ở đây
    console.log(`Áp dụng mã giảm giá ${foundCoupon.code} thành công!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError(null);
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) { // Không cho phép số lượng nhỏ hơn 1
      handleRemoveItem(id); // Nếu số lượng về 0 hoặc âm thì xóa luôn sản phẩm
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Hàm xử lý khi người dùng click vào "Tiến hành thanh toán"
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm.");
      return;
    }

    // Chuẩn bị dữ liệu để truyền sang trang Checkout
    const checkoutData: CheckoutData = {
      cartItems: cartItems,
      subtotal: subtotal,
      appliedCoupon: appliedCoupon,
    };

    try {
      // Lưu dữ liệu vào localStorage dưới dạng chuỗi JSON
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      navigate('/checkout'); // Chuyển hướng đến trang thanh toán
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu giỏ hàng vào localStorage:", error);
      alert("Đã xảy ra lỗi khi chuẩn bị thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <Container className="cart-page py-8">
      <Typography variant="h4" className="text-center font-bold text-gray-900 mb-8">
        Giỏ hàng của bạn
      </Typography>

      {cartItems.length === 0 ? (
        <Alert severity="info" className="text-center">
          Giỏ hàng của bạn đang trống. <Link to="/products" className="text-blue-600 hover:underline">Tiếp tục mua sắm!</Link>
        </Alert>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <Box className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md space-y-4">
            {cartItems.map((item) => (
              <Box key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
                <img
                  src={item.variant.image || item.product.thumbnail}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <Box className="flex-grow">
                  <Typography variant="h6" className="font-semibold">
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    SKU: {item.variant.sku}
                  </Typography>
                  <Typography variant="body1" className="font-medium text-red-600">
                    {formatPrice(item.variant.price)}
                  </Typography>
                  <Box className="flex items-center mt-2">
                    <Button
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      sx={{ minWidth: '30px', padding: '5px' }}
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          handleUpdateQuantity(item.id, val);
                        } else if (e.target.value === '') {
                           // Allow empty input for a moment before setting to 1 or default
                        }
                      }}
                      onBlur={(e) => { // Handle blur to set a valid quantity
                        const val = parseInt(e.target.value);
                        if (isNaN(val) || val < 1) {
                            handleUpdateQuantity(item.id, 1); // Default to 1 if invalid
                        }
                      }}
                      sx={{ width: '60px', mx: 1, '& input': { textAlign: 'center', p: '8px' } }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      sx={{ minWidth: '30px', padding: '5px' }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      sx={{ ml: 2 }}
                    >
                      <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} /> Xóa
                    </Button>
                  </Box>
                </Box>
                <Typography variant="h6" className="font-bold">
                  {formatPrice(item.variant.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Tóm tắt giỏ hàng */}
          <Box className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md sticky top-4 self-start">
            <Typography variant="h5" className="font-semibold text-gray-800 mb-4">
              Tóm tắt đơn hàng
            </Typography>

            <div className="space-y-3 text-gray-800 font-medium">
              <div className="flex justify-between">
                <Typography variant="body1">Tạm tính:</Typography>
                <Typography variant="body1">{formatPrice(subtotal)}</Typography>
              </div>

              {/* Phần mã giảm giá */}
              <Box className="mt-4">
                <TextField
                  label="Mã giảm giá"
                  variant="outlined"
                  fullWidth
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  sx={{ mb: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          onClick={handleApplyCoupon}
                          disabled={!couponCodeInput || !!appliedCoupon}
                          sx={{ p: '8px 12px', whiteSpace: 'nowrap' }}
                        >
                          Áp dụng
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                {couponError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {couponError}
                  </Typography>
                )}
                {appliedCoupon && (
                  <Alert severity="success" sx={{ mt: 2 }} action={
                    <Button color="inherit" size="small" onClick={handleRemoveCoupon}>
                      Xóa
                    </Button>
                  }>
                    Mã {appliedCoupon.code} đã được áp dụng.
                  </Alert>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Tổng cộng */}
              <div className="flex justify-between font-bold text-xl text-red-600">
                <Typography variant="h6">Tổng cộng (chưa bao gồm phí vận chuyển):</Typography>
                <Typography variant="h6">
                  {formatPrice(subtotal - (appliedCoupon?.type === 'percentage' ? subtotal * appliedCoupon.discount : appliedCoupon?.type === 'fixed' ? appliedCoupon.discount : 0))}
                </Typography>
              </div>
            </div>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 4, backgroundColor: '#f43f5e', '&:hover': { backgroundColor: '#e11d48' }, fontSize: '1.25rem', fontWeight: 'bold' }}
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
            >
              TIẾN HÀNH THANH TOÁN
            </Button>
          </Box>
        </div>
      )}
    </Container>
  );
};

export default Cart;