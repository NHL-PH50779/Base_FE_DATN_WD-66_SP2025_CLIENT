import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Restore,
  DeleteForever,
  ArrowBack,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TrashedProduct {
  id: number;
  name: string;
  brand: { name: string };
  category: { name: string };
  thumbnail: string;
  deleted_at: string;
}

const TrashedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<TrashedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState({ open: false, productId: 0, productName: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: 0, productName: '' });

  useEffect(() => {
    fetchTrashedProducts();
  }, []);

  const fetchTrashedProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/products/trashed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching trashed products:', error);
      alert('Có lỗi khi tải danh sách sản phẩm đã xóa!');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/products/restore/${restoreDialog.productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Khôi phục sản phẩm thành công!');
      setRestoreDialog({ open: false, productId: 0, productName: '' });
      fetchTrashedProducts();
    } catch (error) {
      console.error('Error restoring product:', error);
      alert('Có lỗi khi khôi phục sản phẩm!');
    }
  };

  const handlePermanentDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/products/${deleteDialog.productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa vĩnh viễn sản phẩm thành công!');
      setDeleteDialog({ open: false, productId: 0, productName: '' });
      fetchTrashedProducts();
    } catch (error) {
      console.error('Error permanently deleting product:', error);
      alert('Có lỗi khi xóa vĩnh viễn sản phẩm!');
    }
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

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', py: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/admin/products')}
                sx={{ color: 'text.secondary' }}
              >
                Quay lại
              </Button>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                Sản phẩm đã xóa
              </Typography>
            </Box>
            <Button
              startIcon={<Refresh />}
              onClick={fetchTrashedProducts}
              variant="outlined"
            >
              Làm mới
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {products.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Không có sản phẩm nào trong thùng rác
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/products')}
              sx={{ mt: 2 }}
            >
              Quay lại danh sách sản phẩm
            </Button>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Tổng cộng: {products.length} sản phẩm đã xóa
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thương hiệu</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Danh mục</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ngày xóa</TableCell>
                      <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                              src={product.thumbnail || '/placeholder-image.jpg'}
                              alt={product.name}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 8
                              }}
                            />
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {product.name}
                              </Typography>
                              <Chip
                                label="Đã xóa"
                                color="error"
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{product.brand?.name || 'N/A'}</TableCell>
                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(product.deleted_at)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Restore />}
                              onClick={() => setRestoreDialog({
                                open: true,
                                productId: product.id,
                                productName: product.name
                              })}
                              sx={{ color: 'success.main', borderColor: 'success.main' }}
                            >
                              Khôi phục
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DeleteForever />}
                              onClick={() => setDeleteDialog({
                                open: true,
                                productId: product.id,
                                productName: product.name
                              })}
                              color="error"
                            >
                              Xóa vĩnh viễn
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Restore Dialog */}
      <Dialog open={restoreDialog.open} onClose={() => setRestoreDialog({ open: false, productId: 0, productName: '' })}>
        <DialogTitle>Khôi phục sản phẩm</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn khôi phục sản phẩm "{restoreDialog.productName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialog({ open: false, productId: 0, productName: '' })}>
            Hủy
          </Button>
          <Button onClick={handleRestore} color="success" variant="contained">
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permanent Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, productId: 0, productName: '' })}>
        <DialogTitle>Xóa vĩnh viễn sản phẩm</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Cảnh báo: Hành động này không thể hoàn tác!
            </Typography>
          </Alert>
          <Typography>
            Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "{deleteDialog.productName}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, productId: 0, productName: '' })}>
            Hủy
          </Button>
          <Button onClick={handlePermanentDelete} color="error" variant="contained">
            Xóa vĩnh viễn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrashedProducts;