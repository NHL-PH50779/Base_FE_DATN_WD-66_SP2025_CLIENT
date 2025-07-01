import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { useCartStore } from '../stores/cart.store';

const CartCountTest: React.FC = () => {
  const { 
    cartCount, 
    wishlistCount, 
    incrementCart, 
    decrementCart, 
    incrementWishlist, 
    decrementWishlist 
  } = useCartStore();

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Cart & Wishlist Counter
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Typography variant="body1">
            Cart Count: {cartCount}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={incrementCart}>
              +1 Cart
            </Button>
            <Button variant="outlined" onClick={decrementCart}>
              -1 Cart
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="body1">
            Wishlist Count: {wishlistCount}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={incrementWishlist}>
              +1 Wishlist
            </Button>
            <Button variant="outlined" onClick={decrementWishlist}>
              -1 Wishlist
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CartCountTest;