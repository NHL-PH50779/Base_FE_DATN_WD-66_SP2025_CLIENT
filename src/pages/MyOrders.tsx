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
  CircularProgress
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
  Assignment,
  Star,
  ArrowBack
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      console.log('Orders response:', response);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        alert('Vui lòng đăng nhập để xem đơn hàng!');
        navigate('/login');
      } else {
        alert('Có lỗi khi tải danh sách đơn hàng!');
        setOrders([]);
      }
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
    return [1, 2].includes(order.order_status_id); // Chờ xác nhận hoặc Đã xác nhận
  };

  const canReturnOrder = (order: Order) => {
    return order.order_status_id === 4; // Đã giao hàng
  };

  const canConfirmReceived = (order: Order) => {
    return order.order_status_id === 4; // Đã giao hàng
  };

  const handleCancelOrder = async () => {
    try {
      // TODO: Implement cancel order API when backend is ready
      console.log('Cancel order:', cancelDialog.orderId, 'Reason:', cancelDialog.reason);
      setCancelDialog({ open: false, orderId: 0, reason: '' });
      alert('Đã hủy đơn hàng thành công!');
      fetchOrders();
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng!');
    }
  };

  const handleReturnOrder = async () => {
    try {
      // TODO: Implement return order API when backend is ready
      console.log('Return order:', returnDialog.orderId, 'Reason:', returnDialog.reason);
      setReturnDialog({ open: false, orderId: 0, reason: '' });
      alert('Đã gửi yêu cầu hoàn hàng!');
      fetchOrders();
    } catch (error) {
      console.error('Error requesting return:', error);
      alert('Có lỗi xảy ra khi yêu cầu hoàn hàng!');
    }
  };

  const handleReturnSuccess = () => {
    alert('Đã gửi yêu cầu hoàn hàng thành công!');
    fetchOrders();
  };

  const handleConfirmReceived = async (orderId: number) => {
    if (window.confirm('Xác nhận bạn đã nhận được hàng?')) {
      try {
        // TODO: Implement confirm received API when backend is ready
        console.log('Confirm received order:', orderId);
        alert('Đã xác nhận nhận hàng thành công!');
        fetchOrders();
      } catch (error) {
        console.error('Error confirming received:', error);
        alert('Có lỗi xảy ra!');
      }
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
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Đơn hàng của tôi
            </Typography>
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

        {/* Orders List */}
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
          <Stack spacing={3}>
            {getFilteredOrders().map((order) => (
              <Card key={order.id} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                  {/* Order Header */}
                  <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Đơn hàng #{order.id}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.icon}
                          label={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.label}
                          color={orderStatuses[order.order_status_id as keyof typeof orderStatuses]?.color as any}
                          variant="filled"
                        />
                        <Chip
                          label={paymentStatuses[order.payment_status_id as keyof typeof paymentStatuses]?.label}
                          color={paymentStatuses[order.payment_status_id as keyof typeof paymentStatuses]?.color as any}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Đặt hàng: {formatDate(order.created_at)}
                    </Typography>
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ p: 3 }}>
                    {order.items.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <img
                          src={item.product?.thumbnail || '/placeholder-image.jpg'}
                          alt={item.product?.name || 'Sản phẩm'}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 8
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                            {item.product?.name || 'Sản phẩm'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số lượng: {item.quantity}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Divider />

                  {/* Order Footer */}
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tổng tiền: {formatPrice(order.total)}
                    </Typography>
                    
                    <Stack direction="row" spacing={1}>
                      {/* Xem chi tiết */}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        Xem chi tiết
                      </Button>

                      {/* Đã nhận hàng */}
                      {canConfirmReceived(order) && (
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() => handleConfirmReceived(order.id)}
                        >
                          Đã nhận hàng
                        </Button>
                      )}

                      {/* Hoàn hàng */}
                      {canReturnOrder(order) && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="warning"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setReturnModalOpen(true);
                          }}
                        >
                          Hoàn hàng
                        </Button>
                      )}

                      {/* Hủy đơn */}
                      {canCancelOrder(order) && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => setCancelDialog({ open: true, orderId: order.id, reason: '' })}
                        >
                          Hủy đơn
                        </Button>
                      )}

                      {/* Đánh giá */}
                      {order.order_status_id === 5 && (
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
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
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
    </Box>
  );
};

export default MyOrders;