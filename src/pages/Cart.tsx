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
import { Checkbox } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { cartService } from '../services/cart.service';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth/auth.service';
import { useCartStore } from '../stores/cart.store';
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
    stock?: number;
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
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [quantityUpdateTimeouts, setQuantityUpdateTimeouts] = useState<Map<number, NodeJS.Timeout>>(new Map());
  const navigate = useNavigate();
  const { setCartCount } = useCartStore();

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      quantityUpdateTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [quantityUpdateTimeouts]);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getMyCart();
      console.log('Cart response:', response); // Debug log
      setCart(response.data);
      
      // Sync cart count with actual items
      const actualCount = response.data?.items?.length || 0;
      setCartCount(actualCount);
      console.log('Updated cart count to:', actualCount);
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



  const removeItem = async (itemId: number) => {
    // Optimistic update - remove from UI immediately
    const updatedCart = {
      ...cart,
      items: cart.items.filter(item => item.id !== itemId)
    };
    setCart(updatedCart);
    
    // Update cart count immediately
    setCartCount(updatedCart.items.length);
    
    // Remove from selected items
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    
    try {
      await cartService.removeFromCart(itemId);
      showSnackbar('Đã xóa sản phẩm', 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      showSnackbar('Lỗi khi xóa sản phẩm', 'error');
      // Revert on error
      await fetchCart();
    }
  };

  const toggleSelectItem = (itemId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  };

  // Debounced quantity update to reduce API calls
  const debouncedUpdateQuantity = (itemId: number, newQuantity: number) => {
    // Kiểm tra tồn kho trước khi update
    const item = cart.items.find(i => i.id === itemId);
    if (item?.product_variant?.stock && newQuantity > item.product_variant.stock) {
      showSnackbar(`Không thể thêm quá ${item.product_variant.stock} sản phẩm`, 'error');
      return;
    }
    
    // Clear existing timeout for this item
    const existingTimeout = quantityUpdateTimeouts.get(itemId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Update UI immediately
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
    
    // Set new timeout for API call
    const newTimeout = setTimeout(async () => {
      setUpdatingItems(prev => new Set(prev).add(itemId));
      try {
        await cartService.updateCartItem(itemId, newQuantity);
      } catch (error: any) {
        console.error('Error updating quantity:', error);
        // Hiện thị message từ backend
        const errorMessage = error.message || 'Lỗi khi cập nhật số lượng';
        showSnackbar(errorMessage, 'error');
        await fetchCart(); // Revert on error
      } finally {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        // Remove timeout from map
        setQuantityUpdateTimeouts(prev => {
          const newMap = new Map(prev);
          newMap.delete(itemId);
          return newMap;
        });
      }
    }, 300); // 300ms delay
    
    // Store timeout
    setQuantityUpdateTimeouts(prev => new Map(prev).set(itemId, newTimeout));
  };

  const getSelectedTotal = () => {
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleDeleteClick = (item: CartItem) => {
    setDeleteDialog({ open: true, itemId: item.id, itemName: item.product.name });
  };

  const confirmDelete = async () => {
    if (deleteDialog.itemId === -1) {
      // Bulk delete selected items
      const selectedItemIds = Array.from(selectedItems);
      
      // Optimistic update - remove from UI immediately
      const updatedCart = {
        ...cart,
        items: cart.items.filter(item => !selectedItems.has(item.id))
      };
      setCart(updatedCart);
      
      // Update cart count immediately
      setCartCount(updatedCart.items.length);
      
      // Clear selected items
      setSelectedItems(new Set());
      
      try {
        // Delete all selected items
        await Promise.all(selectedItemIds.map(itemId => cartService.removeFromCart(itemId)));
        showSnackbar(`Đã xóa ${selectedItemIds.length} sản phẩm`, 'success');
      } catch (error) {
        console.error('Error removing items:', error);
        showSnackbar('Lỗi khi xóa sản phẩm', 'error');
        // Revert on error
        await fetchCart();
      }
    } else {
      // Single item delete
      await removeItem(deleteDialog.itemId);
    }
    
    setDeleteDialog({ open: false, itemId: 0, itemName: '' });
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Giỏ hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cart.items.length} sản phẩm
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
                    {/* Select All Header */}
                    <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Checkbox
                            checked={cart.items.length > 0 && selectedItems.size === cart.items.length}
                            indeterminate={selectedItems.size > 0 && selectedItems.size < cart.items.length}
                            onChange={toggleSelectAll}
                          />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Chọn tất cả ({cart.items.length} sản phẩm)
                          </Typography>
                          {selectedItems.size > 0 && (
                            <Typography variant="body2" color="primary">
                              Đã chọn {selectedItems.size} sản phẩm
                            </Typography>
                          )}
                        </Box>
                        
                        {selectedItems.size > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => {
                              const selectedItemNames = cart.items
                                .filter(item => selectedItems.has(item.id))
                                .map(item => item.product.name)
                                .join(', ');
                              setDeleteDialog({ 
                                open: true, 
                                itemId: -1, // Special ID for bulk delete
                                itemName: `${selectedItems.size} sản phẩm đã chọn` 
                              });
                            }}
                            sx={{
                              borderRadius: 2,
                              px: 2,
                              py: 0.5
                            }}
                          >
                            Xóa tất cả
                          </Button>
                        )}
                      </Box>
                    </Box>
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
                              {/* Checkbox */}
                              <Checkbox
                                checked={selectedItems.has(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                              />
                              
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
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 600, 
                                    mb: 1,
                                    cursor: 'pointer',
                                    '&:hover': { color: 'primary.main' }
                                  }}
                                  onClick={() => navigate(`/product/${item.product.id}`)}
                                >
                                  {item.product.name}
                                </Typography>
                                {item.product_variant && (
                                  <Box sx={{ mb: 1 }}>
                                    <Chip
                                      label={item.product_variant.name}
                                      size="small"
                                      sx={{ backgroundColor: '#e3f2fd', mr: 1 }}
                                    />

                                  </Box>
                                )}
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                  {formatPrice(item.price)}
                                </Typography>
                              </Box>

                              {/* Quantity Controls */}
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <IconButton
                                    onClick={() => {
                                      if (item.quantity <= 1) {
                                        setDeleteDialog({ open: true, itemId: item.id, itemName: item.product.name });
                                      } else {
                                        debouncedUpdateQuantity(item.id, item.quantity - 1);
                                      }
                                    }}
                                    disabled={updatingItems.has(item.id)}
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
                                    onClick={() => debouncedUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={updatingItems.has(item.id) || 
                                      (item.product_variant && typeof item.product_variant.stock === 'number' && item.quantity >= item.product_variant.stock)}
                                    sx={{
                                      border: '1px solid #e2e8f0',
                                      '&:hover': { backgroundColor: '#f1f5f9' },
                                      '&:disabled': { backgroundColor: '#f5f5f5', color: '#ccc' }
                                    }}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                                {/* Stock info */}
                                {item.product_variant && typeof item.product_variant.stock === 'number' ? (
                                  <Typography 
                                    variant="caption" 
                                    color={item.quantity >= item.product_variant.stock ? 'error' : 'text.secondary'} 
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    Còn {item.product_variant.stock} sản phẩm
                                    {item.quantity >= item.product_variant.stock && ' (Đã đạt tối đa)'}
                                  </Typography>
                                ) : (
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                    {item.product_variant ? 'Không có thông tin tồn kho' : 'Sản phẩm chính'}
                                  </Typography>
                                )}
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
                    
                    {selectedItems.size > 0 ? (
                      <>
                        {/* Selected Items Summary */}
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                            Sản phẩm đã chọn ({selectedItems.size})
                          </Typography>
                          <Stack spacing={1.5}>
                            {cart.items
                              .filter(item => selectedItems.has(item.id))
                              .map((item) => (
                                <Box key={item.id} sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  p: 1.5,
                                  backgroundColor: '#f8fafc',
                                  borderRadius: 1,
                                  border: '1px solid #e2e8f0'
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                                    <img
                                      src={getImageUrl(item.product.thumbnail)}
                                      alt={item.product.name}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: 'cover',
                                        borderRadius: 4
                                      }}
                                    />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {item.product.name}
                                      </Typography>
                                      {item.product_variant && (
                                        <Typography variant="caption" color="text.secondary">
                                          {item.product_variant.name}
                                        </Typography>
                                      )}
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {formatPrice(item.price)} × {item.quantity}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    {formatPrice(item.price * item.quantity)}
                                  </Typography>
                                </Box>
                              ))
                            }
                          </Stack>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Price Breakdown */}
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Tạm tính ({selectedItems.size} sản phẩm):</Typography>
                            <Typography variant="body2" fontWeight={500}>{formatPrice(getSelectedTotal())}</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Phí vận chuyển:</Typography>
                            <Typography variant="body2" fontWeight={500}>{formatPrice(30000)}</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Giảm giá:</Typography>
                            <Typography variant="body2" fontWeight={500}>0₫</Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Tổng số lượng:</Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {cart.items
                                .filter(item => selectedItems.has(item.id))
                                .reduce((total, item) => total + item.quantity, 0)} sản phẩm
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                          <Typography variant="h6" fontWeight={700}>
                            Tổng thanh toán:
                          </Typography>
                          <Typography variant="h5" color="primary" fontWeight={700}>
                            {formatPrice(getSelectedTotal() + 30000)}
                          </Typography>
                        </Box>
                        
                        {/* Shipping Info */}
                        <Box sx={{ 
                          p: 2, 
                          backgroundColor: '#e3f2fd', 
                          borderRadius: 1, 
                          border: '1px solid #2196f3',
                          mb: 2
                        }}>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 500, textAlign: 'center' }}>
                            🚚 Phí vận chuyển: 30.000₫ - Giao hàng trong 2-3 ngày
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          margin: '0 auto 16px'
                        }}>
                          <ShoppingCartCheckout sx={{ fontSize: 40, color: 'text.secondary' }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          Chưa chọn sản phẩm nào
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Vui lòng chọn sản phẩm để xem tóm tắt đơn hàng
                        </Typography>
                      </Box>
                    )}
                    
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
                          onClick={() => {
                            if (selectedItems.size === 0) {
                              showSnackbar('Vui lòng chọn sản phẩm để thanh toán!', 'error');
                              return;
                            }
                            const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
                            navigate('/checkout', { 
                              state: { 
                                selectedItems: selectedCartItems,
                                total: getSelectedTotal() + 30000
                              }
                            });
                          }}
                          disabled={selectedItems.size === 0}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            background: selectedItems.size > 0 
                              ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                              : '#ccc',
                            boxShadow: selectedItems.size > 0 
                              ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
                              : 'none'
                          }}
                        >
                          Thanh toán ngay ({selectedItems.size})
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
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, itemId: 0, itemName: '' })}>
        <DialogTitle>
          {deleteDialog.itemId === -1 ? 'Xác nhận xóa nhiều sản phẩm' : 'Xác nhận xóa sản phẩm'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.itemId === -1 
              ? `Bạn có chắc chắn muốn xóa ${deleteDialog.itemName} khỏi giỏ hàng?`
              : `Bạn có chắc chắn muốn xóa "${deleteDialog.itemName}" khỏi giỏ hàng?`
            }
          </Typography>
          {deleteDialog.itemId === -1 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hành động này không thể hoàn tác.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, itemId: 0, itemName: '' })}>
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {deleteDialog.itemId === -1 ? 'Xóa tất cả' : 'Xóa'}
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