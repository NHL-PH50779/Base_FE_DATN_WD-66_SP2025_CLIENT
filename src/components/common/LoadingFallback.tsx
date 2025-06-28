import React from 'react';
import { Box, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';

interface LoadingFallbackProps {
  message?: string;
  showOfflineMessage?: boolean;
  variant?: 'page' | 'card' | 'inline';
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Đang tải...', 
  showOfflineMessage = false,
  variant = 'page'
}) => {
  const content = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      p: variant === 'inline' ? 2 : 4
    }}>
      {showOfflineMessage ? (
        <>
          <WifiOff sx={{ fontSize: 48, color: 'warning.main' }} />
          <Typography variant="h6" color="warning.main">
            Chế độ offline
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Không thể kết nối server. Hiển thị dữ liệu mẫu.
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={variant === 'inline' ? 32 : 48} />
          <Typography variant={variant === 'inline' ? 'body2' : 'h6'} color="text.secondary">
            {message}
          </Typography>
        </>
      )}
    </Box>
  );

  if (variant === 'card') {
    return (
      <Card sx={{ minHeight: 200 }}>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'page') {
    return (
      <Box sx={{ 
        minHeight: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingFallback;