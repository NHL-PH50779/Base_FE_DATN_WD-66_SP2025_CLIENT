import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Địa chỉ',
      content: 'Số 28/1/459 T3 Đức Giang, Phường Thượng Thanh, Quận Long Biên, Hà Nội'
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Điện thoại',
      content: '024.7106.9999'
    },
    {
      icon: <Email sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Email',
      content: 'contact@techshop.vn'
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Chủ nhật: 8:00 - 22:00'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <Box sx={{ backgroundColor: '#e8e8e8', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Liên hệ với chúng tôi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </Typography>
        </Container>
      </Box>

      {/* Contact Info */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                <Box sx={{ mb: 3 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {info.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.content}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form & Map */}
      <Container sx={{ pb: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#2c3e50' }}>
                Gửi tin nhắn cho chúng tôi
              </Typography>
              
              {showSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Tiêu đề"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Nội dung tin nhắn"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Gửi tin nhắn
                </Button>
              </form>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Thông tin liên hệ
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Địa chỉ cửa hàng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số 28/1/459 T3 Đức Giang, Phường Thượng Thanh, Quận Long Biên, Hà Nội
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Hotline
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    024.7106.9999
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Email hỗ trợ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    contact@techshop.vn
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Giờ làm việc
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thứ 2 - Chủ nhật: 8:00 - 22:00
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;