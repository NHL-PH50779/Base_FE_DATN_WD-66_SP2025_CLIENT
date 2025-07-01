import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocalFireDepartment, Timer } from '@mui/icons-material';
import { flashSaleService } from '../services/flashSale.service';
import type { FlashSaleData, UpcomingFlashSale } from '../services/flashSale.service';
import FlashSalePurchase from './FlashSalePurchase';
import ProductCard from './ProductCard';



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

  const fetchCurrentFlashSale = async () => {
    try {
      const response = await flashSaleService.getCurrentFlashSale();
      if (response.data) {
        console.log('Flash Sale Data:', response.data);
        setFlashSale(response.data);
      }
    } catch (error) {
      console.error('Error fetching current flash sale:', error);
    }
  };

  const fetchUpcomingFlashSale = async () => {
    try {
      const response = await flashSaleService.getUpcomingFlashSale();
      if (response.data) {
        console.log('Upcoming Flash Sale Data:', response.data);
        setUpcomingFlashSale(response.data);
      }
    } catch (error) {
      console.error('Error fetching upcoming flash sale:', error);
    }
  };

  useEffect(() => {
    fetchCurrentFlashSale();
    fetchUpcomingFlashSale();
  }, []);

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
          // Flash sale đã kết thúc, tải lại dữ liệu
          fetchCurrentFlashSale();
          fetchUpcomingFlashSale();
        }
      } else if (upcomingFlashSale && upcomingFlashSale.start_time) {
        const timeData = calculateTimeLeft(upcomingFlashSale.start_time);
        setTimeLeft(timeData);
        
        if (timeData.total <= 0) {
          // Flash sale sắp tới đã bắt đầu, tải lại dữ liệu
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

  const handleBuyNow = (productId: number, productName: string) => {
    setPurchaseDialog({
      open: true,
      productId,
      productName
    });
  };

  const handleClosePurchaseDialog = () => {
    setPurchaseDialog({ open: false, productId: 0, productName: '' });
  };

  const handlePurchaseSuccess = () => {
    // Refresh flash sale data after successful purchase
    fetchCurrentFlashSale();
  };

  // Hiển thị Flash Sale sắp diễn ra
  if (upcomingFlashSale && !flashSale) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
        py: 6,
        color: 'white'
      }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                <Timer sx={{ mr: 1, fontSize: 40 }} />
                Flash Sale Sắp Diễn Ra
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                {upcomingFlashSale.name}
              </Typography>
              
              {/* Đồng hồ đếm ngược */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                {['hours', 'minutes', 'seconds'].map((unit, index) => (
                  <Box key={unit} sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      p: 2,
                      minWidth: 80
                    }}>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
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
  if (!flashSale || !flashSale.items.length) {
    return null;
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
      py: 8,
      color: 'white'
    }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              <LocalFireDepartment sx={{ mr: 2, fontSize: 50 }} />
              {flashSale.name}
            </Typography>
            
            {/* Đồng hồ đếm ngược */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Chip 
                label="KẾT THÚC TRONG" 
                sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              {['hours', 'minutes', 'seconds'].map((unit, index) => (
                <Box key={unit} sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 1.5,
                    minWidth: 60
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
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
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            {flashSale.items.slice(0, 8).map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={item.id} sx={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  style={{ width: '100%' }}
                >
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    {/* Flash Sale Badge */}
                    <Chip
                      label={`🔥 -${item.discount_percentage}%`}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'linear-gradient(45deg, #ff4757 30%, #ff3742 90%)',
                        color: 'white',
                        fontWeight: 700,
                        zIndex: 10,
                        fontSize: '0.75rem'
                      }}
                    />
                    

                    
                    <ProductCard 
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
        onClose={handleClosePurchaseDialog}
        productId={purchaseDialog.productId}
        productName={purchaseDialog.productName}
        onSuccess={handlePurchaseSuccess}
      />
    </Box>
  );
};

export default FlashSale;