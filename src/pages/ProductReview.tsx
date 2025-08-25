import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  TextField,
  Stack,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Send
} from '@mui/icons-material';
import { Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import { commentService } from '../services/comment.service';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    thumbnail: string;
  };
  quantity: number;
  price: number;
}

interface ReviewData {
  rating: number;
  comment: string;
}

const ProductReview = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [review, setReview] = useState<ReviewData>({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (orderId) {
      fetchOrderItems();
    }
  }, [orderId]);

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      // Get order detail which should include items
      const response = await orderService.getOrderById(parseInt(orderId!));
      const orderData = response.data;
      const items = orderData.items || orderData.order_items || [];
      
      if (items.length === 0) {
        showSnackbar('Không tìm thấy sản phẩm trong đơn hàng!', 'error');
        return;
      }
      
      setOrderItems(items);
    } catch (error) {
      console.error('Error fetching order items:', error);
      showSnackbar('Có lỗi khi tải thông tin đơn hàng!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleRatingChange = (rating: number) => {
    setReview(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (comment: string) => {
    setReview(prev => ({ ...prev, comment }));
  };



  const handleSubmitReviews = async () => {
    setSubmitting(true);
    try {
      if (review.comment.trim().length === 0) {
        showSnackbar('Vui lòng viết đánh giá!', 'error');
        return;
      }

      // Get unique products from order items
      const uniqueProducts = Array.from(new Set(orderItems.map(item => item.product.id)));
      
      // Submit review for each unique product
      for (const productId of uniqueProducts) {
        await commentService.addReview({
          product_id: productId,
          content: review.comment,
          rating: review.rating,
          order_id: parseInt(orderId!)
        });
      }

      showSnackbar('Đánh giá đã được gửi thành công!', 'success');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      console.error('Error submitting reviews:', error);
      showSnackbar('Có lỗi xảy ra khi gửi đánh giá!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: 'Rất không hài lòng',
      2: 'Không hài lòng', 
      3: 'Bình thường',
      4: 'Hài lòng',
      5: 'Rất hài lòng'
    };
    return texts[rating as keyof typeof texts];
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin đơn hàng...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', py: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/orders')}
              sx={{ color: 'text.secondary' }}
            >
              Quay lại
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Đánh giá sản phẩm
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          <Typography variant="body2">
            Đánh giá của bạn sẽ giúp những khách hàng khác có thêm thông tin tham khảo khi mua sắm.
          </Typography>
        </Alert>

        {/* Products List */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Sản phẩm trong đơn hàng:
            </Typography>
            <Stack spacing={2}>
              {orderItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <img
                    src={item.product.thumbnail?.startsWith('http') 
                      ? item.product.thumbnail 
                      : `http://127.0.0.1:8000/storage/products/${item.product.thumbnail?.replace('products/', '') || 'placeholder.jpg'}`
                    }
                    alt={item.product.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Số lượng: {item.quantity}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Single Review Form */}
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Đánh giá đơn hàng:
            </Typography>
            
            {/* Rating */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                Đánh giá chất lượng:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Rating
                  value={review.rating}
                  onChange={(_, value) => handleRatingChange(value || 5)}
                  size="large"
                  sx={{ fontSize: '2rem' }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                  {getRatingText(review.rating)}
                </Typography>
              </Box>
            </Box>

            {/* Comment */}
            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                Chia sẻ thêm về đơn hàng:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Hãy chia sẻ cảm nhận của bạn về các sản phẩm trong đơn hàng này..."
                value={review.comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {review.comment.length}/500 ký tự
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={handleSubmitReviews}
            disabled={submitting}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049'
              }
            }}
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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

export default ProductReview;