// Cart.tsx (có thay đổi)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
const initialCartData = [
  {
    id: 1, // id của cart_item
    variant_id: 101, // id của product_variant
    product: {
      id: 1, // THÊM ID SẢN PHẨM Ở ĐÂY
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
      id: 2, // THÊM ID SẢN PHẨM Ở ĐÂY
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
  { code: "GIAM20", discount: 0.2, expires_at: new Date("2025-12-31T23:59:59") }, // Giảm 20%
  { code: "FREESHIP", discount: 0, expires_at: new Date("2025-07-31T23:59:59"), type: "freeship" }, // Miễn phí vận chuyển (ví dụ)
  { code: "NEWUSER100K", discount: 100000, expires_at: new Date("2025-09-30T23:59:59"), type: "fixed" }, // Giảm 100k
];

interface ProductInfo {
  id: number; // THÊM ID SẢN PHẨM VÀO ĐÂY
  name: string;
  thumbnail: string;
}

interface ProductVariant {
  sku: string;
  price: number;
  image: string; // Có thể trùng với thumbnail hoặc là ảnh khác của variant
}

interface CartItem {
  id: number; // id từ bảng cart_items
  variant_id: number; // id từ bảng product_variants
  product: ProductInfo;
  variant: ProductVariant;
  quantity: number;
}

interface Coupon {
  code: string;
  discount: number; // Nếu là phần trăm, là giá trị thập phân (0.2 = 20%). Nếu là cố định, là giá trị tiền mặt.
  expires_at: Date;
  type?: "percentage" | "fixed" | "freeship"; // Mặc định là percentage nếu không có
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartData);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>("");

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
    if (newQuantity < 1) return; // Số lượng không được nhỏ hơn 1
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    // Nếu item cuối cùng bị xóa, có thể reset coupon
    if (cartItems.length === 1 && cartItems[0].id === id) {
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

    // Ở đây có thể thêm logic kiểm tra `max_uses`, `used_count` bằng cách gọi API
    // Ví dụ: kiểm tra nếu mã này đã được sử dụng hết số lần tối đa, hoặc user này đã dùng rồi
    // setCouponError("Mã giảm giá đã đạt số lần sử dụng tối đa.");

    setAppliedCoupon(foundCoupon);
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
    console.log("Tiến hành thanh toán:", {
      cartItems,
      appliedCoupon,
      subtotal,
      finalTotal: total,
    });
    // Chuyển hướng sang trang thanh toán hoặc gọi API tạo đơn hàng
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">GIỎ HÀNG CỦA BẠN</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <div className="lg:flex lg:space-x-8">
            {/* Danh sách sản phẩm */}
            <div className="flex-1">
              <div className="border rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center p-4">
                      {/* Bọc ảnh và tên sản phẩm trong Link */}
                      <Link to={`/products/${item.product.id}`} className="flex items-center mr-4">
                        <img
                          src={item.product.thumbnail || item.variant.image} // Ưu tiên thumbnail của product, nếu không có thì dùng image của variant
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded mr-4 border"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 hover:underline">
                            {item.product.name}
                          </h3>
                        </div>
                      </Link>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                        <div>
                         
                          <p className="text-gray-600 text-sm">SKU: {item.variant.sku}</p>
                          <p className="text-gray-800 font-medium">
                            {item.variant.price.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 justify-end md:justify-start">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center border-b border-gray-300 py-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tóm tắt đơn hàng và mã giảm giá */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="border rounded-lg shadow-sm p-6 bg-white">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Mã giảm giá ({appliedCoupon.code}):</span>
                      <span>
                        -{" "}
                        {appliedCoupon.type === "percentage"
                          ? `${(appliedCoupon.discount * 100).toFixed(0)}%`
                          : `${appliedCoupon.discount.toLocaleString()}đ`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                    <span>Tổng cộng:</span>
                    <span>{total.toLocaleString()}đ</span>
                  </div>
                </div>

                {/* Phần áp dụng mã giảm giá */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Mã giảm giá</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-2 rounded-md">
                      <span>Mã "{appliedCoupon.code}" đã được áp dụng.</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm font-medium underline hover:text-green-800"
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
                      >
                        Áp dụng
                      </button>
                      {couponError && (
                        <p
                          className={`text-sm ${
                            couponError.includes("thành công") ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;