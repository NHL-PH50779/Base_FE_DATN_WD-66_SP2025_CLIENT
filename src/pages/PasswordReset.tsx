import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Snackbar,
  Alert,
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  VpnKey,
  ArrowBack
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { authService } from "../services/auth/auth.service";
import { useNavigate } from "react-router-dom";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    new_password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(formData.email)) {
      setError("Vui lòng nhập email hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(formData.email);
      setStep(2);
      showSnackbar("Mã OTP đã được gửi đến email của bạn!", 'success');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("Email không tồn tại trong hệ thống");
      } else {
        setError(error.response?.data?.message || "Lỗi khi gửi OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      setError("Vui lòng nhập mã OTP 6 số");
      return;
    }
    if (!formData.new_password.trim() || formData.new_password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (formData.new_password !== formData.new_password_confirmation) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation
      });
      showSnackbar("Đặt lại mật khẩu thành công!", 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Lỗi khi đặt lại mật khẩu";
      setError(errorMessage);
      
      if (errorMessage.includes('hết hạn')) {
        setStep(1);
        setFormData({...formData, otp: '', new_password: '', new_password_confirmation: ''});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                color: 'white',
                textAlign: 'center',
                py: 4
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <VpnKey sx={{ fontSize: 60, mb: 2 }} />
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Đặt lại mật khẩu
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {step === 1 ? 'Nhập email để nhận mã OTP' : 'Nhập mã OTP và mật khẩu mới'}
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    sx={{ mb: 4 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSendOtp}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
                      mb: 3,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                      }
                    }}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => setStep(1)}
                    sx={{ mb: 2, color: '#666' }}
                  >
                    Quay lại
                  </Button>

                  <TextField
                    fullWidth
                    label="Mã OTP (6 số)"
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                    sx={{ mb: 3 }}
                    inputProps={{ maxLength: 6 }}
                    helperText={`OTP đã được gửi đến ${formData.email}`}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKey color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.new_password}
                    onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                    sx={{ mb: 3 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.new_password_confirmation}
                    onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
                    sx={{ mb: 4 }}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleResetPassword}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
                      boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                      mb: 3,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #43A047 30%, #5CB85C 90%)',
                      }
                    }}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </Button>
                </motion.div>
              )}

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ← Quay lại đăng nhập
                </Link>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}