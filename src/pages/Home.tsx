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
  Chip
} from "@mui/material";
import { 
  LocalShipping, 
  Refresh, 
  Star, 
  SupportAgent,
  ShoppingCart,
  Favorite,
  Visibility
} from "@mui/icons-material";
import type { Product } from "../types/product.type";
import { productService } from "../services/product.service";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        console.log("Products response:", response);
        setProducts(response.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
       <Container
  sx={{
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    py: { xs: 6, md: 10 },
  }}
>
  <Typography
    variant="h2"
    sx={{
      fontWeight: 700,
      mb: 2,
      fontSize: { xs: '2rem', md: '3.5rem' },
      animation: 'fadeInDown 0.8s ease-out',
    }}
  >
    Chúng tôi phục vụ sản phẩm công nghệ
  </Typography>

  <Typography
    variant="h5"
    sx={{
      mb: 4,
      opacity: 0.85,
      fontSize: { xs: '1.1rem', md: '1.4rem' },
      color: 'text.secondary',
      animation: 'fadeInUp 1s ease-out',
    }}
  >
    Cung cấp các sản phẩm công nghệ chất lượng cao, đáng tin cậy
  </Typography>

  <Button
    variant="contained"
    size="large"
    sx={{
      backgroundColor: '#82ca9d',
      color: 'white',
      px: 4,
      py: 1.5,
      fontSize: '1rem',
      borderRadius: '30px',
      boxShadow: '0 4px 20px rgba(130, 202, 157, 0.3)',
      textTransform: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#6bb77b',
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 24px rgba(130, 202, 157, 0.45)',
      },
      animation: 'fadeIn 1.2s ease-out',
    }}
  >
    Xem chi tiết
  </Button>

  {/* CSS keyframes animation */}
  <style>
    {`
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}
  </style>
</Container>

      </Box>

      {/* Services Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor: 'rgba(130, 202, 157, 0.3)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {service.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.subtitle}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* All Products Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 10, mt: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#82ca9d', 
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 1
              }}
            >
              Tất cả sản phẩm
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#2c3e50'
              }}
            >
              Bộ sưu tập laptop cao cấp
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Khám phá {products.length} sản phẩm laptop chính hãng với chất lượng tuyệt vời
            </Typography>
          </Box>

          {products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                Không có sản phẩm nào
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ backgroundColor: '#2c3e50', color: 'white', py: 8, mt: 10 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Đăng ký nhận tin tức
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Nhận thông tin cập nhật về các sản phẩm mới và ưu đãi đặc biệt
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#82ca9d',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#6bb77b'
                    }
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;