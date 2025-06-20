import {
  Box,
  Button,
  CardMedia,
  Container,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { CartItem } from "../types/product.type";
import { useNavigate } from "react-router-dom";

const labels = [
  "Ảnh sản phẩm",
  "Tên sản phẩm",
  "Đơn giá",
  "Số lượng",
  "Tổng giá",
  "",
];

function Cart() {
  const [carts, setCarts] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setCarts(result.data.items);
        } else {
          alert(result.message || "Lỗi khi lấy giỏ hàng");
        }
      } catch (err) {
        console.error("Lỗi khi fetch giỏ hàng", err);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/cart/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setCarts((prev) =>
          prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(result.message || "Lỗi cập nhật số lượng");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng", err);
    }
  };

  const handleDeleteItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/cart/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setCarts((prev) => prev.filter((item) => item.id !== cartItemId));
      } else {
        alert(result.message || "Lỗi khi xoá mục khỏi giỏ");
      }
    } catch (err) {
      console.error("Lỗi khi xoá khỏi giỏ hàng", err);
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/checkout/invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("✅ Thanh toán thành công, đơn hàng đã được tạo!");
        setCarts([]);
        navigate(`/invoice/${data.data.order.id}`);
      } else {
        alert(data.message || "Thanh toán thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi thanh toán", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <LabelWrapper
          direction="row"
          alignItems="center"
          justifyContent="space-around"
        >
          {labels.map((label, index) => (
            <Typography fontWeight={500} key={index}>
              {label}
            </Typography>
          ))}
        </LabelWrapper>

        {carts.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" gap={4}>
              <CardMedia
                component="img"
                alt="Product Image"
                image={item.product.thumbnail}
                sx={{
                  width: 250,
                  height: 250,
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
              <Typography fontWeight={500}>
                {item.product.name}{" "}
                {item.productVariant?.Name
                  ? `(${item.productVariant.Name})`
                  : ""}
              </Typography>
            </Stack>

            <Typography fontWeight={500}>
              {item.price.toLocaleString("vi-VN")}₫
            </Typography>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.id, parseInt(e.target.value))
              }
            />

            <Typography fontWeight={500}>
              {(item.price * item.quantity).toLocaleString("vi-VN")}₫
            </Typography>

            <DeleteIcon
              sx={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteItem(item.id)}
            />
          </Stack>
        ))}
        <Box textAlign="right" mt={2}>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Xác nhận thanh toán
          </Button>
        </Box>
      </Wrapper>
    </Container>
  );
}

export default Cart;

const Wrapper = styled(Stack)(() => ({
  paddingTop: 72,
  gap: 16,
}));

const LabelWrapper = styled(Stack)(() => ({
  background: "#E3F2FD",
  height: 55,
  paddingLeft: 16,
  paddingRight: 16,
  marginBottom: 16,
}));
