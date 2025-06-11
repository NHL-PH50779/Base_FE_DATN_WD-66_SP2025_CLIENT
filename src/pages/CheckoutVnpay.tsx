import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

const CheckoutVnpay = () => {
  const [amount, setAmount] = useState(10000); // mặc định 10.000đ

  const handlePayment = async () => {
    try {
      const res = await axios.post("http://localhost:3000/", {
        amount,
      });

      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl; // chuyển hướng sang VNPAY
      } else {
        alert("Không thể tạo liên kết thanh toán.");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi thanh toán.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Thanh toán VNPAY
      </Typography>

      <TextField
        fullWidth
        label="Số tiền (VNĐ)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" fullWidth onClick={handlePayment}>
        Thanh toán qua VNPAY
      </Button>
    </Box>
  );
};

export default CheckoutVnpay;
