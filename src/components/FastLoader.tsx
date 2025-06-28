import React from 'react';
import { Box, Typography } from '@mui/material';

const FastLoader: React.FC<{ message?: string }> = ({ message = 'Đang tải...' }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '200px',
    py: 4
  }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #2196F3',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }}
    />
    <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '14px' }}>
      {message}
    </Typography>
  </Box>
);

export default FastLoader;