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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider
} from '@mui/material';
import { Visibility, AccountBalance, Schedule, CheckCircle, Cancel } from '@mui/icons-material';
import { walletService } from '../services/wallet.service';

interface WithdrawRequest {
  id: number;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at: string;
  processed_at?: string;
}

const WithdrawRequests = () => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWithdrawRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching withdraw requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'pending': return <Schedule />;
      default: return null;
    }
  };

  const handleViewDetail = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setDetailModalOpen(true);
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải danh sách yêu cầu...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#2c3e50' }}>
        Yêu cầu rút tiền
      </Typography>

      {requests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <AccountBalance sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Chưa có yêu cầu rút tiền nào
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Mã yêu cầu</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Số tiền</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngân hàng</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          WR{request.id.toString().padStart(6, '0')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600}>
                          {request.amount.toLocaleString()} VND
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {request.bank_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.account_number}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(request.status)}
                          label={getStatusLabel(request.status)}
                          color={getStatusColor(request.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(request.created_at).toLocaleDateString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetail(request)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Modal chi tiết */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết yêu cầu rút tiền
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Mã yêu cầu
                  </Typography>
                  <Typography variant="h6" color="primary">
                    WR{selectedRequest.id.toString().padStart(6, '0')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Trạng thái
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedRequest.status)}
                    label={getStatusLabel(selectedRequest.status)}
                    color={getStatusColor(selectedRequest.status) as any}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Số tiền rút
                  </Typography>
                  <Typography variant="h5" color="error.main" fontWeight={600}>
                    {selectedRequest.amount.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ngày tạo yêu cầu
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedRequest.created_at).toLocaleString('vi-VN')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ngân hàng
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedRequest.bank_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Số tài khoản
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedRequest.account_number}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tên chủ tài khoản
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedRequest.account_name}
                  </Typography>
                </Grid>
                
                {selectedRequest.processed_at && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Thời gian xử lý
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedRequest.processed_at).toLocaleString('vi-VN')}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {selectedRequest.admin_note && (
                  <>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Ghi chú từ admin
                      </Typography>
                      <Alert severity={selectedRequest.status === 'approved' ? 'success' : 'error'}>
                        {selectedRequest.admin_note}
                      </Alert>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WithdrawRequests;