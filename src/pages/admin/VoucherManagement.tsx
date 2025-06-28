import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import VoucherForm from '../../components/VoucherForm';
import { voucherService } from '../../services/voucher.service';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await voucherService.getAllVouchers();
      setVouchers(response.data || []);
    } catch (error) {
      showSnackbar('Lỗi khi tải danh sách voucher', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateVoucher = async (data: any) => {
    try {
      await voucherService.createVoucher(data);
      showSnackbar('Tạo voucher thành công!', 'success');
      setFormOpen(false);
      fetchVouchers();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Lỗi khi tạo voucher', 'error');
    }
  };

  const handleUpdateVoucher = async (data: any) => {
    if (!selectedVoucher) return;
    try {
      await voucherService.updateVoucher(selectedVoucher.id, data);
      showSnackbar('Cập nhật voucher thành công!', 'success');
      setFormOpen(false);
      setSelectedVoucher(null);
      fetchVouchers();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Lỗi khi cập nhật voucher', 'error');
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    try {
      await voucherService.deleteVoucher(id);
      showSnackbar('Xóa voucher thành công!', 'success');
      fetchVouchers();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Lỗi khi xóa voucher', 'error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Quản lý Voucher</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedVoucher(null);
            setFormOpen(true);
          }}
        >
          Thêm Voucher
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Đơn tối thiểu</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher: any) => (
              <TableRow key={voucher.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {voucher.code}
                  </Typography>
                </TableCell>
                <TableCell>{voucher.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={voucher.type === 'fixed' ? 'Cố định' : 'Phần trăm'} 
                    size="small"
                    color={voucher.type === 'fixed' ? 'primary' : 'secondary'}
                  />
                </TableCell>
                <TableCell>
                  {voucher.type === 'fixed' 
                    ? formatCurrency(voucher.value)
                    : `${voucher.value}%`
                  }
                </TableCell>
                <TableCell>{formatCurrency(voucher.min_order_amount)}</TableCell>
                <TableCell>{voucher.quantity}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedVoucher(voucher);
                      setFormOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteVoucher(voucher.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <VoucherForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedVoucher(null);
        }}
        onSubmit={selectedVoucher ? handleUpdateVoucher : handleCreateVoucher}
        initialData={selectedVoucher}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoucherManagement;