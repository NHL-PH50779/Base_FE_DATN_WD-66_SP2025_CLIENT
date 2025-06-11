import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Divider,
  Paper,
} from "@mui/material";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleResetPassword = () => {
    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    setError("");
    alert(`Liên kết đặt lại mật khẩu đã được gửi đến ${email}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Đặt lại mật khẩu
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={3}
        >
          Chúng tôi sẽ giúp bạn đặt lại mật khẩu
        </Typography>

        <TextField
          fullWidth
          label="Địa chỉ email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleResetPassword}
          sx={{
            mb: 3,
            backgroundColor: "#1e3a8a", // indigo-900
            "&:hover": {
              backgroundColor: "#1e40af", // indigo-800
            },
          }}
        >
          Gửi yêu cầu đặt lại mật khẩu
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={1}
        >
          Bạn đã nhớ mật khẩu?
        </Typography>
        <Link
          href="/login"
          underline="hover"
          variant="body2"
          display="block"
          align="center"
        >
          Quay lại đăng nhập
        </Link>
      </Paper>
    </Box>
  );
}
