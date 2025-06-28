import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem
} from '@mui/material';

interface VoucherFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'fixed',
    value: initialData?.value || (initialData?.type === 'percent' ? 10 : 50000),
    min_order_amount: initialData?.min_order_amount || 100000,
    max_discount_amount: initialData?.max_discount_amount || '',
    quantity: initialData?.quantity || 100,
    start_date: initialData?.start_date || new Date().toISOString().slice(0, 16),
    end_date: initialData?.end_date || new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 16),
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      value: Number(formData.value) || (formData.type === 'fixed' ? 50000 : 10),
      min_order_amount: Number(formData.min_order_amount) || 0,
      max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
      quantity: Number(formData.quantity) || 1
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Mã voucher"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder="SAVE10"
            fullWidth
          />
          
          <TextField
            label="Tên voucher"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Giảm 10%"
            fullWidth
          />
          
          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
          
          <TextField
            select
            label="Loại giảm giá"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            fullWidth
          >
            <MenuItem value="fixed">Giảm cố định (VND)</MenuItem>
            <MenuItem value="percent">Giảm phần trăm (%)</MenuItem>
          </TextField>
          
          <TextField
            label={`Giá trị giảm ${formData.type === 'fixed' ? '(VND)' : '(%)'}`}
            value={formData.value}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              handleChange('value', value || (formData.type === 'fixed' ? '50000' : '10'));
            }}
            placeholder={formData.type === 'fixed' ? '50000' : '10'}
            helperText={formData.type === 'fixed' ? 'Ví dụ: 50000 = giảm 50,000đ' : 'Ví dụ: 10 = giảm 10%'}
            fullWidth
          />
          
          <TextField
            label="Đơn hàng tối thiểu"
            value={formData.min_order_amount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              handleChange('min_order_amount', value || '100000');
            }}
            placeholder="100000"
            fullWidth
          />
          
          {formData.type === 'percent' && (
            <TextField
              label="Giảm tối đa (để trống nếu không giới hạn)"
              value={formData.max_discount_amount}
              onChange={(e) => handleChange('max_discount_amount', e.target.value)}
              placeholder="200000"
              fullWidth
            />
          )}
          
          <TextField
            label="Số lượng"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            placeholder="100"
            fullWidth
          />
          
          <TextField
            label="Ngày bắt đầu"
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          
          <TextField
            label="Ngày kết thúc"
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange('end_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Cập nhật' : 'Tạo voucher'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherForm;