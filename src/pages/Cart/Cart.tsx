import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Typography, Box, IconButton, TextField, Button, Alert } from "@mui/material"; // Import TextField, Button, Alert
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import { CartItem, Coupon } from "../../types/cart.type";
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

export interface CartItem { // Export CartItem interface
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

const initialCartData = [
  {
    id: 1, // id của cart_item
    variant_id: 101, // id của product_variant
    product: {
      id: 1, // ID SẢN PHẨM
      name: "Laptop Dell XPS 13 9310",
      thumbnail:
        "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg",
    },
    variant: {
      sku: "DELL-XPS13-SILVER",
      price: 29990000,
      image:
        "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg", // Có thể dùng thumbnail từ product hoặc image từ variant
    },
    quantity: 1,
  },
  {
    id: 2,
    variant_id: 102,
    product: {
      id: 2, // ID SẢN PHẨM
      name: "Bàn phím cơ Anne Pro 2",
      thumbnail: "https://example.com/anne-pro-2-thumbnail.jpg",
    },
    variant: {
      sku: "ANNE-PRO2-BLACK",
      price: 2500000,
      image: "https://example.com/anne-pro-2-black.jpg",
    },
    quantity: 2,
  },
];
// Giả lập dữ liệu mã giảm giá từ database (từ bảng 'coupons')
const availableCoupons = [
  { code: "GIAM20", discount: 0.2, expires_at: new Date("2025-12-31T23:59:59"), type: "percentage" }, // Giảm 20%
  { code: "FREESHIP", discount: 0, expires_at: new Date("2025-07-31T23:59:59"), type: "freeship" }, // Miễn phí vận chuyển (ví dụ)
  { code: "NEWUSER100K", discount: 100000, expires_at: new Date("2025-09-30T23:59:59"), type: "fixed" }, // Giảm 100k
];
const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartData);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>("");

  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Hàm định dạng tiền tệ
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Tính toán tổng tiền giỏ hàng ban đầu
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  // Tính toán tổng tiền cuối cùng sau khi áp dụng mã giảm giá
  const calculateTotal = (currentSubtotal: number) => {
    let finalTotal = currentSubtotal;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        finalTotal -= currentSubtotal * appliedCoupon.discount;
      } else if (appliedCoupon.type === "fixed") {
        finalTotal -= appliedCoupon.discount;
      }
      // Xử lý type 'freeship' riêng biệt nếu có phí vận chuyển
    }
    return Math.max(0, finalTotal); // Đảm bảo tổng không âm
  };

  const total = calculateTotal(subtotal);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    // Lọc bỏ sản phẩm khỏi giỏ hàng
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);

    // Nếu không còn sản phẩm nào sau khi xóa, reset coupon
    if (updatedCartItems.length === 0) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
    }
  };


  const handleApplyCoupon = () => {
    setCouponError(""); // Reset lỗi cũ
    setAppliedCoupon(null); // Reset mã cũ nếu có

    if (!couponCode) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      return;
    }

    const foundCoupon = availableCoupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!foundCoupon) {
      setCouponError("Mã giảm giá không hợp lệ.");
      return;
    }

    if (new Date() > foundCoupon.expires_at) {
      setCouponError("Mã giảm giá đã hết hạn.");
      return;
    }

    // Có thể thêm logic kiểm tra `max_uses`, `used_count` bằng cách gọi API
    setAppliedCoupon(foundCoupon as Coupon)
    setCouponCode("");
    setCouponError("Áp dụng mã giảm giá thành công!");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.");
      return;
    }

    // Lưu dữ liệu giỏ hàng vào localStorage để truyền sang trang Checkout
    localStorage.setItem('checkoutData', JSON.stringify({
      cartItems,
      subtotal,
      total,
      appliedCoupon,
    }));

    // Chuyển hướng sang trang thanh toán
    navigate("/checkout");
  };

  return (
    <Container className="py-8"> {/* Sử dụng MUI Container */}
      <Typography variant="h4" component="h1" className="text-center font-bold text-gray-900 mb-8">
        GIỎ HÀNG CỦA BẠN
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="h6" className="text-gray-600 text-center mt-10">
          Giỏ hàng của bạn đang trống.
        </Typography>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8"> {/* Tăng khoảng cách giữa các phần */}
          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-4"> {/* Thêm space-y để tạo khoảng cách giữa các item */}
            {cartItems.map((item) => (
              <Box key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md border border-gray-200">
                {/* Bọc ảnh và tên sản phẩm trong Link */}
                <Link to={`/product/${item.product.id}`} className="flex items-center flex-grow sm:flex-grow-0 mb-4 sm:mb-0 mr-4">
                  <img
                    src={item.product.thumbnail || item.variant.image}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-md border border-gray-300 flex-shrink-0"
                  />
                  <div className="ml-4 flex-grow">
                    <Typography variant="h6" className="font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 text-sm mt-1">SKU: {item.variant.sku}</Typography>
                  </div>
                </Link>

                <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto mt-4 sm:mt-0">
                  <Typography variant="h6" className="font-bold text-red-600 sm:mr-8 mb-2 sm:mb-0">
                    {formatPrice(item.variant.price)}
                  </Typography>

                  <div className="flex items-center space-x-2">
                    <IconButton
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      color="primary"
                      aria-label="decrease quantity"
                      disabled={item.quantity <= 1} // Disable nếu số lượng là 1
                      className="border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" className="w-10 text-center font-medium border-b border-gray-300 py-1">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      color="primary"
                      aria-label="increase quantity"
                      className="border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      <AddIcon />
                    </IconButton>
                  </div>

                  <IconButton
                    onClick={() => removeItem(item.id)}
                    color="error" // Màu đỏ cho nút xóa
                    aria-label="delete item"
                    className="ml-4 mt-4 sm:mt-0"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Box>
            ))}
          </div>

          {/* Tóm tắt đơn hàng và mã giảm giá */}
          <div className="lg:w-1/3 flex-shrink-0">
            <Box className="border rounded-lg shadow-md p-6 bg-white sticky top-4"> {/* Thêm sticky top để giữ cố định khi cuộn */}
              <Typography variant="h5" component="h2" className="font-bold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </Typography>
              <div className="space-y-3 text-gray-700"> {/* Tăng khoảng cách giữa các dòng */}
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
                <div className="flex justify-between font-bold text-xl text-gray-900 border-t pt-3 mt-3">
                  <Typography variant="h6">Tổng cộng:</Typography>
                  <Typography variant="h6">{formatPrice(total)}</Typography>
                </div>
              </div>

              {/* Phần áp dụng mã giảm giá */}
              <div className="mt-6 border-t pt-4">
                <Typography variant="h6" className="font-semibold text-gray-800 mb-3">Mã giảm giá</Typography>
                {appliedCoupon ? (
                  <Box className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-2 rounded-md">
                    <Typography variant="body2">Mã "{appliedCoupon.code}" đã được áp dụng.</Typography>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm font-medium underline hover:text-green-800"
                    >
                      Xóa
                    </button>
                  </Box>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <TextField
                      type="text"
                      label="Nhập mã giảm giá"
                      variant="outlined"
                      fullWidth
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ backgroundColor: '#f43f5e', '&:hover': { backgroundColor: '#e11d48' } }} // Đổi màu nút Áp dụng
                    >
                      Áp dụng
                    </Button>
                    {couponError && (
                      <Alert
                        severity={couponError.includes("thành công") ? "success" : "error"}
                        sx={{ mt: 1 }}
                      >
                        {couponError}
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3, backgroundColor: '#f43f5e', '&:hover': { backgroundColor: '#e11d48' }, fontSize: '1.125rem', fontWeight: 'bold' }} // Đổi màu nút Thanh toán
              >
                TIẾN HÀNH THANH TOÁN
              </Button>
            </Box>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;