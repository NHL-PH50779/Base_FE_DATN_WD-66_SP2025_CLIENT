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
  Select,
  Pagination,
  Snackbar
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Add,
  Remove,
  FilterList,
  Visibility,
  Payment,
  AccountBalanceWallet,
  History,
  Notifications,
  Close,
  Refresh
} from '@mui/icons-material';
import { orderService } from '../services/order.service';
import { walletService } from '../services/wallet.service';

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

const WalletNew = () => {
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
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
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
      const response = await walletService.getWallet();
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
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/wallet/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
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

  const handleViewDetail = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleDeposit = () => {
    // Tích hợp VNPay/Momo
    console.log(`Nạp ${depositAmount} VND - Tích hợp thanh toán`);
    setDepositModalOpen(false);
    setDepositAmount('');
  };

  const handleWithdraw = async () => {
    try {
      if (!withdrawAmount || !bankName || !accountNumber || !accountName) {
        setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin', severity: 'error' });
        return;
      }
      
      const amount = parseFloat(withdrawAmount);
      if (amount < 50000) {
        setSnackbar({ open: true, message: 'Số tiền rút tối thiểu là 50,000 VND', severity: 'error' });
        return;
      }
      
      await walletService.createWithdrawRequest({
        amount,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      });
      
      setSnackbar({ open: true, message: 'Yêu cầu rút tiền đã được gửi, vui lòng chờ admin duyệt', severity: 'success' });
      setWithdrawModalOpen(false);
      setWithdrawAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      fetchWalletData();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền', 
        severity: 'error' 
      });
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchTransactions();
    setFilterModalOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      from_date: '',
      to_date: '',
      status: ''
    });
    setCurrentPage(1);
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? 
      <TrendingUp sx={{ color: '#4CAF50' }} /> : 
      <TrendingDown sx={{ color: '#f44336' }} />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'success' : 'error';
  };

  const getTransactionLabel = (type: string) => {
    return type === 'credit' ? 'Tiền vào' : 'Tiền ra';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Thành công';
      case 'pending': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return 'Không xác định';
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
      {/* Header với thông tin user */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
          color: 'white'
        }}
      >
        <Container>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}
              src={walletData?.user.avatar}
            >
              {walletData?.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Ví của {walletData?.user.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {walletData?.user.email}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Badge badgeContent={0} color="error">
                <IconButton sx={{ color: 'white' }}>
                  <Notifications />
                </IconButton>
              </Badge>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Thông tin số dư */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              mb: 3
            }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <AccountBalanceWallet sx={{ fontSize: 40 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Số dư ví
                  </Typography>
                </Stack>
                
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  {walletData?.formatted_balance || '0 VND'}
                </Typography>
                
                {walletData?.pending_amount && walletData.pending_amount > 0 && (
                  <Box sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 2, 
                    p: 2, 
                    mt: 2 
                  }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Tiền đang chờ xử lý: {walletData.pending_amount.toLocaleString()} VND
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Nút chức năng */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setDepositModalOpen(true)}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                  }}
                >
                  Nạp tiền
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Remove />}
                  onClick={() => setWithdrawModalOpen(true)}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)'
                  }}
                >
                  Rút tiền
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterModalOpen(true)}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Lọc
                </Button>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    fetchWalletData();
                    fetchTransactions();
                  }}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Làm mới
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Thống kê nhanh */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <History color="primary" />
                  <Box>
                    <Typography variant="h6" color="primary">
                      {transactions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Giao dịch tháng này
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Payment color="success" />
                  <Box>
                    <Typography variant="h6" color="success.main">
                      {transactions.filter(t => t.type === 'credit').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Giao dịch tiền vào
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lịch sử giao dịch */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
              Lịch sử giao dịch
            </Typography>

            {transactionLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
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
                        <TableCell sx={{ fontWeight: 600 }}>Mã GD</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Số tiền</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {transaction.transaction_code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {getTransactionIcon(transaction.type)}
                              <Chip
                                label={getTransactionLabel(transaction.type)}
                                color={getTransactionColor(transaction.type) as any}
                                size="small"
                              />
                            </Stack>
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
                              {transaction.formatted_amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(transaction.status)}
                              color={getStatusColor(transaction.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.formatted_date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Xem chi tiết">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewDetail(transaction)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Modal chi tiết giao dịch */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chi tiết giao dịch
          <IconButton
            onClick={() => setDetailModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Mã giao dịch</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedTransaction.transaction_code}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
                  <Chip
                    label={getStatusLabel(selectedTransaction.status)}
                    color={getStatusColor(selectedTransaction.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Số tiền</Typography>
                  <Typography variant="h6" color={selectedTransaction.type === 'credit' ? 'success.main' : 'error.main'}>
                    {selectedTransaction.type === 'credit' ? '+' : '-'}
                    {selectedTransaction.formatted_amount}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Thời gian</Typography>
                  <Typography variant="body1">
                    {selectedTransaction.formatted_date}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary">Mô tả</Typography>
                  <Typography variant="body1">
                    {selectedTransaction.description}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Số dư trước</Typography>
                  <Typography variant="body1">
                    {selectedTransaction.balance_before.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" color="text.secondary">Số dư sau</Typography>
                  <Typography variant="body1">
                    {selectedTransaction.balance_after.toLocaleString()} VND
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal nạp tiền */}
      <Dialog open={depositModalOpen} onClose={() => setDepositModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nạp tiền vào ví</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Số tiền nạp (VND)"
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select defaultValue="vnpay" label="Phương thức thanh toán">
              <MenuItem value="vnpay">VNPay</MenuItem>
              <MenuItem value="momo">Momo</MenuItem>
              <MenuItem value="bank">Chuyển khoản ngân hàng</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositModalOpen(false)}>Hủy</Button>
          <Button onClick={handleDeposit} variant="contained">
            Xác nhận nạp tiền
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal rút tiền */}
      <Dialog open={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rút tiền từ ví</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Số tiền rút (VND)"
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Ngân hàng</InputLabel>
            <Select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              label="Ngân hàng"
            >
              <MenuItem value="VCB">Vietcombank</MenuItem>
              <MenuItem value="TCB">Techcombank</MenuItem>
              <MenuItem value="MB">MB Bank</MenuItem>
              <MenuItem value="ACB">ACB</MenuItem>
              <MenuItem value="VTB">Vietinbank</MenuItem>
              <MenuItem value="BIDV">BIDV</MenuItem>
              <MenuItem value="CTG">VietinBank</MenuItem>
              <MenuItem value="EIB">Eximbank</MenuItem>
              <MenuItem value="TPB">TPBank</MenuItem>
              <MenuItem value="STB">Sacombank</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Số tài khoản"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tên chủ tài khoản"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Alert severity="info">
            Thời gian xử lý: 1-3 ngày làm việc
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawModalOpen(false)}>Hủy</Button>
          <Button onClick={handleWithdraw} variant="contained">
            Xác nhận rút tiền
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal lọc */}
      <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lọc giao dịch</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Loại giao dịch</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  label="Loại giao dịch"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="credit">Tiền vào</MenuItem>
                  <MenuItem value="debit">Tiền ra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Từ ngày"
                type="date"
                value={filters.from_date}
                onChange={(e) => setFilters({...filters, from_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Đến ngày"
                type="date"
                value={filters.to_date}
                onChange={(e) => setFilters({...filters, to_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Xóa bộ lọc</Button>
          <Button onClick={() => setFilterModalOpen(false)}>Hủy</Button>
          <Button onClick={applyFilters} variant="contained">
            Áp dụng
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WalletNew;