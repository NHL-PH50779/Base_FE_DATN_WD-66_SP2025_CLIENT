import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Stack,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocalFireDepartment, Timer } from '@mui/icons-material';
import { flashSaleService } from '../services/flashSale.service';
import type { FlashSaleData, UpcomingFlashSale } from '../services/flashSale.service';
import FlashSalePurchase from './FlashSalePurchase';
import FastProductCard from './FastProductCard';

const FlashSale: React.FC = () => {
  const [flashSale, setFlashSale] = useState<FlashSaleData | null>(null);
  const [upcomingFlashSale, setUpcomingFlashSale] = useState<UpcomingFlashSale | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [purchaseDialog, setPurchaseDialog] = useState<{
    open: boolean;
    productId: number;
    productName: string;
  }>({ open: false, productId: 0, productName: '' });

  const fetchCurrentFlashSale = useCallback(async (forceRefresh = false) => {
    try {
      const response = await flashSaleService.getCurrentFlashSale(forceRefresh);
      if (response.data) {
        if (response.data.items && Array.isArray(response.data.items) && response.data.items.length > 0) {
          setFlashSale(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching current flash sale:', error);
    }
  }, []);

  const fetchUpcomingFlashSale = async () => {
    try {
      const response = await flashSaleService.getUpcomingFlashSale();
      if (response.data) {
        setUpcomingFlashSale(response.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming flash sale:', error);
    }
  };

  useEffect(() => {
    fetchCurrentFlashSale();
    fetchUpcomingFlashSale();
    
    // Thiết lập interval để cập nhật dữ liệu mỗi 5 giây
    const intervalId = setInterval(() => {
      fetchCurrentFlashSale(true);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [fetchCurrentFlashSale]);

  // Tính toán thời gian còn lại
  const calculateTimeLeft = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;
    
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { hours, minutes, seconds, total: difference };
    }
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  };

  // Cập nhật đồng hồ đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      
      if (flashSale && flashSale.end_time) {
        const timeData = calculateTimeLeft(flashSale.end_time);
        setTimeLeft(timeData);
        
        if (timeData.total <= 0) {
          fetchCurrentFlashSale();
          fetchUpcomingFlashSale();
        }
      } else if (upcomingFlashSale && upcomingFlashSale.start_time) {
        const timeData = calculateTimeLeft(upcomingFlashSale.start_time);
        setTimeLeft(timeData);
        
        if (timeData.total <= 0) {
          fetchCurrentFlashSale();
          fetchUpcomingFlashSale();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale, upcomingFlashSale]);

  // Khởi tạo thời gian ban đầu
  useEffect(() => {
    if (flashSale && flashSale.end_time) {
      const timeData = calculateTimeLeft(flashSale.end_time);
      setTimeLeft(timeData);
    } else if (upcomingFlashSale && upcomingFlashSale.start_time) {
      const timeData = calculateTimeLeft(upcomingFlashSale.start_time);
      setTimeLeft(timeData);
    }
  }, [flashSale, upcomingFlashSale]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePurchaseSuccess = () => {
    // Refresh flash sale data after successful purchase
    fetchCurrentFlashSale(true); // Force refresh ngay lập tức
  };

  // Hiển thị Flash Sale sắp diễn ra
  if (upcomingFlashSale && !flashSale) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)', 
        py: 3,
        color: '#333'
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#FF6B6B' }}>
                <Timer sx={{ mr: 1, fontSize: 32 }} />
                Flash Sale Sắp Diễn Ra
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                {upcomingFlashSale.name}
              </Typography>
              
              {/* Đồng hồ đếm ngược */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                {['hours', 'minutes', 'seconds'].map((unit, index) => (
                  <Box key={unit} sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      background: 'rgba(255,107,107,0.1)',
                      borderRadius: 2,
                      p: 1.5,
                      minWidth: 60
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                        {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {unit === 'hours' ? 'Giờ' : unit === 'minutes' ? 'Phút' : 'Giây'}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Hiển thị Flash Sale đang diễn ra
  if (!flashSale || !flashSale.items || !flashSale.items.length) {
    return null;
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)', 
      py: 4,
      color: '#333'
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 3,
            py: 2,
            px: 3,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.1)'
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, color: '#FF6B6B' }}>
              <LocalFireDepartment sx={{ mr: 1.5, fontSize: 36 }} />
              {flashSale.name}
            </Typography>
            
            {/* Đồng hồ đếm ngược */}
            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 1 }}>
              <Chip 
                label="KẾT THÚC TRONG" 
                size="small"
                sx={{ 
                  background: 'rgba(255,107,107,0.1)', 
                  color: '#FF6B6B',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }} 
              />
              {['hours', 'minutes', 'seconds'].map((unit, index) => (
                <Box key={unit} sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    background: 'rgba(255,107,107,0.1)',
                    borderRadius: 2,
                    p: 1,
                    minWidth: 50
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#FF6B6B' }}>
                      {String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, '0')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                    {unit === 'hours' ? 'Giờ' : unit === 'minutes' ? 'Phút' : 'Giây'}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {flashSale.items && flashSale.items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id} sx={{ height: 384 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                    <FastProductCard 
                      product={{
                        ...item.product,
                        price: item.sale_price,
                        originalPrice: item.original_price,
                        isFlashSale: true,
                        flashSaleItemId: item.id,
                        flashSaleData: {
                          sold_quantity: item.sold_quantity,
                          remaining_quantity: item.remaining_quantity,
                          sold_percentage: item.sold_percentage,
                          discount_percentage: item.discount_percentage
                        }
                      }}
                      onPurchaseSuccess={handlePurchaseSuccess}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      
      {/* Flash Sale Purchase Dialog */}
      <FlashSalePurchase
        open={purchaseDialog.open}
        onClose={() => setPurchaseDialog({ open: false, productId: 0, productName: '' })}
        productId={purchaseDialog.productId}
        productName={purchaseDialog.productName}
        onSuccess={handlePurchaseSuccess}
      />
    </Box>
  );
};

export default FlashSale;