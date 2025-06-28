import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Card,
  CardContent,
  Snackbar
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd,
  AdminPanelSettings
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { authService } from '../services/auth/auth.service';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const ClientLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      
      showSnackbar('Đăng nhập thành công!', 'success');
      
      setTimeout(() => {
        if (response.user.role === 'admin' || response.user.role === 'super_admin') {
          window.location.href = 'http://localhost:5173/admin';
        } else {
          navigate('/home');
        }
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      
      if (error.response?.status === 401) {
        errorMessage = error.response.data.message || 'Email hoặc mật khẩu không đúng';
      } else if (error.response?.status === 403) {
        errorMessage = 'Tài khoản của bạn đã bị khóa';
      } else if (error.response?.status === 422) {
        errorMessage = error.response.data.message || 'Thông tin nhập không hợp lệ';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    window.location.href = 'http://localhost:5173/admin/login';
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
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
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
                <LoginIcon sx={{ fontSize: 60, mb: 2 }} />
              </motion.div>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Chào mừng trở lại!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Đăng nhập để tiếp tục mua sắm
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
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

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                    sx={{ mb: 4 }}
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? undefined : <LoginIcon />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      mb: 3,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
                      }
                    }}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </motion.div>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    hoặc
                  </Typography>
                </Divider>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/register"
                    startIcon={<PersonAdd />}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      mb: 2,
                      '&:hover': {
                        borderColor: '#1976D2',
                        backgroundColor: '#f3f8ff'
                      }
                    }}
                  >
                    Tạo tài khoản mới
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleAdminLogin}
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: '#ff9800',
                      color: '#ff9800',
                      '&:hover': {
                        borderColor: '#f57c00',
                        backgroundColor: '#fff8e1'
                      }
                    }}
                  >
                    Đăng nhập quản trị
                  </Button>
                </motion.div>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Box>
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
};

export default ClientLogin;