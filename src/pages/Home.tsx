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
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' }
            }}
          >
            Chúng tôi phục vụ sản phẩm công nghệ tươi mới
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Chúng tôi cung cấp các sản phẩm công nghệ chất lượng cao
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#82ca9d',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '25px',
              boxShadow: '0 4px 15px rgba(130, 202, 157, 0.3)',
              '&:hover': {
                backgroundColor: '#6bb77b',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(130, 202, 157, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Xem chi tiết
          </Button>
        </Container>
      </Box>

      {/* Services Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

      {/* Featured Products Section */}
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
              Sản phẩm nổi bật
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#2c3e50'
              }}
            >
              Sản phẩm của chúng tôi
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Khám phá bộ sưu tập sản phẩm công nghệ hàng đầu với chất lượng tuyệt vời
            </Typography>
          </Box>

          {products.length > 0 ? (
            <>
              <Grid container spacing={4}>
                {products.slice(0, 4).map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={product.thumbnail || '/placeholder-image.jpg'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            '&:hover': {
                              opacity: 1
                            }
                          }}
                          className="product-overlay"
                        >
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${product.id}`);
                              }}
                              sx={{ 
                                minWidth: 'auto', 
                                p: 1,
                                backgroundColor: 'white',
                                color: '#333',
                                '&:hover': {
                                  backgroundColor: '#f0f0f0'
                                }
                              }}
                            >
                              <Visibility />
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ 
                                minWidth: 'auto', 
                                p: 1,
                                backgroundColor: '#ff6b6b',
                                '&:hover': {
                                  backgroundColor: '#ff5252'
                                }
                              }}
                            >
                              <Favorite />
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#82ca9d', 
                              fontWeight: 700 
                            }}
                          >
                            {product.variants?.[0]?.price?.toLocaleString('vi-VN')}₫
                          </Typography>
                          {product.variants?.[0]?.price && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: 'text.secondary'
                              }}
                            >
                              {(product.variants[0].price * 1.2).toLocaleString('vi-VN')}₫
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Second Row of Products */}
              {products.length > 4 && (
                <Grid container spacing={4} sx={{ mt: 6 }}>
                  {products.slice(4, 8).map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <img
                            src={product.thumbnail || '/placeholder-image.jpg'}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              '&:hover': {
                                opacity: 1
                              }
                            }}
                            className="product-overlay"
                          >
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${product.id}`);
                                }}
                                sx={{ 
                                  minWidth: 'auto', 
                                  p: 1,
                                  backgroundColor: 'white',
                                  color: '#333',
                                  '&:hover': {
                                    backgroundColor: '#f0f0f0'
                                  }
                                }}
                              >
                                <Visibility />
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ 
                                  minWidth: 'auto', 
                                  p: 1,
                                  backgroundColor: '#ff6b6b',
                                  '&:hover': {
                                    backgroundColor: '#ff5252'
                                  }
                                }}
                              >
                                <Favorite />
                              </Button>
                            </Stack>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#82ca9d', 
                                fontWeight: 700 
                              }}
                            >
                              {product.variants?.[0]?.price?.toLocaleString('vi-VN')}₫
                            </Typography>
                            {product.variants?.[0]?.price && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  textDecoration: 'line-through',
                                  color: 'text.secondary'
                                }}
                              >
                                {(product.variants[0].price * 1.2).toLocaleString('vi-VN')}₫
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
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