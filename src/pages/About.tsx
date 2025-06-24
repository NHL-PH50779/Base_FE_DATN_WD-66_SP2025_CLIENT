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
  LinearProgress
} from '@mui/material';
import {
  Store,
  People,
  LocalShipping,
  Security,
  Star,
  TrendingUp,
  Favorite,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { icon: People, label: 'Khách hàng', value: '10,000+', color: '#6366f1' },
    { icon: Store, label: 'Sản phẩm', value: '5,000+', color: '#10b981' },
    { icon: LocalShipping, label: 'Đơn hàng', value: '50,000+', color: '#f59e0b' },
    { icon: Star, label: 'Đánh giá', value: '4.9/5', color: '#ef4444' }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      avatar: '/team1.jpg',
      description: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực thương mại điện tử'
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      avatar: '/team2.jpg',
      description: 'Chuyên gia công nghệ với niềm đam mê phát triển sản phẩm'
    },
    {
      name: 'Lê Văn C',
      role: 'Marketing Director',
      avatar: '/team3.jpg',
      description: 'Chuyên gia marketing với nhiều chiến dịch thành công'
    }
  ];

  const values = [
    {
      icon: Security,
      title: 'Uy tín',
      description: 'Cam kết chất lượng sản phẩm và dịch vụ tốt nhất'
    },
    {
      icon: Favorite,
      title: 'Tận tâm',
      description: 'Luôn lắng nghe và phục vụ khách hàng một cách tận tình'
    },
    {
      icon: TrendingUp,
      title: 'Đổi mới',
      description: 'Không ngừng cải tiến và phát triển công nghệ mới'
    },
    {
      icon: EmojiEvents,
      title: 'Xuất sắc',
      description: 'Phấn đấu trở thành số 1 trong lĩnh vực thương mại điện tử'
    }
  ];

  return (
    <Box sx={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
              Về chúng tôi
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
              Chúng tôi là đội ngũ đam mê công nghệ, cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
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
                      borderColor: stat.color + '40'
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
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
                      color: stat.color,
                      fontSize: '1.8rem',
                      border: `2px solid ${stat.color}20`
                    }}
                  >
                    <stat.icon fontSize="large" />
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50' }}>
                Câu chuyện của chúng tôi
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Được thành lập vào năm 2020, chúng tôi bắt đầu với một ý tưởng đơn giản: 
                tạo ra một nền tảng thương mại điện tử thân thiện và đáng tin cậy.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Từ một startup nhỏ, chúng tôi đã phát triển thành một trong những nền tảng 
                hàng đầu với hàng nghìn sản phẩm chất lượng và dịch vụ khách hàng xuất sắc.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Chip label="2020 - Thành lập" color="primary" variant="outlined" />
                <Chip label="10,000+ Khách hàng" color="success" variant="outlined" />
                <Chip label="50+ Nhân viên" color="info" variant="outlined" />
              </Stack>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src="/about-story.jpg"
                  alt="Our Story"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ backgroundColor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                color: '#2c3e50'
              }}
            >
              Giá trị cốt lõi
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 6,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        borderColor: '#6366f140'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: '#e3f2fd',
                        color: '#2196F3'
                      }}
                    >
                      <value.icon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              color: '#2c3e50'
            }}
          >
            Đội ngũ của chúng tôi
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Những con người tài năng đằng sau thành công của chúng tôi
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      border: '4px solid #e3f2fd'
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {member.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;