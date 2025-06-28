import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Button,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import FastProductCard from '../components/FastProductCard';
import FastLoader from '../components/FastLoader';
import type { Product } from '../types/product.type';

const ITEMS_PER_PAGE = 12;

const FastShop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedSsd, setSelectedSsd] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const ramOptions = ['4GB', '8GB', '16GB', '32GB'];
  const ssdOptions = ['256GB', '512GB', '1TB', '2TB'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load products first (priority)
      const productsRes = await productService.getAllProducts();
      setProducts(productsRes.data || []);
      
      // Load categories and brands in background
      setTimeout(async () => {
        try {
          const [categoriesRes, brandsRes] = await Promise.all([
            categoryService.getAllCategories(),
            brandService.getAllBrands()
          ]);
          setCategories(categoriesRes.data || []);
          setBrands(brandsRes.data || []);
        } catch (error) {
          console.error('Error loading filters:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Lỗi khi tải dữ liệu sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Optimized filtering with pagination
  const { filteredProducts, totalPages } = useMemo(() => {
    let filtered = [...products];

    // Quick filters
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(product => product.category_id === categoryId);
    }

    if (selectedBrand) {
      const brandId = parseInt(selectedBrand);
      filtered = filtered.filter(product => product.brand_id === brandId);
    }

    // RAM/SSD filters (simplified)
    if (selectedRam.length > 0) {
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description || ''}`.toLowerCase();
        return selectedRam.some(ram => productText.includes(ram.toLowerCase()));
      });
    }

    if (selectedSsd.length > 0) {
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description || ''}`.toLowerCase();
        return selectedSsd.some(ssd => productText.includes(ssd.toLowerCase()));
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.variants?.[0]?.price || a.price || 0) - (b.variants?.[0]?.price || b.price || 0);
        case 'price_desc':
          return (b.variants?.[0]?.price || b.price || 0) - (a.variants?.[0]?.price || a.price || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { filteredProducts: paginatedProducts, totalPages, totalItems: filtered.length };
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedRam, selectedSsd, sortBy, page]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('name');
    setSelectedRam([]);
    setSelectedSsd([]);
    setPage(1);
    showSnackbar('Đã xóa tất cả bộ lọc', 'success');
  }, []);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleRamChange = useCallback((ram: string) => {
    setSelectedRam(prev => 
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    );
    setPage(1);
  }, []);

  const handleSsdChange = useCallback((ssd: string) => {
    setSelectedSsd(prev => 
      prev.includes(ssd) ? prev.filter(s => s !== ssd) : [...prev, ssd]
    );
    setPage(1);
  }, []);

  if (loading) {
    return <FastLoader message="Đang tải sản phẩm..." />;
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Cửa hàng
        </Typography>
      </Container>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        {/* Quick Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                size="small"
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  label="Danh mục"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Thương hiệu</InputLabel>
                <Select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setPage(1);
                  }}
                  label="Thương hiệu"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {brands.map(brand => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sắp xếp"
                >
                  <MenuItem value="name">Tên A-Z</MenuItem>
                  <MenuItem value="price_asc">Giá thấp → cao</MenuItem>
                  <MenuItem value="price_desc">Giá cao → thấp</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                size="small"
                startIcon={<FilterList />}
              >
                Xóa bộ lọc
              </Button>
            </Grid>
          </Grid>

          {/* RAM/SSD Quick Filters */}
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>RAM:</Typography>
              {ramOptions.map(ram => (
                <Chip
                  key={ram}
                  label={ram}
                  size="small"
                  clickable
                  color={selectedRam.includes(ram) ? 'primary' : 'default'}
                  onClick={() => handleRamChange(ram)}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>SSD:</Typography>
              {ssdOptions.map(ssd => (
                <Chip
                  key={ssd}
                  label={ssd}
                  size="small"
                  clickable
                  color={selectedSsd.includes(ssd) ? 'secondary' : 'default'}
                  onClick={() => handleSsdChange(ssd)}
                />
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* Results Info */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {filteredProducts.length} sản phẩm (Trang {page}/{totalPages})
          </Typography>
        </Box>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <FastProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy sản phẩm nào
            </Typography>
          </Box>
        )}
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FastShop;