import {
  Avatar,
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type OrderItem = {
  product: { name: string; thumbnail: string };
  productVariant?: { Name: string };
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total: number;
  order_items: OrderItem[];
};

const formatVND = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setOrder(data.data);
      else alert(data.message || "Lỗi khi tải hóa đơn");
    };

    if (id) fetchOrder();
  }, [id]);

  if (!order)
    return (
      <Typography variant="h6" mt={4}>
        Đang tải hóa đơn...
      </Typography>
    );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" mt={4} mb={3} fontWeight={600} color="primary">
        Hoá đơn #{order.id}
      </Typography>

      <StyledBox>
        {order.order_items.map((item, index) => (
          <ItemRow key={index}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                src={item.product.thumbnail}
                alt={item.product.name}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography fontWeight={600}>{item.product.name}</Typography>
                {item.productVariant?.Name && (
                  <Typography variant="body2" color="text.secondary">
                    Phân loại: {item.productVariant.Name}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Box textAlign="right">
              <Typography fontWeight={500}>
                {item.quantity} x {formatVND(Number(item.price))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                = {formatVND(Number(item.price) * item.quantity)}
              </Typography>
            </Box>
          </ItemRow>
        ))}
      </StyledBox>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" align="right" fontWeight={600}>
        Tổng cộng: {formatVND(Number(order.total))}
      </Typography>
    </Container>
  );
};

export default Invoice;

// Styled components
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
}));

const ItemRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-of-type": {
    borderBottom: "none",
  },
}));
