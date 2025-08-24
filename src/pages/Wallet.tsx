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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { orderService } from '../services/order.service';

type TransactionType = 'refund' | 'payment' | 'deposit';

interface WalletTransaction {
  id: number;
  type: TransactionType;
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

  const getTransactionIcon = (type: TransactionType) => {
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

  const getTransactionColor = (type: TransactionType) => {
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

  const getTransactionLabel = (type: TransactionType) => {
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                Lịch sử giao dịch
              </Typography>
              <Button variant="outlined" startIcon={<FilterList />} onClick={() => fetchTransactions()}>
                Áp dụng lọc
              </Button>
            </Box>

            {/* Filter UI */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                label="Từ ngày"
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Đến ngày"
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Loại giao dịch</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Loại giao dịch"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="refund">Hoàn tiền</MenuItem>
                  <MenuItem value="payment">Thanh toán</MenuItem>
                  <MenuItem value="deposit">Nạp tiền</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {transactionLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Đang tải giao dịch...</Typography>
              </Box>
            ) : transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Chưa có giao dịch nào
                </Typography>
              </Box>
            ) : (
              <>
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

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Wallet;
