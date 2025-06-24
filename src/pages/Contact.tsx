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
  Avatar,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Support,
  Chat,
  QuestionAnswer
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const contactInfo = [
    {
      icon: LocationOn,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      color: '#2196F3'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      color: '#4CAF50'
    },
    {
      icon: Email,
      title: 'Email',
      content: 'contact@example.com',
      color: '#FF9800'
    },
    {
      icon: AccessTime,
      title: 'Giờ làm việc',
      content: 'T2-T6: 8:00-18:00\nT7-CN: 9:00-17:00',
      color: '#9C27B0'
    }
  ];

  const supportOptions = [
    {
      icon: Support,
      title: 'Hỗ trợ kỹ thuật',
      description: 'Giải đáp các vấn đề kỹ thuật và sử dụng website',
      action: 'Liên hệ ngay'
    },
    {
      icon: Chat,
      title: 'Chat trực tuyến',
      description: 'Trò chuyện trực tiếp với đội ngũ hỗ trợ',
      action: 'Bắt đầu chat'
    },
    {
      icon: QuestionAnswer,
      title: 'FAQ',
      description: 'Tìm câu trả lời cho các câu hỏi thường gặp',
      action: 'Xem FAQ'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.',
        severity: 'success'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <Box sx={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/pattern.svg)',
            opacity: 0.1
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Liên hệ với chúng tôi
            </Typography>
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi bất cứ khi nào!
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      borderColor: info.color + '40'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 3,
                      background: `linear-gradient(135deg, ${info.color}20, ${info.color}40)`,
                      color: info.color,
                      fontSize: '1.8rem',
                      border: `2px solid ${info.color}20`
                    }}
                  >
                    <info.icon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                    {info.content}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card
                sx={{
                  p: 5,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50' }}>
                  Gửi tin nhắn cho chúng tôi
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Điền thông tin vào form dưới đây và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Tiêu đề"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nội dung tin nhắn"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? undefined : <Send />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 25,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Support Options */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  mb: 4
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50' }}>
                  Các hình thức hỗ trợ
                </Typography>

                <Stack spacing={3}>
                  {supportOptions.map((option, index) => (
                    <Box key={index}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#2196F3',
                            width: 48,
                            height: 48
                          }}
                        >
                          <option.icon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {option.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {option.description}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: '#2196F3',
                              color: '#2196F3',
                              '&:hover': {
                                backgroundColor: '#f3f8ff'
                              }
                            }}
                          >
                            {option.action}
                          </Button>
                        </Box>
                      </Stack>
                      {index < supportOptions.length - 1 && <Divider sx={{ mt: 3 }} />}
                    </Box>
                  ))}
                </Stack>
              </Card>

              {/* Social Media */}
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Theo dõi chúng tôi
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  {[
                    { icon: Facebook, color: '#1877F2' },
                    { icon: Twitter, color: '#1DA1F2' },
                    { icon: Instagram, color: '#E4405F' },
                    { icon: LinkedIn, color: '#0A66C2' }
                  ].map((social, index) => (
                    <Avatar
                      key={index}
                      sx={{
                        backgroundColor: social.color,
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: `0 4px 20px ${social.color}40`
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <social.icon />
                    </Avatar>
                  ))}
                </Stack>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
                color: '#2c3e50'
              }}
            >
              Vị trí của chúng tôi
            </Typography>
            <Box
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 400
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326002567134!2d106.69975731533414!3d10.776530192318146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0x2b6c6b8c6b8c6b8c!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuSENNIC0gQ1MzIChGUFQgVW5pdmVyc2l0eSBIQ01DIC0gQ1MzKQ!5e0!3m2!1svi!2s!4v1635000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default Contact;