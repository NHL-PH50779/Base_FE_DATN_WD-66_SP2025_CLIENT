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
    fetchWalletData();
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await orderService.getWallet();
      setWalletData(response.data);
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
      
      const response = await fetch(`http://127.0.0.1:8000/api/wallet/transactions?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data.data || []);
        setTotalPages(data.data.last_page || 1);
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
      case 'refund':
        return <TrendingUp sx={{ color: '#4CAF50' }} />;
      case 'payment':
        return <TrendingDown sx={{ color: '#f44336' }} />;
      case 'deposit':
        return <TrendingUp sx={{ color: '#2196F3' }} />;
      default:
        return <Refresh />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'refund':
        return 'success';
      case 'payment':
        return 'error';
      case 'deposit':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'refund':
        return 'Hoàn tiền';
      case 'payment':
        return 'Thanh toán';
      case 'deposit':
        return 'Nạp tiền';
      default:
        return 'Khác';
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
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Lịch sử giao dịch
            </Typography>

            {!walletData?.transactions || walletData.transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Chưa có giao dịch nào
                </Typography>
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
                    {walletData.transactions.map((transaction) => (
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
                              color: transaction.type === 'refund' || transaction.type === 'deposit' 
                                ? '#4CAF50' 
                                : '#f44336'
                            }}
                          >
                            {transaction.type === 'refund' || transaction.type === 'deposit' ? '+' : '-'}
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
    </Box>
  );
};

export default Wallet;