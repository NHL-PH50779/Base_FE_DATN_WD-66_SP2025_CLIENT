import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Stack,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Star,
  ArrowBack,
  Add,
  Remove,
  ChatBubbleOutline,
  Store
} from '@mui/icons-material';
import { productService } from '../services/product.service';
import { cartService } from '../services/cart.service';
import type { Product } from '../types/product.type';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const fetchProduct = async (productId: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await productService.getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (thumbnail: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost/storage/products/${thumbnail}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (change: number) => {
    const maxStock = currentVariant?.stock || 0;
    const newQuantity = quantity + change;
    setQuantity(Math.max(1, Math.min(newQuantity, maxStock)));
  };

  const handleAddToCart = async () => {
    // Kiểm tra có giá sản phẩm không
    if (displayPrice <= 0) {
      alert('Sản phẩm chưa có giá!');
      return;
    }
    
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    if (!token) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      window.location.href = '/login';
      return;
    }
    
    setAddingToCart(true);
    try {
      await cartService.addToCart(
        product.id, 
        currentVariant?.id || null, 
        quantity, 
        displayPrice
      );
      alert('Đã thêm vào giỏ hàng!');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Container>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Container>
          <Alert severity="info">Không tìm thấy sản phẩm</Alert>
        </Container>
      </Box>
    );
  }

  const currentVariant = product.variants?.[selectedVariant];
  // Ưu tiên giá từ variant, nếu không có thì lấy từ product.price
  const displayPrice = currentVariant?.price || Number(product.price) || 0;
  const originalPrice = displayPrice * 1.3;
  const discount = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Box sx={{ backgroundColor: 'white', py: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Container>
          <Breadcrumbs sx={{ fontSize: '0.875rem' }}>
            <Link color="inherit" href="/" sx={{ color: '#2196F3', textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Link color="inherit" href="/shop" sx={{ color: '#2196F3', textDecoration: 'none' }}>
              Tất cả sản phẩm
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
              {product.name}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container sx={{ py: 2 }}>
        {/* Main Product Section */}
        <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: 3, mb: 2 }}>
          <Grid container spacing={3}>
            {/* Product Images */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                {discount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: '#2196F3',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    -{discount}%
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                  <IconButton 
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                  >
                    {isFavorite ? <Favorite sx={{ color: '#2196F3' }} /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={7}>
              <Box>
                {/* Product Name */}
                <Typography variant="h5" sx={{ fontWeight: 400, mb: 2, lineHeight: 1.4 }}>
                  {product.name}
                </Typography>

                {/* Rating & Sold */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#2196F3', fontWeight: 500 }}>
                      4.8
                    </Typography>
                    <Rating value={4.8} precision={0.1} size="small" readOnly />
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="body2" color="text.secondary">
                    <strong>2.5k</strong> Đánh giá
                  </Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="body2" color="text.secondary">
                    <strong>5.2k</strong> Đã bán
                  </Typography>
                </Box>

                {/* Price */}
                <Box sx={{ backgroundColor: '#fafafa', p: 2, borderRadius: 1, mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {discount > 0 && (
                      <Typography
                        variant="body1"
                        sx={{ 
                          textDecoration: 'line-through',
                          color: '#999',
                          fontSize: '1rem'
                        }}
                      >
                        {formatPrice(originalPrice)}
                      </Typography>
                    )}
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#2196F3', 
                        fontWeight: 500,
                        fontSize: '2rem'
                      }}
                    >
                      {formatPrice(displayPrice)}
                    </Typography>
                    {discount > 0 && (
                      <Chip 
                        label={`${discount}% GIẢM`} 
                        sx={{ 
                          backgroundColor: '#2196F3', 
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                  </Stack>
                  {quantity > 1 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Đơn giá: {formatPrice(displayPrice)} x {quantity} = {formatPrice(displayPrice * quantity)}
                    </Typography>
                  )}
                </Box>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#757575' }}>
                      Phân loại hàng
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                      gap: 2,
                      maxWidth: 600
                    }}>
                      {product.variants.map((variant, index) => (
                        <Button
                          key={variant.id}
                          variant={selectedVariant === index ? "contained" : "outlined"}
                          onClick={() => setSelectedVariant(index)}
                          sx={{
                            minWidth: 120,
                            px: 3,
                            py: 2,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            backgroundColor: selectedVariant === index ? '#2196F3' : 'white',
                            borderColor: selectedVariant === index ? '#2196F3' : '#e0e0e0',
                            color: selectedVariant === index ? 'white' : '#333',
                            borderRadius: 3,
                            boxShadow: selectedVariant === index ? '0 4px 12px rgba(33, 150, 243, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              backgroundColor: selectedVariant === index ? '#1976D2' : '#f8fafc',
                              borderColor: '#2196F3',
                              transform: 'translateY(-2px)',
                              boxShadow: selectedVariant === index ? '0 6px 16px rgba(33, 150, 243, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)'
                            },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Box sx={{ fontWeight: 600, lineHeight: 1.2, textAlign: 'center' }}>
                            {variant.Name}
                          </Box>
                          <Box sx={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 700, 
                            color: selectedVariant === index ? 'rgba(255,255,255,0.9)' : '#2196F3',
                            background: selectedVariant === index ? 'rgba(255,255,255,0.1)' : 'rgba(33, 150, 243, 0.1)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2
                          }}>
                            {formatPrice(variant.price)}
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Quantity */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#757575' }}>
                    Số lượng
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{ borderRadius: 0, px: 1 }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (currentVariant?.stock || 0)}
                        sx={{ borderRadius: 0, px: 1 }}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color={quantity >= (currentVariant?.stock || 0) ? "error" : "text.secondary"}>
                      {currentVariant?.stock || 0} sản phẩm có sẵn
                      {quantity >= (currentVariant?.stock || 0) && " (Đã chọn tối đa)"}
                    </Typography>
                  </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={addingToCart || displayPrice <= 0}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderColor: '#2196F3',
                      color: '#2196F3',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        borderColor: '#1976D2',
                        backgroundColor: '#f3f8ff'
                      }
                    }}
                  >
                    {addingToCart ? 'Đang thêm...' : 'Thêm Vào Giỏ Hàng'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Chuyển trực tiếp sang thanh toán với sản phẩm này
                      const orderData = {
                        items: [{
                          id: product.id,
                          name: product.name,
                          price: displayPrice,
                          quantity: quantity,
                          variant: currentVariant?.Name || '',
                          image: product.thumbnail
                        }],
                        total: displayPrice * quantity + 30000 // + phí ship
                      };
                      navigate('/checkout', { state: { directBuy: true, orderData } });
                    }}
                    disabled={displayPrice <= 0}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      backgroundColor: '#2196F3',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: '#1976D2'
                      }
                    }}
                  >
                    Mua Ngay
                  </Button>
                </Stack>

                {/* Shop Info */}
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Store sx={{ color: '#2196F3' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        Cửa hàng chính thức
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Online 2 giờ trước
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ChatBubbleOutline />}
                      sx={{ 
                        textTransform: 'none',
                        borderColor: '#2196F3',
                        color: '#2196F3'
                      }}
                    >
                      Chat
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Product Description */}
        <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 500 }}>
            MÔ TẢ SẢN PHẨM
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#666' }}>
            {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Đặc điểm nổi bật:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#666' }}>
                Chất lượng cao, bền bỉ theo thời gian
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#666' }}>
                Thiết kế hiện đại, sang trọng
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#666' }}>
                Bảo hành chính hãng 12 tháng
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#666' }}>
                Miễn phí vận chuyển toàn quốc
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetail;