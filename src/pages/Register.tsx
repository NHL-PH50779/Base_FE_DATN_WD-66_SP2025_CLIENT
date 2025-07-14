import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { authService } from '../services/auth/auth.service';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const sendOtp = async () => {
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      await authService.sendOtp(formData.email);
      setOtpSent(true);
      showSnackbar('Đã gửi mã OTP đến email của bạn!', 'success');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Lỗi khi gửi OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra thông tin đầu vào
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.password_confirmation.trim() || !formData.otp.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      showSnackbar('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error('Register error:', error);
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.email) {
          errorMessage = errors.email[0];
        } else if (errors?.password) {
          errorMessage = errors.password[0];
        } else {
          errorMessage = error.response.data.message || 'Thông tin nhập không hợp lệ';
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3 }}>
            Đăng ký
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Họ tên"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={otpSent}
              />
              <Button
                variant="outlined"
                onClick={sendOtp}
                disabled={otpLoading || otpSent}
                sx={{ minWidth: 120 }}
              >
                {otpLoading ? 'Đang gửi...' : otpSent ? 'Đã gửi' : 'Gửi OTP'}
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
            
            {otpSent && (
              <TextField
                fullWidth
                label="Mã OTP (6 số)"
                value={formData.otp}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                sx={{ mb: 3 }}
                required
                inputProps={{ maxLength: 6 }}
                helperText="Vui lòng kiểm tra email để lấy mã OTP"
              />
            )}
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !otpSent}
              sx={{ mb: 2 }}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
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
    </Container>
  );
};

export default Register;