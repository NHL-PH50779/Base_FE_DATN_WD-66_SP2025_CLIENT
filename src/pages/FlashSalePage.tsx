import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import FlashSale from '../components/FlashSale';

const FlashSalePage: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Trang chủ
          </MuiLink>
          <Typography color="text.primary">Flash Sale</Typography>
        </Breadcrumbs>
        
        {/* Page Title */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            textAlign: 'center',
            color: '#2c3e50'
          }}
        >
          Flash Sale
        </Typography>
        
        {/* Flash Sale Component */}
        <FlashSale />
      </Container>
    </Box>
  );
};

export default FlashSalePage;