import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
    Stack,
} from "@mui/material";
import { useParams } from "react-router-dom";

// Dữ liệu giả định (mock data) cho các đơn hàng - Trong ứng dụng thực tế, dữ liệu này sẽ lấy từ API
const mockOrders = [
  {
    id: 101,
    userId: 1,
    orderStatus: "Completed",
    paymentStatus: "Paid",
    total: 22990000,
    items: [
      { id: 1, productId: 1, productName: "Laptop Gigabyte G5 KF5-53VN383SH", quantity: 1, price: 22990000 },
    ],
    createdAt: "2024-05-10T10:00:00Z",
  },
  {
    id: 102,
    userId: 1,
    orderStatus: "Completed",
    paymentStatus: "Paid",
    total: 29469000,
    items: [
      { id: 2, productId: 2, productName: "Laptop Lenovo IdeaPad Slim 3 14IRH10", quantity: 1, price: 14979000 },
      { id: 3, productId: 3, productName: "Laptop Asus VivoBook 14 X1405VA-LY623W", quantity: 1, price: 14490000 },
    ],
    createdAt: "2024-05-15T14:30:00Z",
  },
  {
    id: 103,
    userId: 2,
    orderStatus: "Processing",
    paymentStatus: "Pending",
    total: 13990000,
    items: [
      { id: 4, productId: 4, productName: "Laptop Dell Inspiron 3525", quantity: 1, price: 13990000 },
    ],
    createdAt: "2024-06-01T09:00:00Z",
  },
];

// Dữ liệu giả định cho các yêu cầu trả hàng hiện có
const mockReturnRequests = [
  {
    id: 1,
    userId: 1,
    orderId: 101,
    reason: "Sản phẩm bị lỗi màn hình",
    status: "Pending",
    createdAt: "2024-05-12T11:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    orderId: 102,
    reason: "Không đúng mô tả sản phẩm",
    status: "Approved",
    createdAt: "2024-05-18T16:00:00Z",
  },
];

const ReturnRequestPage = () => {
  const { orderId: paramOrderId } = useParams(); // Lấy orderId từ URL nếu có
  const [selectedOrderId, setSelectedOrderId] = useState<number | string>(paramOrderId || "");
  const [reason, setReason] = useState<string>("");
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trong ứng dụng thực tế, userId sẽ lấy từ ngữ cảnh xác thực người dùng
  const currentUserId = 1;

  useEffect(() => {
    // Mô phỏng việc lấy đơn hàng của người dùng và các yêu cầu trả hàng hiện có
    setLoading(true);
    setTimeout(() => {
      const filteredOrders = mockOrders.filter(
        (order) => order.userId === currentUserId
      );
      setUserOrders(filteredOrders);

      const filteredReturnRequests = mockReturnRequests.filter(
        (request) => request.userId === currentUserId
      );
      setReturnRequests(filteredReturnRequests);
      setLoading(false);
    }, 1000);
  }, [currentUserId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!selectedOrderId || !reason.trim()) {
      setErrorMessage("Vui lòng chọn đơn hàng và nhập lý do trả hàng.");
      setSubmitting(false);
      return;
    }

    // Mô phỏng cuộc gọi API để tạo yêu cầu trả hàng
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mô phỏng độ trễ mạng

      const newReturnRequest = {
        id: returnRequests.length + 1, // Tạo ID đơn giản
        userId: currentUserId,
        orderId: parseInt(selectedOrderId as string),
        reason: reason.trim(),
        status: "Pending", // Trạng thái ban đầu
        createdAt: new Date().toISOString(),
      };

      setReturnRequests((prevRequests) => [...prevRequests, newReturnRequest]);
      setSuccessMessage("Yêu cầu trả hàng đã được gửi thành công!");
      setReason(""); // Xóa form
      setSelectedOrderId(""); // Xóa đơn hàng đã chọn
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu trả hàng. Vui lòng thử lại.");
      console.error("Error submitting return request:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8 text-center">
        <CircularProgress />
        <Typography variant="h6" className="mt-4">Đang tải thông tin đơn hàng...</Typography>
      </Container>
    );
  }

  return (
    <Container className="return-request-page py-8">
      <Typography variant="h4" className="text-center font-bold text-gray-800 mb-8">
        Yêu Cầu Trả Hàng
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <Typography variant="h5" className="font-semibold text-gray-700 mb-4">
          Tạo Yêu Cầu Trả Hàng Mới
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="order-select-label">Chọn Đơn Hàng</InputLabel>
          <Select
            labelId="order-select-label"
            id="order-select"
            value={selectedOrderId}
            label="Chọn Đơn Hàng"
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            <MenuItem value="">
              <em>Chọn một đơn hàng</em>
            </MenuItem>
            {userOrders.map((order) => (
              <MenuItem key={order.id} value={order.id}>
                Mã đơn hàng: #{order.id} - Tổng tiền: {order.total.toLocaleString('vi-VN')} đ
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Lý do trả hàng"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mb: 3 }}
          placeholder="Mô tả chi tiết lý do bạn muốn trả hàng..."
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : "Gửi Yêu Cầu Trả Hàng"}
        </Button>
      </Box>

      ---
      <Typography variant="h5" className="font-semibold text-gray-700 mb-4">
        Lịch Sử Yêu Cầu Trả Hàng
      </Typography>
      {returnRequests.length === 0 ? (
        <Typography className="text-gray-600">Bạn chưa có yêu cầu trả hàng nào.</Typography>
      ) : (
        <Stack spacing={3}>
          {returnRequests.map((request) => (
            <Box key={request.id} className="bg-white p-5 rounded-lg shadow-md">
              <Typography variant="h6" className="font-semibold text-blue-700">
                Yêu cầu #{request.id} - Đơn hàng #{request.orderId}
              </Typography>
              <Typography variant="body1" className="text-gray-800 mt-2">
                Lý do: {request.reason}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-1">
                Trạng thái:{" "}
                <span
                  className={`font-bold ${
                    request.status === "Pending"
                      ? "text-yellow-600"
                      : request.status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {request.status}
                </span>
              </Typography>
              <Typography variant="body2" className="text-gray-500 text-sm mt-1">
                Ngày tạo: {new Date(request.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReturnRequestPage;