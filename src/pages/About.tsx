import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Button
} from '@mui/material';
import {
  Business,
  People,
  Star,
  TrendingUp,
  Security,
  Support,
  LocalShipping,
  Verified
} from '@mui/icons-material';

const About = () => {
  const stats = [
    { icon: <People />, number: '50K+', label: 'Khách hàng tin tưởng' },
    { icon: <Star />, number: '4.8/5', label: 'Đánh giá trung bình' },
    { icon: <LocalShipping />, number: '99%', label: 'Giao hàng đúng hẹn' },
    { icon: <Verified />, number: '100%', label: 'Sản phẩm chính hãng' }
  ];

  const services = [
    {
      icon: <Business sx={{ fontSize: 40, color: '#2196F3' }} />,
      title: 'Công ty uy tín',
      description: 'Được thành lập từ 2018 với nhiều năm kinh nghiệm'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#4CAF50' }} />,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin khách hàng được bảo mật 100%'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#FF9800' }} />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#9C27B0' }} />,
      title: 'Phát triển bền vững',
      description: 'Không ngừng cải tiến và phát triển'
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      position: 'CEO & Founder',
      avatar: '/team1.jpg',
      description: '10+ năm kinh nghiệm trong ngành công nghệ'
    },
    {
      name: 'Trần Thị B',
      position: 'CTO',
      avatar: '/team2.jpg',
      description: 'Chuyên gia về phát triển sản phẩm'
    },
    {
      name: 'Lê Văn C',
      position: 'Marketing Director',
      avatar: '/team3.jpg',
      description: 'Chuyên gia marketing và truyền thông'
    }
  ];

  const values = [
    {
      title: 'Chất lượng',
      description: 'Cam kết cung cấp sản phẩm chất lượng cao nhất',
      color: '#2196F3'
    },
    {
      title: 'Uy tín',
      description: 'Xây dựng niềm tin với khách hàng qua từng giao dịch',
      color: '#4CAF50'
    },
    {
      title: 'Sáng tạo',
      description: 'Không ngừng đổi mới và cải tiến dịch vụ',
      color: '#FF9800'
    },
    {
      title: 'Tận tâm',
      description: 'Phục vụ khách hàng với tất cả sự tận tâm',
      color: '#9C27B0'
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#e8e8e8', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Về TechShop
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Đối tác tin cậy trong hành trình công nghệ của bạn
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', fontSize: '0.95rem' }}>
            Chúng tôi tự hào là một trong những nhà cung cấp sản phẩm công nghệ hàng đầu,
            mang đến cho khách hàng những sản phẩm chất lượng cao với dịch vụ tốt nhất.
          </Typography>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Box sx={{ color: '#2196F3', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#2196F3' }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Content */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50' }}>
              Câu chuyện của chúng tôi
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              TechShop được thành lập vào năm 2018 với sứ mệnh mang đến những sản phẩm công nghệ
              chất lượng cao cho người tiêu dùng Việt Nam. Từ một cửa hàng nhỏ, chúng tôi đã phát triển
              thành một trong những thương hiệu uy tín trong ngành.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
              Với đội ngũ chuyên gia giàu kinh nghiệm và hệ thống phân phối rộng khắp,
              chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: 400,
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Hình ảnh công ty
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 6, color: '#2c3e50' }}>
            Tại sao chọn chúng tôi?
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                  <Box sx={{ mb: 3 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 6, color: '#2c3e50' }}>
          Giá trị cốt lõi
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card sx={{ p: 4, height: '100%', borderLeft: `4px solid ${value.color}` }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: value.color }}>
                  {value.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {value.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Sẵn sàng bắt đầu?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Khám phá các sản phẩm công nghệ tuyệt vời của chúng tôi
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: '#667eea',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#f8fafc'
              }
            }}
          >
            Xem sản phẩm
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default About;