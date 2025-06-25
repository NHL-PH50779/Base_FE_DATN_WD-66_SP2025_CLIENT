import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import {
  AccountBalance,
  ContentCopy,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BankingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<any>(null);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      navigate('/checkout');
    }
  }, [location, navigate]);

  const bankInfo = {
    bankName: 'Ngân hàng TMCP Công Thương Việt Nam (VietinBank)',
    accountNumber: '1234567890123',
    accountName: 'CONG TY TNHH TECHSTORE',
    branch: 'Chi nhánh Hà Nội',
    swiftCode: 'ICBVVNVX'
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const transferContent = `Thanh toan don hang ${Date.now()}`;

  if (!orderData) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Đang tải thông tin...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: 'white', py: 4, borderBottom: '1px solid #e2e8f0' }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              Thông tin chuyển khoản
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Success Alert */}
        <Alert 
          severity="success" 
          icon={<CheckCircle />}
          sx={{ mb: 4, borderRadius: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Đặt hàng thành công!
          </Typography>
          <Typography variant="body2">
            Vui lòng chuyển khoản theo thông tin bên dưới để hoàn tất đơn hàng.
          </Typography>
        </Alert>

        {/* Banking Information */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AccountBalance sx={{ color: '#FF9800', fontSize: 30 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                Thông tin tài khoản nhận
              </Typography>
            </Box>

            <Box sx={{ space: 2 }}>
              {/* Bank Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ngân hàng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {bankInfo.bankName}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Account Number */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Số tài khoản
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2196F3' }}>
                    {bankInfo.accountNumber}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => copyToClipboard(bankInfo.accountNumber, 'account')}
                  color={copied === 'account' ? 'success' : 'default'}
                >
                  <ContentCopy />
                </IconButton>
              </Box>

              <Divider />

              {/* Account Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tên tài khoản
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {bankInfo.accountName}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => copyToClipboard(bankInfo.accountName, 'name')}
                  color={copied === 'name' ? 'success' : 'default'}
                >
                  <ContentCopy />
                </IconButton>
              </Box>

              <Divider />

              {/* Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Số tiền cần chuyển
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f44336' }}>
                    {formatPrice(orderData.total)}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => copyToClipboard(orderData.total.toString(), 'amount')}
                  color={copied === 'amount' ? 'success' : 'default'}
                >
                  <ContentCopy />
                </IconButton>
              </Box>

              <Divider />

              {/* Transfer Content */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nội dung chuyển khoản
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#FF9800' }}>
                    {transferContent}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={() => copyToClipboard(transferContent, 'content')}
                  color={copied === 'content' ? 'success' : 'default'}
                >
                  <ContentCopy />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Hướng dẫn chuyển khoản
            </Typography>
            
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Đăng nhập vào ứng dụng ngân hàng hoặc internet banking
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Chọn chức năng "Chuyển khoản"
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Nhập thông tin tài khoản nhận như trên
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Nhập đúng số tiền: <strong>{formatPrice(orderData.total)}</strong>
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Nhập nội dung: <strong>{transferContent}</strong>
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Xác nhận và thực hiện chuyển khoản
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Lưu ý quan trọng:
          </Typography>
          <Typography variant="body2" component="div">
            • Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng
            <br />
            • Đơn hàng sẽ được xác nhận trong vòng 1-2 giờ sau khi nhận được tiền
            <br />
            • Liên hệ hotline: <strong>1900-xxxx</strong> nếu cần hỗ trợ
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/orders')}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/home')}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2,
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#45a049'
              }
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BankingInfo;