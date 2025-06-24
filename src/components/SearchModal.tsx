import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  InputAdornment,
  Divider
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import type { Product } from '../types/product.type';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchProducts();
      }, 300); // Debounce 300ms

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const response = await productService.searchProducts(searchTerm);
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchTerm('');
    setResults([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '60vh',
          width: '90%',
          maxWidth: '500px'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Close 
                    sx={{ cursor: 'pointer' }} 
                    onClick={onClose}
                  />
                </InputAdornment>
              ),
              sx: {
                fontSize: '1rem',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5
                }
              }
            }}
          />
        </Box>

        <Divider />

        {/* Search Results */}
        <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : results.length > 0 ? (
            <List>
              {results.map((product) => (
                <ListItem
                  key={product.id}
                  button
                  onClick={() => handleProductClick(product.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img
                      src={product.thumbnail?.startsWith('http') 
                        ? product.thumbnail 
                        : `http://localhost/storage/products/${product.thumbnail}`
                      }
                      alt={product.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 6,
                        marginRight: 12
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="error" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                        {formatPrice(product.variants?.[0]?.price || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : searchTerm.trim() && !loading ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography color="text.secondary" variant="body2">
                Không tìm thấy sản phẩm nào cho "{searchTerm}"
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography color="text.secondary" variant="body2">
                Nhập từ khóa để tìm kiếm sản phẩm
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;