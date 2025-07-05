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
  CircularProgress
} from '@mui/material';
import { AccountBalanceWallet, TrendingUp, TrendingDown } from '@mui/icons-material';

interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  created_at: string;
  balance_after: number;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/wallet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBalance(data.data.balance);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/wallet/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTransactions(data.data.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
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

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Balance Card */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <AccountBalanceWallet sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Số dư hiện tại
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#4CAF50' }}>
              {formatPrice(balance)}
            </Typography>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Lịch sử giao dịch
            </Typography>

            {transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Chưa có giao dịch nào
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Số tiền</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Số dư sau GD</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Chip
                            icon={transaction.type === 'credit' ? <TrendingUp /> : <TrendingDown />}
                            label={transaction.type === 'credit' ? 'Cộng tiền' : 'Trừ tiền'}
                            color={transaction.type === 'credit' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: transaction.type === 'credit' ? '#4CAF50' : '#f44336',
                              fontWeight: 600
                            }}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {formatPrice(transaction.balance_after)}
                        </TableCell>
                        <TableCell>{formatDate(transaction.created_at)}</TableCell>
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