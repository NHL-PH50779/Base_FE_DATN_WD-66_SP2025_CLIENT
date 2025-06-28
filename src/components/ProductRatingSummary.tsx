import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface ProductRatingSummaryProps {
  productId: number;
}

const ProductRatingSummary: React.FC<ProductRatingSummaryProps> = ({ productId }) => {
  const [ratingData, setRatingData] = useState({
    averageRating: 4.5,
    totalReviews: 128,
    ratingBreakdown: {
      5: 85,
      4: 25,
      3: 12,
      2: 4,
      1: 2
    }
  });

  const getRatingPercentage = (count: number) => {
    return (count / ratingData.totalReviews) * 100;
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Đánh giá sản phẩm
        </Typography>
        
        <Grid container spacing={4}>
          {/* Overall Rating */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                {ratingData.averageRating}
              </Typography>
              <Rating 
                value={ratingData.averageRating} 
                precision={0.1} 
                readOnly 
                size="large"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {ratingData.totalReviews} đánh giá
              </Typography>
            </Box>
          </Grid>

          {/* Rating Breakdown */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {rating}
                    </Typography>
                    <Star sx={{ fontSize: 16, color: '#ffc658' }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getRatingPercentage(ratingData.ratingBreakdown[rating as keyof typeof ratingData.ratingBreakdown])}
                    sx={{ 
                      flex: 1, 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ffc658'
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                    {ratingData.ratingBreakdown[rating as keyof typeof ratingData.ratingBreakdown]}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Rating Stats */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Chip 
                label="Chất lượng tốt" 
                variant="outlined" 
                size="small"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Chip 
                label="Giao hàng nhanh" 
                variant="outlined" 
                size="small"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Chip 
                label="Giá cả hợp lý" 
                variant="outlined" 
                size="small"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Chip 
                label="Đóng gói cẩn thận" 
                variant="outlined" 
                size="small"
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductRatingSummary;