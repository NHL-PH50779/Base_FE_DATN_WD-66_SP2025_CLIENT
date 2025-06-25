import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ReturnRequestModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  onSuccess: () => void;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  open,
  onClose,
  orderId,
  onSuccess
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hoàn hàng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.post('http://127.0.0.1:8000/api/return_requests', {
        user_id: user.id,
        order_id: orderId,
        reason: reason.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      onSuccess();
      onClose();
      setReason('');
    } catch (error: any) {
      console.error('Error creating return request:', error);
      setError(error.response?.data?.message || 'Có lỗi khi gửi yêu cầu hoàn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
          Yêu cầu hoàn hàng
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Đơn hàng #{orderId}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Lý do hoàn hàng"
              placeholder="Vui lòng mô tả lý do bạn muốn hoàn hàng..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary">
              * Yêu cầu hoàn hàng sẽ được xem xét và phản hồi trong vòng 24-48 giờ
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          loading={loading}
          disabled={loading || !reason.trim()}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
            }
          }}
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnRequestModal;