import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Avatar,
  Divider,
  IconButton,
  Fade,
  Slide
} from '@mui/material';
import {
  ShoppingBag,
  Visibility,
  LocalShipping,
  CheckCircle,
  Schedule,
  Cancel,
  Payment,
  Receipt,
  ArrowBack
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth/auth.service';
import { useNavigate, useParams } from 'react-router-dom';

interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    thumbnail?: string;
  };
  product_variant?: {
    id: number;
    name: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  order_status_id: number;
  payment_status_id: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const statusLabels = {
  1: { label: 'Chờ xác nhận', color: 'warning', icon: Schedule },
  2: { label: 'Đã xác nhận', color: 'info', icon: CheckCircle },
  3: { label: 'Đang giao', color: 'primary', icon: LocalShipping },
  4: { label: 'Đã giao', color: 'success', icon: CheckCircle },
  5: { label: 'Đã hủy', color: 'error', icon: Cancel }
};

const paymentLabels = {
  1: { label: 'Chưa thanh toán', color: 'default', icon: Schedule },
  2: { label: 'Đã thanh toán', color: 'success', icon: Payment },
  3: { label: 'Hoàn tiền', color: 'warning', icon: Receipt }
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchOrders();
      if (id) {
        fetchOrderDetail(parseInt(id));
      }
    }
  }, [id]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (orderId: number) => {
    try {
      const response = await orderService.getOrderDetail(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getImageUrl = (thumbnail?: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://127.0.0.1:8000/storage/products/${thumbnail.replace('products/', '')}`;
  };

  if (!authService.isAuthenticated()) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center">
            <ShoppingBag sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Vui lòng đăng nhập
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Bạn cần đăng nhập để xem đơn hàng
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5 }}
            >
              Đăng nhập ngay
            </Button>
          </Box>
        </motion.div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // Hiển thị chi tiết đơn hàng nếu có ID
  if (selectedOrder) {
    const StatusIcon = statusLabels[selectedOrder.order_status_id as keyof typeof statusLabels]?.icon || Schedule;
    const PaymentIcon = paymentLabels[selectedOrder.payment_status_id as keyof typeof paymentLabels]?.icon || Schedule;
    
    return (
      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => {
                setSelectedOrder(null);
                navigate('/orders');
              }}
              sx={{ mb: 3 }}
            >
              Quay lại danh sách đơn hàng
            </Button>

            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: 3, mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Đơn hàng #{selectedOrder.id}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Chip
                      icon={<StatusIcon />}
                      label={statusLabels[selectedOrder.order_status_id as keyof typeof statusLabels]?.label}
                      color={statusLabels[selectedOrder.order_status_id as keyof typeof statusLabels]?.color as any}
                      variant="filled"
                    />
                    <Chip
                      icon={<PaymentIcon />}
                      label={paymentLabels[selectedOrder.payment_status_id as keyof typeof paymentLabels]?.label}
                      color={paymentLabels[selectedOrder.payment_status_id as keyof typeof paymentLabels]?.color as any}
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Đặt lúc: {formatDate(selectedOrder.created_at)}
                    </Typography>
                  </Stack>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Sản phẩm đã đặt
                </Typography>
                
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {selectedOrder.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          '&:hover': { backgroundColor: '#f1f5f9' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <Avatar
                          src={getImageUrl(item.product.thumbnail)}
                          alt={item.product.name}
                          sx={{ width: 60, height: 60, borderRadius: 2 }}
                          variant="rounded"
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {item.product.name}
                          </Typography>
                          {item.product_variant && (
                            <Chip
                              label={item.product_variant.name}
                              size="small"
                              sx={{ mt: 0.5, backgroundColor: '#e3f2fd' }}
                            />
                          )}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Số lượng: {item.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(item.price)}/sản phẩm
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Tổng cộng:
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    {formatPrice(selectedOrder.total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Hiển thị danh sách đơn hàng
  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Box sx={{ backgroundColor: 'white', py: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Breadcrumbs>
            <Link color="inherit" href="/" sx={{ textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Typography color="text.primary">Đơn hàng của tôi</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Đơn hàng của tôi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Theo dõi tình trạng đơn hàng của bạn
            </Typography>
          </Box>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ textAlign: 'center', py: 8, backgroundColor: 'white' }}>
                <CardContent>
                  <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Bạn chưa có đơn hàng nào
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBag />}
                    onClick={() => navigate('/shop')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Bắt đầu mua sắm
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Stack spacing={3}>
              <AnimatePresence>
                {orders.map((order, index) => {
                  const StatusIcon = statusLabels[order.order_status_id as keyof typeof statusLabels]?.icon || Schedule;
                  const PaymentIcon = paymentLabels[order.payment_status_id as keyof typeof paymentLabels]?.icon || Schedule;
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Đơn hàng #{order.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(order.created_at)}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                                {formatPrice(order.total)}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  icon={<StatusIcon />}
                                  label={statusLabels[order.order_status_id as keyof typeof statusLabels]?.label}
                                  color={statusLabels[order.order_status_id as keyof typeof statusLabels]?.color as any}
                                  size="small"
                                />
                                <Chip
                                  icon={<PaymentIcon />}
                                  label={paymentLabels[order.payment_status_id as keyof typeof paymentLabels]?.label}
                                  color={paymentLabels[order.payment_status_id as keyof typeof paymentLabels]?.color as any}
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            {order.items.slice(0, 4).map((item) => (
                              <Avatar
                                key={item.id}
                                src={getImageUrl(item.product.thumbnail)}
                                alt={item.product.name}
                                sx={{ width: 50, height: 50, borderRadius: 1.5 }}
                                variant="rounded"
                              />
                            ))}
                            {order.items.length > 4 && (
                              <Box
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 1.5,
                                  backgroundColor: '#f1f5f9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Typography variant="caption" fontWeight={600}>
                                  +{order.items.length - 4}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              {order.items.length} sản phẩm
                            </Typography>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant="contained"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  navigate(`/orders/${order.id}`);
                                }}
                                sx={{ borderRadius: 2 }}
                              >
                                Xem chi tiết
                              </Button>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </Stack>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default MyOrders;