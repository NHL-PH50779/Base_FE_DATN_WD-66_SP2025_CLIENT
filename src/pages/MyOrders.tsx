import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton,
  Collapse
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
  Assignment,
  Star,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order.service';
import ReturnRequestModal from '../components/ReturnRequestModal';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    thumbnail: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  order_status_id: number;
  payment_status_id: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState({ open: false, orderId: 0, reason: '' });
  const [returnDialog, setReturnDialog] = useState({ open: false, orderId: 0, reason: '' });
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Order status mapping
  const orderStatuses = {
    1: { label: 'Chờ xác nhận', color: 'warning', icon: <Assignment /> },
    2: { label: 'Đã xác nhận', color: 'info', icon: <CheckCircle /> },
    3: { label: 'Đang vận chuyển', color: 'primary', icon: <LocalShipping /> },
    4: { label: 'Đã giao hàng', color: 'success', icon: <CheckCircle /> },
    5: { label: 'Hoàn thành', color: 'success', icon: <CheckCircle /> },
    6: { label: 'Đã hủy', color: 'error', icon: <Cancel /> }
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
    // Nếu không, hiển thị theo trạng thái thực tế
    return paymentStatuses[order.payment_status_id as keyof typeof paymentStatuses] || { label: 'Chưa thanh toán', color: 'warning' };
  };

  const tabs = [
    { label: 'Tất cả', value: 0 },
    { label: 'Chờ xác nhận', value: 1 },
    { label: 'Đã xác nhận', value: 2 },
    { label: 'Đang vận chuyển', value: 3 },
    { label: 'Đã giao hàng', value: 4 },
    { label: 'Hoàn thành', value: 5 },
    { label: 'Đã hủy', value: 6 }
  ];

  useEffect(() => {
    fetchOrders(true);
    
    // Auto-refresh mỗi 10 giây để cập nhật trạng thái real-time
    const interval = setInterval(() => {
      fetchOrders(false); // Không hiển loading khi auto-refresh
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      const newOrders = response.data || [];
      
      // Kiểm tra có đơn hàng nào thay đổi trạng thái không
      if (orders.length > 0) {
        newOrders.forEach((newOrder: Order) => {
          const oldOrder = orders.find(o => o.id === newOrder.id);
          if (oldOrder && oldOrder.order_status_id !== newOrder.order_status_id) {
            const statusName = orderStatuses[newOrder.order_status_id as keyof typeof orderStatuses]?.label;
            showSnackbar(`Đơn hàng #${newOrder.id} đã chuyển thành: ${statusName}`, 'success');
          }
        });
      }
      
      setOrders(newOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        showSnackbar('Vui lòng đăng nhập để xem đơn hàng!', 'error');
        navigate('/login');
      } else if (showLoadingIndicator) {
        showSnackbar('Có lỗi khi tải danh sách đơn hàng!', 'error');
        setOrders([]);
      }
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredOrders = () => {
    if (selectedTab === 0) return orders;
    return orders.filter(order => order.order_status_id === selectedTab);
  };

  const canCancelOrder = (order: Order) => {
    return order.order_status_id === 1; // Chỉ cho phép hủy khi chờ xác nhận
  };

  const canReturnOrder = (order: Order) => {
    return order.order_status_id === 4; // Đã giao hàng
  };

  const canConfirmReceived = (order: Order) => {
    return order.order_status_id === 4; // Đã giao hàng
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const toggleRowExpansion = (orderId: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCancelOrder = async () => {
    try {
      await orderService.cancelOrder(cancelDialog.orderId, cancelDialog.reason);
      setCancelDialog({ open: false, orderId: 0, reason: '' });
      showSnackbar('Đã hủy đơn hàng thành công!', 'success');
      fetchOrders();
    } catch (error: any) {
      console.error('Error canceling order:', error);
      showSnackbar(error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng!', 'error');
    }
  };

  const handleReturnOrder = async () => {
    try {
      // TODO: Implement return order API when backend is ready
      console.log('Return order:', returnDialog.orderId, 'Reason:', returnDialog.reason);
      setReturnDialog({ open: false, orderId: 0, reason: '' });
      showSnackbar('Đã gửi yêu cầu hoàn hàng!', 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error requesting return:', error);
      showSnackbar('Có lỗi xảy ra khi yêu cầu hoàn hàng!', 'error');
    }
  };

  const handleReturnSuccess = () => {
    showSnackbar('Đã gửi yêu cầu hoàn hàng thành công!', 'success');
    fetchOrders();
  };

  const handleConfirmReceived = async (orderId: number) => {
    try {
      // Gọi API xác nhận đã nhận hàng - sẽ chuyển trạng thái thành "Hoàn thành"
      await orderService.confirmReceived(orderId);
      showSnackbar('Đã xác nhận nhận hàng thành công!', 'success');
      fetchOrders();
    } catch (error: any) {
      console.error('Error confirming received:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận nhận hàng!';
      showSnackbar(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải đơn hàng...</Typography>
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
              onClick={() => navigate('/home')}
              sx={{ color: 'text.secondary' }}
            >
              Quay lại
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                Đơn hàng của tôi
              </Typography>
              <Chip 
                label="Tự động cập nhật" 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Card>

        {/* Orders Table */}
        {getFilteredOrders().length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Không có đơn hàng nào
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/shop')}
              sx={{ mt: 2 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mã đơn hàng</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngày đặt</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Thanh toán</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Tổng tiền</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredOrders().map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(order.id)}
                          >
                            {expandedRows.has(order.id) ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            #{order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(order.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.icon}
                            label={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.label}
                            color={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.color as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getDisplayPaymentStatus(order).label}
                            color={getDisplayPaymentStatus(order).color as any}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatPrice(order.total)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              Chi tiết
                            </Button>
                            
                            {canConfirmReceived(order) && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => handleConfirmReceived(order.id)}
                              >
                                Đã nhận
                              </Button>
                            )}
                            
                            {order.order_status_id === 5 && ( // Hoàn thành
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<Star />}
                                onClick={() => navigate(`/review/${order.id}`)}
                              >
                                Đánh giá
                              </Button>
                            )}
                            
                            {canCancelOrder(order) && (
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => setCancelDialog({ open: true, orderId: order.id, reason: '' })}
                              >
                                Hủy
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row - Order Items */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                          <Collapse in={expandedRows.has(order.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Sản phẩm trong đơn hàng:
                              </Typography>
                              <Stack spacing={2}>
                                {order.items.map((item) => (
                                  <Box key={item.id} sx={{ display: 'flex', gap: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                                    <img
                                      src={item.product?.thumbnail || '/placeholder-image.jpg'}
                                      alt={item.product?.name || 'Sản phẩm'}
                                      style={{
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                        borderRadius: 8
                                      }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {item.product?.name || 'Sản phẩm'}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Số lượng: {item.quantity} | Đơn giá: {formatPrice(item.price)}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        Thành tiền: {formatPrice(item.price * item.quantity)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, orderId: 0, reason: '' })}>
        <DialogTitle>Hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Vui lòng cho biết lý do hủy đơn hàng:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={cancelDialog.reason}
            onChange={(e) => setCancelDialog({ ...cancelDialog, reason: e.target.value })}
            placeholder="Nhập lý do hủy đơn hàng..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, orderId: 0, reason: '' })}>
            Hủy
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            disabled={!cancelDialog.reason.trim()}
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Order Dialog */}
      <Dialog open={returnDialog.open} onClose={() => setReturnDialog({ open: false, orderId: 0, reason: '' })}>
        <DialogTitle>Yêu cầu hoàn hàng</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Vui lòng cho biết lý do hoàn hàng:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={returnDialog.reason}
            onChange={(e) => setReturnDialog({ ...returnDialog, reason: e.target.value })}
            placeholder="Nhập lý do hoàn hàng..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialog({ open: false, orderId: 0, reason: '' })}>
            Hủy
          </Button>
          <Button
            onClick={handleReturnOrder}
            color="warning"
            variant="contained"
            disabled={!returnDialog.reason.trim()}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Request Modal */}
      <ReturnRequestModal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        orderId={selectedOrderId}
        onSuccess={handleReturnSuccess}
      />

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

export default MyOrders;