import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Chip,
  Stack,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartCheckout,
  ShoppingBag,
  LocalShipping,
  Security,
  Favorite,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { cartService } from '../services/cart.service';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth/auth.service';
import { useNavigate } from 'react-router-dom';

interface CartItem {
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

interface Cart {
  items: CartItem[];
  total: number;
}

const Cart = () => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: 0, itemName: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getMyCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showSnackbar('Lỗi khi tải giỏ hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await cartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
      showSnackbar('Đã cập nhật số lượng', 'success');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showSnackbar('Lỗi khi cập nhật số lượng', 'error');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleDeleteClick = (item: CartItem) => {
    setDeleteDialog({
      open: true,
      itemId: item.id,
      itemName: item.product.name
    });
  };

  const confirmDelete = async () => {
    try {
      await cartService.removeFromCart(deleteDialog.itemId);
      await fetchCart();
      showSnackbar('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      showSnackbar('Lỗi khi xóa sản phẩm', 'error');
    } finally {
      setDeleteDialog({ open: false, itemId: 0, itemName: '' });
    }
  };

  const handleCheckout = async () => {
    if (!authService.isAuthenticated()) {
      showSnackbar('Vui lòng đăng nhập để thanh toán', 'error');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      showSnackbar('Giỏ hàng trống', 'error');
      return;
    }

    setCheckoutLoading(true);
    try {
      await orderService.checkout();
      showSnackbar('Đặt hàng thành công!', 'success');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error) {
      console.error('Checkout error:', error);
      showSnackbar('Lỗi khi đặt hàng', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
              Bạn cần đăng nhập để xem giỏ hàng
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

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Box sx={{ backgroundColor: 'white', py: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="lg">
          <Breadcrumbs>
            <Link color="inherit" href="/" sx={{ textDecoration: 'none' }}>
              Trang chủ
            </Link>
            <Typography color="text.primary">Giỏ hàng</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Giỏ hàng của bạn
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {cart.items.length} sản phẩm trong giỏ hàng
            </Typography>
          </Box>

          {cart.items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ textAlign: 'center', py: 8, backgroundColor: 'white' }}>
                <CardContent>
                  <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Giỏ hàng trống
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Hãy thêm một số sản phẩm vào giỏ hàng của bạn
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingBag />}
                    onClick={() => navigate('/shop')}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
              {/* Cart Items */}
              <Box>
                <Card sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden' }}>
                  <CardContent sx={{ p: 0 }}>
                    <AnimatePresence>
                      {cart.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Box
                            sx={{
                              p: 3,
                              borderBottom: index < cart.items.length - 1 ? '1px solid #e2e8f0' : 'none',
                              '&:hover': {
                                backgroundColor: '#f8fafc'
                              },
                              transition: 'background-color 0.2s ease'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              {/* Product Image */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Box
                                  component="img"
                                  src={getImageUrl(item.product.thumbnail)}
                                  alt={item.product.name}
                                  sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                  }}
                                />
                              </motion.div>

                              {/* Product Info */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                  {item.product.name}
                                </Typography>
                                {item.product_variant && (
                                  <Chip
                                    label={item.product_variant.name}
                                    size="small"
                                    sx={{ mb: 1, backgroundColor: '#e3f2fd' }}
                                  />
                                )}
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                  {formatPrice(item.price)}
                                </Typography>
                              </Box>

                              {/* Quantity Controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                  sx={{
                                    border: '1px solid #e2e8f0',
                                    '&:hover': { backgroundColor: '#f1f5f9' }
                                  }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                
                                <Box
                                  sx={{
                                    minWidth: 50,
                                    textAlign: 'center',
                                    py: 1,
                                    px: 2,
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 1,
                                    backgroundColor: 'white',
                                    position: 'relative'
                                  }}
                                >
                                  {updatingItems.has(item.id) ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <Typography variant="body1" fontWeight={600}>
                                      {item.quantity}
                                    </Typography>
                                  )}
                                </Box>
                                
                                <IconButton
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={updatingItems.has(item.id)}
                                  sx={{
                                    border: '1px solid #e2e8f0',
                                    '&:hover': { backgroundColor: '#f1f5f9' }
                                  }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>

                              {/* Total Price & Actions */}
                              <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                  {formatPrice(item.price * item.quantity)}
                                </Typography>
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  <IconButton
                                    size="small"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    <Favorite fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteClick(item)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </Box>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card sx={{ backgroundColor: 'white', borderRadius: 3, position: 'sticky', top: 20 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                      Tóm tắt đơn hàng
                    </Typography>
                    
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Tạm tính:</Typography>
                        <Typography fontWeight={600}>{formatPrice(cart.total)}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalShipping fontSize="small" color="warning" />
                          <Typography>Phí vận chuyển:</Typography>
                        </Box>
                        <Typography fontWeight={600}>{formatPrice(30000)}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security fontSize="small" color="primary" />
                          <Typography>Bảo hiểm:</Typography>
                        </Box>
                        <Typography color="text.secondary">Tùy chọn</Typography>
                      </Box>
                    </Stack>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h6" fontWeight={700}>
                        Tổng cộng:
                      </Typography>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        {formatPrice(cart.total + 30000)}
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          startIcon={<ShoppingCartCheckout />}
                          onClick={() => navigate('/checkout')}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                          }}
                        >
                          Thanh toán ngay
                        </Button>
                      </motion.div>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/shop')}
                        sx={{ py: 1.5, borderRadius: 2 }}
                      >
                        Tiếp tục mua sắm
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, itemId: 0, itemName: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa "{deleteDialog.itemName}" khỏi giỏ hàng?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemId: 0, itemName: '' })}>
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Xóa
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

export default Cart;