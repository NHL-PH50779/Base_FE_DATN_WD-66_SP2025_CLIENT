import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Avatar,
  Divider,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge,
  Stack,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Refresh,
  Add,
  Remove,
  FilterList,
  Visibility,
  Payment,
  AccountBalanceWallet,
  History,
  Notifications,
  Close
} from '@mui/icons-material';
import { orderService } from '../services/order.service';
import axios from 'axios';

interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  formatted_amount: string;
  description: string;
  status: 'success' | 'pending' | 'failed';
  transaction_code: string;
  created_at: string;
  formatted_date: string;
  balance_before: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: number;
}

interface WalletData {
  balance: number;
  formatted_balance: string;
  pending_amount: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface FilterState {
  type: string;
  from_date: string;
  to_date: string;
  status: string;
}

const Wallet = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    from_date: '',
    to_date: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Debug authentication
    const debugAuth = async () => {
      try {
        const authResult = await orderService.testAuth();
        console.log('Auth debug:', authResult);
      } catch (error) {
        console.error('Auth debug error:', error);
      }
    };
    
    debugAuth();
    fetchWalletData();
    fetchTransactions();
    
    // Auto-refresh mỗi 30 giây
    const interval = setInterval(() => {
      fetchWalletData();
      fetchTransactions();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await orderService.getWallet();
      console.log('Wallet response:', response);
      // Lấy data từ response.data nếu có
      setWalletData(response.data || response);
    } catch (error: any) {
      console.error('Error fetching wallet:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin ví');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactionLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.from_date) params.append('from_date', filters.from_date);
      if (filters.to_date) params.append('to_date', filters.to_date);
      params.append('page', currentPage.toString());
      
      const response = await axios.get(`http://127.0.0.1:8000/api/wallet/transactions?${params}`);
      console.log('Transactions response:', response.data);
      
      if (response.data.success) {
        setTransactions(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionLoading(false);
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <TrendingUp sx={{ color: '#4CAF50' }} />;
      case 'debit':
        return <TrendingDown sx={{ color: '#f44336' }} />;
      default:
        return <Refresh />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'success';
      case 'debit':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'credit':
        return 'Tiền vào';
      case 'debit':
        return 'Tiền ra';
      default:
        return 'Khác';
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) < 10000) {
      alert('Số tiền nạp tối thiểu là 10.000 VNĐ');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/wallet/deposit', {
        amount: Number(depositAmount)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success && response.data.payment_url) {
        // Redirect to VNPay
        window.location.href = response.data.payment_url;
      } else {
        alert('Không thể tạo liên kết thanh toán');
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin ví...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Ví của tôi
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Quản lý số dư và lịch sử giao dịch
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        {/* Balance Card */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <AccountBalance sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
              Số dư hiện tại
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {formatPrice(walletData?.balance || 0)}
            </Typography>
            
            {/* Quick Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setDepositModalOpen(true)}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                Nạp tiền
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                Lịch sử giao dịch
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => { fetchWalletData(); fetchTransactions(); }}
                  size="small"
                >
                  Cập nhật
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={async () => {
                    try {
                      const result = await orderService.createTestOrder();
                      console.log('Test order created:', result);
                      alert('Tạo đơn hàng test thành công! ID: ' + result.order.id);
                    } catch (error) {
                      console.error('Error:', error);
                      alert('Lỗi tạo đơn hàng test');
                    }
                  }}
                  size="small"
                >
                  Tạo đơn test
                </Button>
              </Box>
            </Box>

            {transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Chưa có giao dịch nào
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchTransactions}
                  sx={{ mt: 2 }}
                >
                  Tải lại
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Loại giao dịch</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Số tiền</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getTransactionIcon(transaction.type)}
                            <Chip
                              label={getTransactionLabel(transaction.type)}
                              color={getTransactionColor(transaction.type) as any}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: transaction.type === 'credit' ? '#4CAF50' : '#f44336'
                            }}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}
                            {formatPrice(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(transaction.created_at)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Deposit Modal */}
      <Dialog open={depositModalOpen} onClose={() => setDepositModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Add />
          Nạp tiền vào ví
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Chọn số tiền bạn muốn nạp vào ví điện tử
          </Typography>
          
          <TextField
            fullWidth
            label="Số tiền nạp"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Nhập số tiền"
            InputProps={{
              endAdornment: <Typography variant="body2" color="text.secondary">VNĐ</Typography>
            }}
            sx={{ mb: 3 }}
          />
          
          {/* Quick Amount Buttons */}
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Số tiền gợi ý:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
              <Button
                key={amount}
                variant="outlined"
                size="small"
                onClick={() => setDepositAmount(amount.toString())}
                sx={{ minWidth: 'auto' }}
              >
                {formatPrice(amount)}
              </Button>
            ))}
          </Box>
          
          {depositAmount && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Bạn sẽ nạp <strong>{formatPrice(Number(depositAmount))}</strong> vào ví qua VNPay
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setDepositModalOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleDeposit}
            disabled={!depositAmount || Number(depositAmount) < 10000}
            startIcon={<Payment />}
            sx={{ backgroundColor: '#4CAF50' }}
          >
            Nạp qua VNPay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallet;