import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Stack,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  TextField
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Cancel,
  Assignment,
  Person,
  LocationOn,
  Phone,
  Email,
  CreditCard,
  Receipt,
  Inventory,
  LocalOffer,
  Schedule,
  Done,
  HourglassEmpty
} from '@mui/icons-material';

import { orderService } from '../services/order.service';

interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    thumbnail: string;
  };
  product_variant?: {
    id: number;
    name: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  order_status_id: number;
  payment_status_id: number;
  payment_method: string;
  total: number;
  shipping_fee: number;
  discount_amount: number;
  voucher_code?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
  created_at: string;
  updated_at: string;
  cancel_requested?: boolean;
  cancel_reason?: string;
  items: OrderItem[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', title: '', message: '' });
  const [cancelReason, setCancelReason] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Order status mapping with timeline
  const orderStatuses = {
    1: { label: 'Chờ xác nhận', color: 'warning', icon: <HourglassEmpty />, description: 'Đơn hàng đang chờ được xác nhận' },
    2: { label: 'Đã xác nhận', color: 'info', icon: <Assignment />, description: 'Đơn hàng đã được xác nhận và đang chuẩn bị' },
    3: { label: 'Đang vận chuyển', color: 'primary', icon: <LocalShipping />, description: 'Đơn hàng đang trên đường giao đến bạn' },
    4: { label: 'Đã giao hàng', color: 'success', icon: <CheckCircle />, description: 'Đơn hàng đã được giao thành công' },
    5: { label: 'Hoàn thành', color: 'success', icon: <Done />, description: 'Đơn hàng đã hoàn thành' },
    6: { label: 'Đã hủy', color: 'error', icon: <Cancel />, description: 'Đơn hàng đã bị hủy' },
    7: { label: 'Yêu cầu hoàn hàng', color: 'warning', icon: <HourglassEmpty />, description: 'Yêu cầu hoàn hàng đang chờ xử lý' },
    8: { label: 'Đồng ý hoàn hàng', color: 'success', icon: <CheckCircle />, description: 'Yêu cầu hoàn hàng đã được chấp nhận và hoàn tiền' },
    9: { label: 'Từ chối hoàn hàng', color: 'error', icon: <Cancel />, description: 'Yêu cầu hoàn hàng đã bị từ chối' }
  };

  // Hiển thị trạng thái đặc biệt
  const getDisplayStatus = (order: Order) => {
    if (order.cancel_requested && order.order_status_id !== 6) {
      return { label: 'Đang chờ duyệt hủy', color: 'warning', icon: <HourglassEmpty />, description: 'Yêu cầu hủy đang chờ admin xác nhận' };
    }
    return orderStatuses[order.order_status_id as keyof typeof orderStatuses];
  };

  // Payment status mapping
  const paymentStatuses = {
    1: { label: 'Chưa thanh toán', color: 'warning' },
    2: { label: 'Đã thanh toán', color: 'success' },
    3: { label: 'Đã hoàn tiền', color: 'info' }
  };

  // Helper function để lấy trạng thái thanh toán hiển thị
  const getDisplayPaymentStatus = (order: Order) => {
    // Nếu đơn hàng đã hoàn thành, tự động hiển thị "Đã thanh toán"
    if (order.order_status_id === 5) {
      return { label: 'Đã thanh toán', color: 'success' };
    }
    // Nếu đơn hàng đã được hoàn hàng (trạng thái 8), hiển thị "Đã hoàn tiền"
    if (order.order_status_id === 8) {
      return { label: 'Đã hoàn tiền', color: 'info' };
    }
    // Nếu không, hiển thị theo trạng thái thực tế
    return paymentStatuses[order.payment_status_id as keyof typeof paymentStatuses] || { label: 'Chưa thanh toán', color: 'warning' };
  };

  // Payment method mapping
  const paymentMethods = {
    'cod': 'Thanh toán khi nhận hàng',
    'vnpay': 'VNPay',
    'momo': 'MoMo',
    'bank_transfer': 'Chuyển khoản ngân hàng'
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail(parseInt(id));
      
      // Bỏ auto-refresh để tránh reload liên tục
      // const interval = setInterval(() => {
      //   fetchOrderDetail(parseInt(id));
      // }, 5000);
      
      // return () => clearInterval(interval);
    }
  }, [id]);

  const fetchOrderDetail = async (orderId: number) => {
    setLoading(true);
    try {
      const response = await orderService.getOrderById(orderId);
      const responseData = response.data?.data || response.data || response;
      
      const orderData = {
        ...responseData.order,
        items: responseData.items || responseData.order.items || [],
        total: parseFloat(responseData.total) || parseFloat(responseData.order.total) || 0,
        discount_amount: parseFloat(responseData.order.coupon_discount) || 0,
        voucher_code: responseData.order.coupon_code,
        shipping_fee: 0
      };

      setOrder(orderData);
    } catch (error: any) {
      console.error('Error fetching order detail:', error);
      if (error.response?.status === 401) {
        showSnackbar('Vui lòng đăng nhập để xem đơn hàng!', 'error');
        navigate('/login');
      } else if (error.response?.status === 404) {
        showSnackbar('Không tìm thấy đơn hàng!', 'error');
        navigate('/orders');
      } else {
        showSnackbar('Có lỗi khi tải thông tin đơn hàng!', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleConfirmReceived = () => {
    setConfirmDialog({
      open: true,
      action: 'confirm_received',
      title: 'Xác nhận đã nhận hàng',
      message: 'Bạn có chắc chắn đã nhận được hàng? Hành động này không thể hoàn tác.'
    });
  };

  const handleCancelOrder = () => {
    setConfirmDialog({
      open: true,
      action: 'cancel_order',
      title: 'Hủy đơn hàng',
      message: 'Bạn có chắc chắn muốn hủy đơn hàng này?'
    });
  };

  const handleRequestRefund = () => {
    setConfirmDialog({
      open: true,
      action: 'request_refund',
      title: 'Yêu cầu hoàn hàng',
      message: 'Vui lòng nhập lý do hoàn hàng:'
    });
  };

  const handleRequestCancelVnpay = () => {
    setConfirmDialog({
      open: true,
      action: 'request_cancel_vnpay',
      title: 'Yêu cầu hủy đơn VNPay',
      message: 'Vui lòng nhập lý do hủy đơn hàng:'
    });
  };

  const executeAction = async () => {
    if (!order) return;

    try {
      if (confirmDialog.action === 'confirm_received') {
        await orderService.confirmReceived(order.id);
        showSnackbar('Đã xác nhận nhận hàng thành công!', 'success');
        await fetchOrderDetail(order.id);
      } else if (confirmDialog.action === 'cancel_order') {
        await orderService.cancelOrder(order.id, 'Khách hàng yêu cầu hủy');
        showSnackbar('Đã hủy đơn hàng thành công!', 'success');
        await fetchOrderDetail(order.id);
      } else if (confirmDialog.action === 'request_refund') {
        if (!refundReason.trim()) {
          showSnackbar('Vui lòng nhập lý do hoàn hàng!', 'error');
          return;
        }
        await orderService.requestRefund(order.id, refundReason);
        showSnackbar('Đã gửi yêu cầu hoàn hàng thành công!', 'success');
        await fetchOrderDetail(order.id);
        setRefundReason('');
      } else if (confirmDialog.action === 'request_cancel_vnpay') {
        if (!cancelReason.trim()) {
          showSnackbar('Vui lòng nhập lý do hủy!', 'error');
          return;
        }
        await orderService.requestCancelVnpay(order.id, cancelReason);
        showSnackbar('Đã gửi yêu cầu hủy đơn hàng thành công!', 'success');
        await fetchOrderDetail(order.id);
        setCancelReason('');
      }
    } catch (error: any) {
      console.error('Error executing action:', error);
      showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
      setConfirmDialog({ open: false, action: '', title: '', message: '' });
      setCancelReason('');
      setRefundReason('');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const getImageUrl = (thumbnail?: string) => {
    if (!thumbnail) return 'https://via.placeholder.com/80x80/e0e0e0/666?text=No+Image';
    if (thumbnail.startsWith('http')) return thumbnail;
    // Xử lý đường dẫn ảnh từ backend
    const cleanPath = thumbnail.replace(/^products\//, '');
    return `http://127.0.0.1:8000/storage/products/${cleanPath}`;
  };

  const canCancelOrder = (order: Order) => {
    return order.order_status_id === 1; // Chỉ cho phép hủy khi chờ xác nhận
  };

  const canRequestCancelVnpay = (order: Order) => {
    return order.payment_method === 'vnpay' && 
           order.payment_status_id === 2 && 
           (order.order_status_id === 1 || order.order_status_id === 2) &&
           !order.cancel_requested;
  };

  const canConfirmReceived = (order: Order) => {
    return order.order_status_id === 4;
  };

  const canRequestRefund = (order: Order) => {
    return (order.order_status_id === 4 || order.order_status_id === 5) && 
           order.order_status_id !== 7 && 
           order.order_status_id !== 8 && 
           order.order_status_id !== 9;
  };



  const getOrderTimeline = () => {
    const currentStatus = order?.order_status_id || 1;
    const timelineSteps = [
      { id: 1, label: 'Đặt hàng', icon: <Assignment />, time: order?.created_at },
      { id: 2, label: 'Xác nhận', icon: <CheckCircle />, time: currentStatus >= 2 ? order?.updated_at : null },
      { id: 3, label: 'Vận chuyển', icon: <LocalShipping />, time: currentStatus >= 3 ? order?.updated_at : null },
      { id: 4, label: 'Giao hàng', icon: <Done />, time: currentStatus >= 4 ? order?.updated_at : null }
    ];

    return timelineSteps;
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin đơn hàng...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Không tìm thấy đơn hàng
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Quay lại danh sách đơn hàng
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/orders')}
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Quay lại
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Đơn hàng #{order.id}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Đặt hàng lúc {formatDate(order.created_at)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={getDisplayStatus(order)?.icon}
                label={getDisplayStatus(order)?.label}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip
                label={getDisplayPaymentStatus(order).label}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white'
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Order Timeline */}
            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(90deg, #f8fafc 0%, #e3f2fd 100%)', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                  Trạng thái đơn hàng
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {getOrderTimeline().map((step, index) => (
                    <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: order.order_status_id >= step.id ? 'primary.main' : 'grey.300',
                          color: order.order_status_id >= step.id ? 'white' : 'grey.600'
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: order.order_status_id >= step.id ? 600 : 400,
                            color: order.order_status_id >= step.id ? 'text.primary' : 'text.secondary'
                          }}
                        >
                          {step.label}
                        </Typography>
                        {step.time && order.order_status_id >= step.id && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(step.time)}
                          </Typography>
                        )}
                      </Box>
                      {index < getOrderTimeline().length - 1 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 2,
                            backgroundColor: order.order_status_id > step.id ? 'primary.main' : 'grey.300',
                            mx: 1
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(90deg, #f8fafc 0%, #fff3e0 100%)', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Inventory sx={{ mr: 1, color: 'primary.main' }} />
                  Sản phẩm đã đặt ({order.items.length} sản phẩm)
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <Box key={item.id}>
                      <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
                        <Box
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(item.product?.thumbnail)}
                            alt={item.product?.name || 'Sản phẩm'}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/80x80/e0e0e0/666?text=No+Image';
                            }}
                            onLoad={() => {
                              // Ảnh đã load thành công
                            }}
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {item.product?.name || 'Sản phẩm'}
                          </Typography>
                          {item.product_variant && (
                            <Chip
                              label={`Phân loại: ${item.product_variant.name}`}
                              size="small"
                              variant="outlined"
                              sx={{ mb: 2 }}
                            />
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              Đơn giá: <strong>{formatPrice(item.price)}</strong>
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              Số lượng: <strong>{item.quantity}</strong>
                            </Typography>
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                              {formatPrice(item.price * item.quantity)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < order.items.length - 1 && <Divider />}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Chưa có thông tin sản phẩm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thông tin sản phẩm sẽ được cập nhật sau
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(90deg, #f8fafc 0%, #e8f5e8 100%)', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                  Thông tin giao hàng
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Người nhận</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.name || 'Chưa cập nhật'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.phone || 'Chưa cập nhật'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {order.email && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Email sx={{ mr: 2, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.email}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                  
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOn sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Địa chỉ giao hàng</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{order.address || 'Chưa cập nhật'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {order.note && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, borderLeft: '4px solid #2196F3' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ghi chú:</Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"{order.note}"</Typography>
                      </Box>
                    </Grid>
                  )}
                  
                  {order.cancel_requested && order.cancel_reason && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, borderLeft: '4px solid #ff9800' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Lý do yêu cầu hủy:</Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>"{order.cancel_reason}"</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Order Summary */}
            <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(90deg, #f8fafc 0%, #fce4ec 100%)', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                  Tóm tắt đơn hàng
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, backgroundColor: '#f0f7ff', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Mã đơn hàng</Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.main">#{order.id}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Đặt lúc: {formatDate(order.created_at)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Giá trị đơn hàng:</Typography>
                    <Typography fontWeight={600} color="primary.main">
                      {formatPrice(order.total)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tạm tính:</Typography>
                    <Typography fontWeight={600}>
                      {formatPrice(order.total - (order.shipping_fee || 0) + (order.discount_amount || 0))}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography fontWeight={600} color={order.shipping_fee > 0 ? 'text.primary' : 'success.main'}>
                      {order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : 'Miễn phí'}
                    </Typography>
                  </Box>
                  
                  {order.discount_amount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Giảm giá:</Typography>
                      <Typography fontWeight={600} color="success.main">
                        -{formatPrice(order.discount_amount)}
                      </Typography>
                    </Box>
                  )}
                  
                  {order.voucher_code && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #c8e6c9' }}>
                      <LocalOffer sx={{ color: 'success.main' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="success.dark">Mã giảm giá</Typography>
                        <Typography variant="body2" fontWeight={600}>{order.voucher_code}</Typography>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Thanh toán:</Typography>
                    <Typography fontWeight={600}>
                      {paymentMethods[order.payment_method as keyof typeof paymentMethods] || order.payment_method || 'Chưa xác định'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Trạng thái:</Typography>
                    <Chip
                      icon={getDisplayStatus(order)?.icon}
                      label={getDisplayStatus(order)?.label}
                      color={getDisplayStatus(order)?.color as any}
                      size="small"
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 2, color: 'white' }}>
                    <Typography variant="h6" fontWeight={700}>Tổng thanh toán:</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {formatPrice(order.total)}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, border: '1px solid #ffcc02' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>💡 Thông tin thêm</Typography>
                    <Typography variant="caption" color="text.secondary">
                      • Đơn hàng được bảo hành theo chính sách của từng sản phẩm<br/>
                      • Liên hệ hotline 1900-xxxx nếu cần hỗ trợ<br/>
                      • Thời gian giao hàng: 1-3 ngày làm việc
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(90deg, #f8fafc 0%, #fff8e1 100%)', p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                  Thanh toán
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Phương thức thanh toán</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {paymentMethods[order.payment_method as keyof typeof paymentMethods] || order.payment_method || 'Chưa xác định'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Trạng thái thanh toán</Typography>
                    <Chip
                      label={getDisplayPaymentStatus(order).label}
                      color={getDisplayPaymentStatus(order).color as any}
                      size="small"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Thao tác
                </Typography>
                
                <Stack spacing={2}>
                  {canConfirmReceived(order) && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleConfirmReceived}
                      startIcon={<CheckCircle />}
                      sx={{ py: 1.5 }}
                    >
                      Đã nhận hàng
                    </Button>
                  )}
                  
                  {canCancelOrder(order) && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={handleCancelOrder}
                      startIcon={<Cancel />}
                      sx={{ py: 1.5 }}
                    >
                      Hủy đơn hàng
                    </Button>
                  )}
                  
                  {canRequestRefund(order) && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      size="large"
                      onClick={handleRequestRefund}
                      startIcon={<LocalOffer />}
                      sx={{ py: 1.5 }}
                    >
                      Yêu cầu hoàn hàng
                    </Button>
                  )}
                  
                  {canRequestCancelVnpay(order) && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      size="large"
                      onClick={handleRequestCancelVnpay}
                      startIcon={<Cancel />}
                      sx={{ py: 1.5 }}
                    >
                      Yêu cầu hủy đơn VNPay
                    </Button>
                  )}
                  

                  
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Receipt />}
                    onClick={() => window.print()}
                    sx={{ py: 1.5 }}
                  >
                    In hóa đơn
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => {
          setConfirmDialog({ open: false, action: '', title: '', message: '' });
          setCancelReason('');
          setRefundReason('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>{confirmDialog.message}</Typography>
          {confirmDialog.action === 'request_cancel_vnpay' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do hủy"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              required
            />
          )}
          {confirmDialog.action === 'request_refund' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do hoàn hàng"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Nhập lý do hoàn hàng..."
              required
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => {
              setConfirmDialog({ open: false, action: '', title: '', message: '' });
              setCancelReason('');
              setRefundReason('');
            }}
            size="large"
          >
            Hủy
          </Button>
          <Button 
            onClick={executeAction} 
            color="primary" 
            variant="contained"
            size="large"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

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

export default OrderDetail;