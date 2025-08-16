import { 
  Box, 
  Grid, 
  Typography, 
  Link, 
  Container,
  IconButton,
  Divider,
  Stack
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
  Phone,
  Email,
  LocationOn,
  AccessTime
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
        color: 'white',
        mt: 'auto'
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🚀 TECHSHOP
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Cửa hàng công nghệ hàng đầu Việt Nam
            </Typography>
            
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: '#e3f2fd' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  28/1/459 T3 Đức Giang, Long Biên, Hà Nội
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: '#e3f2fd' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  024.7106.9999
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: '#e3f2fd' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  contact@techshop.vn
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 18, color: '#e3f2fd' }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Phục vụ 24/7
                </Typography>
              </Box>
            </Stack>

            {/* Social Media */}
            <Stack direction="row" spacing={1}>
              {[
                { icon: <Facebook />, color: '#1877F2' },
                { icon: <Instagram />, color: '#E4405F' },
                { icon: <Twitter />, color: '#1DA1F2' },
                { icon: <YouTube />, color: '#FF0000' }
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: social.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${social.color}40`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              gutterBottom
              sx={{ color: '#e3f2fd' }}
            >
              Về TechShop
            </Typography>
            <Stack spacing={1}>
              {[
                'Giới thiệu',
                'Tuyển dụng', 
                'Tin tức',
                'Hệ thống cửa hàng',
                'Liên hệ hợp tác'
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: '#e3f2fd',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Customer Support */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              gutterBottom
              sx={{ color: '#e3f2fd' }}
            >
              Hỗ trợ khách hàng
            </Typography>
            <Stack spacing={1}>
              {[
                'Hướng dẫn mua hàng',
                'Hướng dẫn thanh toán',
                'Chính sách đổi trả',
                'Chính sách bảo hành',
                'Câu hỏi thường gặp'
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: '#e3f2fd',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              gutterBottom
              sx={{ color: '#e3f2fd' }}
            >
              Danh mục sản phẩm
            </Typography>
            <Stack spacing={1}>
              {[
                '💻 Laptop',
                '🖥️ PC & Workstation',
                '📱 Điện thoại',
                '⌚ Smartwatch',
                '🎧 Tai nghe',
                '⌨️ Phụ kiện'
              ].map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: '#e3f2fd',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Container maxWidth="lg">
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 3,
              gap: 2
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ opacity: 0.7, textAlign: { xs: 'center', md: 'left' } }}
            >
              © 2024 TechShop Vietnam. Tất cả quyền được bảo lưu.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ textAlign: 'center' }}
            >
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                MST: 0108528423
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Cấp ngày: 28/11/2018
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;