import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  Stack,
  Chip,
  Avatar,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Verified,
  ThumbUp,
  Comment,
  Share,
  ShoppingBag
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { commentService } from '../services/comment.service';
import { productService } from '../services/product.service';

const ReviewDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    if (productId) {
      fetchData();
    }
  }, [productId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsData, productData] = await Promise.all([
        commentService.getReviews(parseInt(productId!)),
        productService.getProductById(parseInt(productId!))
      ]);

      setReviews(reviewsData);
      setProduct(productData.data);

      // Calculate rating stats
      if (reviewsData.length > 0) {
        const total = reviewsData.length;
        const sum = reviewsData.reduce((acc: number, review: any) => acc + review.rating, 0);
        const average = sum / total;
        
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach((review: any) => {
          breakdown[review.rating as keyof typeof breakdown]++;
        });

        setRatingStats({ average, total, breakdown });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    return (
      <Rating
        value={rating}
        readOnly
        precision={0.1}
        size={size}
        sx={{ color: '#ffc107' }}
      />
    );
  };

  const getRatingText = (rating: number) => {
    const texts = {
      5: 'Xuất sắc',
      4: 'Tốt',
      3: 'Bình thường',
      2: 'Kém',
      1: 'Rất kém'
    };
    return texts[rating as keyof typeof texts] || 'Không xác định';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">Không tìm thấy sản phẩm</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', py: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/product/${productId}`)}
              sx={{ color: 'text.secondary' }}
            >
              Quay lại sản phẩm
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <img
              src={product.thumbnail || '/placeholder-image.jpg'}
              alt={product.name}
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Đánh giá sản phẩm
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {product.name}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Rating Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Tổng quan đánh giá
                </Typography>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {ratingStats.average.toFixed(1)}
                  </Typography>
                  {renderStars(ratingStats.average, 'large')}
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Dựa trên {ratingStats.total} đánh giá
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Rating Breakdown */}
                {[5, 4, 3, 2, 1].map(star => (
                  <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                      <Typography variant="body2">{star}</Typography>
                      <Star sx={{ fontSize: 16, color: '#ffc107', ml: 0.5 }} />
                    </Box>
                    <Box sx={{ 
                      flex: 1, 
                      height: 8, 
                      backgroundColor: '#e0e0e0', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        height: '100%', 
                        backgroundColor: '#ffc107',
                        width: `${ratingStats.total > 0 ? (ratingStats.breakdown[star as keyof typeof ratingStats.breakdown] / ratingStats.total) * 100 : 0}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'right' }}>
                      {ratingStats.breakdown[star as keyof typeof ratingStats.breakdown]}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Reviews List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Tất cả đánh giá ({reviews.length})
            </Typography>

            {reviews.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Chưa có đánh giá nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy là người đầu tiên đánh giá sản phẩm này
                </Typography>
              </Card>
            ) : (
              <Stack spacing={3}>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {review.user_name.charAt(0).toUpperCase()}
                          </Avatar>
                          
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {review.user_name}
                              </Typography>
                              {review.order_id && (
                                <Chip
                                  icon={<Verified />}
                                  label="Đã mua hàng"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              {renderStars(review.rating, 'small')}
                              <Chip
                                label={getRatingText(review.rating)}
                                size="small"
                                sx={{ 
                                  bgcolor: review.rating >= 4 ? 'success.light' : 
                                           review.rating >= 3 ? 'warning.light' : 'error.light',
                                  color: 'white'
                                }}
                              />
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(review.created_at)}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                          {review.content}
                        </Typography>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            {review.images.map((image: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={image}
                                alt={`Review ${imgIndex + 1}`}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  cursor: 'pointer'
                                }}
                              />
                            ))}
                          </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Review Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Button
                            size="small"
                            startIcon={<ThumbUp />}
                            sx={{ color: 'text.secondary' }}
                          >
                            Hữu ích (0)
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Comment />}
                            sx={{ color: 'text.secondary' }}
                          >
                            Trả lời
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Share />}
                            sx={{ color: 'text.secondary' }}
                          >
                            Chia sẻ
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReviewDetail;