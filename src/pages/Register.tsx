import {
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useState } from "react";
import instance from "../apis"; // ✅ dùng axios instance

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "", server: "" });
  };

  const validate = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) newErrors.name = "Vui lòng nhập tên";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 8)
      newErrors.password = "Tối thiểu 8 ký tự";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Nhập lại mật khẩu";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await instance.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: "client", // Có thể bỏ nếu không cần
      });

      localStorage.setItem("token", response.data.token);
      navigate("/login");
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.errors) {
        const fieldErrors: any = {};
        for (const key in data.errors) {
          fieldErrors[key] = data.errors[key][0];
        }
        setErrors((prev: any) => ({ ...prev, ...fieldErrors }));
      } else {
        setErrors((prev: any) => ({
          ...prev,
          server: data?.message || "Đăng ký thất bại",
        }));
      }
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
    >
      <Box width="100%" maxWidth={400} px={3}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
          Tạo tài khoản
        </Typography>
        <Typography textAlign="center" mb={3}>
          Đã có tài khoản?{" "}
          <MuiLink component={Link} to="/login" color="primary">
            Đăng nhập
          </MuiLink>
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Tên"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            {errors.server && (
              <Typography color="error" fontSize="0.875rem">
                {errors.server}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#1E1E4F", py: 1.5 }}
            >
              Đăng ký
            </Button>
          </Stack>
        </form>

        {/* <Divider sx={{ my: 2 }}>Hoặc tiếp tục với</Divider>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          sx={{ textTransform: "none" }}
        >
          Google
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<FacebookIcon />}
          sx={{ textTransform: "none" }}
        >
          Facebook
        </Button> */}
      </Box>
    </Box>
  );
};

export default Register;
