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
  PhotoCamera,
  Delete,
  ArrowBack,
  Star,
  Send
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, reviewService } from '../services/order.service';

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
  product_id: number;
  rating: number;
  comment: string;
  images: File[];
}

const ProductReview = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [reviews, setReviews] = useState<{ [key: number]: ReviewData }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderItems();
    }
  }, [orderId]);

  const fetchOrderItems = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrderDetail(parseInt(orderId!));
      const items = response.data.items || [];
      setOrderItems(items);
      
      // Initialize reviews state
      const initialReviews: { [key: number]: ReviewData } = {};
      items.forEach((item: OrderItem) => {
        initialReviews[item.product.id] = {
          product_id: item.product.id,
          rating: 5,
          comment: '',
          images: []
        };
      });
      setReviews(initialReviews);
    } catch (error) {
      console.error('Error fetching order items:', error);
      alert('Có lỗi khi tải thông tin đơn hàng!');
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

  const handleRatingChange = (productId: number, rating: number) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating
      }
    }));
  };

  const handleCommentChange = (productId: number, comment: string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment
      }
    }));
  };

  const handleImageUpload = (productId: number, files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 5); // Limit to 5 images
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: [...prev[productId].images, ...newImages].slice(0, 5)
      }
    }));
  };

  const handleRemoveImage = (productId: number, index: number) => {
    setReviews(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId].images.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmitReviews = async () => {
    setSubmitting(true);
    try {
      // Validate all reviews
      const reviewsToSubmit = Object.values(reviews).filter(review => 
        review.comment.trim().length > 0
      );

      if (reviewsToSubmit.length === 0) {
        alert('Vui lòng viết đánh giá cho ít nhất một sản phẩm!');
        return;
      }

      // Submit reviews to API
      for (const review of reviewsToSubmit) {
        const reviewData = {
          ...review,
          order_id: parseInt(orderId!)
        };
        await reviewService.submitReview(reviewData);
      }

      alert('Đánh giá đã được gửi thành công!');
      navigate('/orders');
    } catch (error) {
      console.error('Error submitting reviews:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá!');
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

        <Stack spacing={3}>
          {orderItems.map((item) => (
            <Card key={item.id} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                {/* Product Info */}
                <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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

                {/* Rating */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    Đánh giá chất lượng sản phẩm:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Rating
                      value={reviews[item.product.id]?.rating || 5}
                      onChange={(_, value) => handleRatingChange(item.product.id, value || 5)}
                      size="large"
                      sx={{ fontSize: '2rem' }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {getRatingText(reviews[item.product.id]?.rating || 5)}
                    </Typography>
                  </Box>
                </Box>

                {/* Comment */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    Chia sẻ thêm về sản phẩm:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                    value={reviews[item.product.id]?.comment || ''}
                    onChange={(e) => handleCommentChange(item.product.id, e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {reviews[item.product.id]?.comment?.length || 0}/500 ký tự
                  </Typography>
                </Box>

                {/* Images */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    Thêm hình ảnh (tối đa 5 ảnh):
                  </Typography>
                  
                  {/* Image Preview */}
                  {reviews[item.product.id]?.images?.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {reviews[item.product.id].images.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e0e0e0'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(item.product.id, index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'error.dark'
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Upload Button */}
                  {(reviews[item.product.id]?.images?.length || 0) < 5 && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCamera />}
                      sx={{ borderStyle: 'dashed' }}
                    >
                      Thêm ảnh
                      <input
                        type="file"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.product.id, e.target.files)}
                      />
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

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
    </Box>
  );
};

export default ProductReview;