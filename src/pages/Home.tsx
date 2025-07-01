import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  CardMedia,
  Fade,
  Slide,
  Zoom
} from "@mui/material";
import { 
  LocalShipping, 
  Refresh, 
  Star, 
  SupportAgent,
  ShoppingCart,
  Favorite,
  Visibility,
  TrendingUp,
  Category,
  Recommend,
  KeyboardArrowDown
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { Product } from "../types/product.type";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import ProductCard from "../components/ProductCard";
import FlashSale from "../components/FlashSale";


const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data với timeout ngắn hưn
        const fetchWithTimeout = (promise, timeout = 5000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]);
        };
        
        let allProducts = [];
        let categories = [];
        
        try {
          const productsResponse = await fetchWithTimeout(productService.getAllProducts());
          allProducts = productsResponse.data?.slice(0, 16) || [];
        } catch (error) {
          console.warn('Products fetch failed, using empty array');
        }
        
        try {
          const categoriesResponse = await fetchWithTimeout(categoryService.getAllCategories());
          categories = categoriesResponse.data?.slice(0, 8) || [];
        } catch (error) {
          console.warn('Categories fetch failed, using fallback data');
          categories = [
            { id: 1, name: 'Laptop Gaming' },
            { id: 2, name: 'Laptop Văn Phòng' },
            { id: 3, name: 'Laptop Đồ Họa' },
            { id: 4, name: 'Macbook' }
          ];
        }
        
        setProducts(allProducts);
        setCategories(categories);
        setFeaturedProducts(allProducts.slice(0, 8));
        setRecommendedProducts(allProducts.slice(8, 16));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const services = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#82ca9d' }} />,
      title: "Miễn phí vận chuyển",
      subtitle: "Đơn hàng trên 1 triệu"
    },
    {
      icon: <Refresh sx={{ fontSize: 40, color: '#8884d8' }} />,
      title: "Siêu Thị Laptop ",
      subtitle: "Mua Laptop Giá Tốt Nhất 2025"
    },
    {
      icon: <Star sx={{ fontSize: 40, color: '#ffc658' }} />,
      title: "Laptop Chính Hãng TechStore",
      subtitle: "Sản phẩm chất lượng"
    },
    {
      icon: <SupportAgent sx={{ fontSize: 40, color: '#ff7300' }} />,
      title: "Hỗ trợ 24/7",
      subtitle: "Hỗ trợ khách hàng"
    }
  ];

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            animation: 'float 8s ease-in-out infinite'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(2deg)' }
          },
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
            '50%': { transform: 'scale(1.2)', opacity: 0.1 }
          }
        }}
      >
        <Container
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            py: { xs: 8, md: 12 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #ffffff 0%, #e3f2fd 50%, #ffffff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 8px 32px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Chúng tôi phục vụ
              <br />
              <Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '4px',
                  background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                  borderRadius: '2px',
                  animation: 'glow 2s ease-in-out infinite alternate'
                },
                '@keyframes glow': {
                  '0%': { boxShadow: '0 0 5px rgba(0,242,254,0.5)' },
                  '100%': { boxShadow: '0 0 20px rgba(79,172,254,0.8)' }
                }
              }}>
                sản phẩm công nghệ
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 6,
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                letterSpacing: '0.3px',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Cung cấp các sản phẩm công nghệ 
              <Box component="span" sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #ffd700 0%, #ffed4e 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                chất lượng cao, đáng tin cậy
              </Box>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/shop')}
                sx={{
                  background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(79, 172, 254, 0.4)',
                  border: '2px solid transparent',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-5px) scale(1.05)',
                    boxShadow: '0 20px 50px rgba(79, 172, 254, 0.6)',
                    background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)'
                  },
                }}
              >
                🚀 Khám phá ngay
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/about')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  },
                }}
              >
                📖 Tìm hiểu thêm
              </Button>
            </Stack>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{ position: 'absolute', top: '20%', left: '10%' }}
          >
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              animation: 'float 6s ease-in-out infinite'
            }}>
              💻
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            style={{ position: 'absolute', top: '60%', right: '15%' }}
          >
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              animation: 'float 8s ease-in-out infinite reverse'
            }}>
              ⚡
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.1 }}
            style={{ position: 'absolute', bottom: '20%', left: '20%' }}
          >
            <Box sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              animation: 'pulse 4s ease-in-out infinite'
            }}>
              🔥
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Services Section */}
      <Box sx={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', py: 12 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 8,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Tại sao chọn chúng tôi?
            </Typography>
          </motion.div>
          
          <Grid container spacing={6}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Box sx={{ mb: 3 }}>
                        {service.icon}
                      </Box>
                    </motion.div>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#2c3e50' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {service.subtitle}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#82ca9d', 
                textTransform: 'uppercase',
                letterSpacing: 2,
                mb: 2,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Category /> Danh mục sản phẩm
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                background: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Khám phá theo danh mục
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {categories.slice(0, 8).map((category, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }
                  }}
                  onClick={() => navigate(`/shop?category=${category.id}`)}
                >
                  <Box
                    sx={{
                      height: 140,
                      background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][category.id % 6]} 0%, ${['#764ba2', '#667eea', '#f5576c', '#f093fb', '#00f2fe', '#4facfe'][category.id % 6]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.3rem',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 1
                      }
                    }}
                  >
                    {category.name}
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ 
        background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)', 
        py: 12,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(130, 202, 157, 0.1) 0%, transparent 50%)',
        }
      }}>
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#82ca9d', 
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  mb: 2,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <TrendingUp /> Sản phẩm bán chạy
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  background: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Laptop được yêu thích nhất
              </Typography>
            </Box>
          </motion.div>

          {featuredProducts.length > 0 && (
            <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
              {featuredProducts.map((product, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id} sx={{ display: 'flex' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    style={{ width: '100%' }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* News Section */}
      <Box sx={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', py: 12 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#82ca9d', 
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  mb: 2,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <Recommend /> Tin tức
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  background: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Tin tức công nghệ mới nhất
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {[
              {
                title: "Xu hướng laptop 2025",
                content: "Khám phá những xu hướng mới nhất trong thế giới laptop năm 2025...",
                gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              },
              {
                title: "Công nghệ AI trong laptop",
                content: "Tìm hiểu về những ứng dụng AI mới nhất được tích hợp vào laptop...",
                gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              },
              {
                title: "Mẹo chọn laptop phù hợp",
                content: "Hướng dẫn chi tiết cách chọn laptop phù hợp với nhu cầu sử dụng...",
                gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              }
            ].map((news, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden', 
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }
                  }}>
                    <Box
                      sx={{
                        height: 200,
                        background: news.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold'
                      }}
                    >
                      📰
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#2c3e50' }}>
                        {news.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                        {news.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* View All Products Button */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/shop')}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              px: 6,
              py: 2.5,
              fontSize: '1.1rem',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.05)',
                boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
              }
            }}
          >
            Xem tất cả {products.length} sản phẩm 🚀
          </Button>
        </motion.div>
      </Box>
      

    </Box>
  );
};

export default Home;