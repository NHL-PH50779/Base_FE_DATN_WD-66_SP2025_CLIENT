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
  CardMedia
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
  Recommend
} from "@mui/icons-material";
import type { Product } from "../types/product.type";
import { productService } from "../services/product.service";
import { categoryService } from "../services/category.service";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await productService.getAllProducts();
        const allProducts = productsResponse.data || [];
        setProducts(allProducts);
        
        // Set featured products (first 8)
        setFeaturedProducts(allProducts.slice(0, 8));
        
        // Set recommended products (random 8)
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setRecommendedProducts(shuffled.slice(0, 8));
        
        // Fetch categories
        const categoriesResponse = await categoryService.getAllCategories();
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setProducts([]);
        setCategories([]);
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
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#6bb77b',
              },
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
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

      {/* Categories Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#82ca9d', 
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 1,
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
              fontWeight: 700, 
              mb: 2,
              color: '#2c3e50'
            }}
          >
            Khám phá theo danh mục
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.slice(0, 8).map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => navigate(`/shop?category=${category.id}`)}
              >
                <Box
                  sx={{
                    height: 120,
                    background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][category.id % 6]} 0%, ${['#764ba2', '#667eea', '#f5576c', '#f093fb', '#00f2fe', '#4facfe'][category.id % 6]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {category.name}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 10 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#82ca9d', 
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 1,
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
                fontWeight: 700, 
                mb: 2,
                color: '#2c3e50'
              }}
            >
              Laptop được yêu thích nhất
            </Typography>
          </Box>

          {featuredProducts.length > 0 && (
            <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
              {featuredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id} sx={{ display: 'flex' }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Recommended Products Section */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#82ca9d', 
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <Recommend /> Gợi ý cho bạn
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              color: '#2c3e50'
            }}
          >
            Có thể bạn sẽ thích
          </Typography>
        </Box>

        {recommendedProducts.length > 0 && (
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {recommendedProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id} sx={{ display: 'flex' }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* View All Products Button */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/shop')}
          sx={{
            borderColor: '#82ca9d',
            color: '#82ca9d',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            borderRadius: '30px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#82ca9d',
              color: 'white',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Xem tất cả {products.length} sản phẩm
        </Button>
      </Box>
    </Box>
  );
};

export default Home;