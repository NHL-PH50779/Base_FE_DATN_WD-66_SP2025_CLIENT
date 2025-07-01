import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem } from '@mui/material';

const WishlistDebug: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const loadWishlist = () => {
    const stored = localStorage.getItem('wishlist');
    const parsed = stored ? JSON.parse(stored) : [];
    setWishlist(parsed);
    console.log('Current wishlist:', parsed);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const addTestProduct = () => {
    const testId = Math.floor(Math.random() * 1000);
    const current = JSON.parse(localStorage.getItem('wishlist') || '[]');
    current.push(testId);
    localStorage.setItem('wishlist', JSON.stringify(current));
    loadWishlist();
  };

  const clearWishlist = () => {
    localStorage.removeItem('wishlist');
    loadWishlist();
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', m: 2 }}>
      <Typography variant="h6">Wishlist Debug</Typography>
      <Typography>Items in localStorage: {wishlist.length}</Typography>
      
      <List>
        {wishlist.map((id, index) => (
          <ListItem key={index}>Product ID: {id}</ListItem>
        ))}
      </List>

      <Button onClick={addTestProduct} variant="outlined" sx={{ mr: 1 }}>
        Add Test Product
      </Button>
      <Button onClick={clearWishlist} variant="outlined" sx={{ mr: 1 }}>
        Clear Wishlist
      </Button>
      <Button onClick={loadWishlist} variant="outlined">
        Refresh
      </Button>
    </Box>
  );
};

export default WishlistDebug;