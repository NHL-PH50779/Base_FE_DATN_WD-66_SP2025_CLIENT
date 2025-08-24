import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { wishlistService } from '../services/wishlist.service';
import { productService } from '../services/product.service';
import { useCartStore } from '../stores/cart.store';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product.type';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { wishlistCount } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Refresh khi wishlistCount thay đổi
  useEffect(() => {
    if (!loading) {
      fetchWishlist();
    }
  }, [wishlistCount]);
  
  // Lắng nghe thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, refreshing wishlist');
      fetchWishlist();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event cho cùng tab
    window.addEventListener('wishlistChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlistChanged', handleStorageChange);
    };
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const wishlistResponse = await wishlistService.getWishlist();
      const productIds = wishlistResponse.data || [];
      
      console.log('Wishlist productIds:', productIds);
      
      if (productIds.length > 0) {
        const productPromises = productIds.map(id => productService.getProductById(id));
        const productResponses = await Promise.all(productPromises);
        
        const wishlistProducts = productResponses
          .map(response => response.data)
          .filter(product => product !== null);
        
        console.log('Wishlist products:', wishlistProducts);
        setWishlistProducts(wishlistProducts);
      } else {
        setWishlistProducts([]);
      }
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Không thể tải danh sách yêu thích');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId: number) => {
    // Xóa sản phẩm khỏi danh sách hiển thị
    setWishlistProducts(prev => prev.filter(product => product.id !== productId));
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Đang tải danh sách yêu thích...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            ❤️ Sản phẩm yêu thích
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {wishlistProducts.length} sản phẩm trong danh sách yêu thích
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {wishlistProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
              🤍 Chưa có sản phẩm yêu thích
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Hãy thêm những sản phẩm bạn yêu thích để dễ dàng tìm lại sau này!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/shop')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5
              }}
            >
              Khám phá sản phẩm
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {wishlistProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard 
                  product={product} 
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Wishlist;