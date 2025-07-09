import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Alert, Snackbar } from '@mui/material';

const WalletDebug = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    // Debug localStorage
    console.log('=== Debug localStorage ===');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User:', localStorage.getItem('user'));
    console.log('All localStorage keys:', Object.keys(localStorage));
  }, []);

  const setTestToken = () => {
    const testToken = '138|1FYs84CgnHGdlEuIwpbhrClMlYQjvxZ8EHo9JFG69586c193';
    const testUser = {
      id: 16,
      name: 'tuan',
      email: 'test234@gmail.com',
      role: 'client'
    };
    
    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    setSnackbar({ open: true, message: 'Token đã được set thành công!' });
    setTimeout(() => window.location.reload(), 1000);
  };

  const testAPI = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Testing with token:', token);
      
      const response = await fetch('http://127.0.0.1:8000/api/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setSnackbar({ open: true, message: 'Token đã được xóa!' });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={3}>Wallet Debug</Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Mở Developer Tools (F12) → Console để xem debug info
      </Alert>
      
      <Box>
        <Typography variant="h6" mb={2}>LocalStorage Info:</Typography>
        <Typography>Token: {localStorage.getItem('token') ? 'Có' : 'Không có'}</Typography>
        <Typography>User: {localStorage.getItem('user') ? 'Có' : 'Không có'}</Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={setTestToken}
            color="success"
          >
            Set Test Token
          </Button>
          
          <Button 
            variant="contained" 
            onClick={testAPI}
          >
            Test API với Token
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={clearToken}
            color="error"
          >
            Clear Token
          </Button>
        </Box>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default WalletDebug;