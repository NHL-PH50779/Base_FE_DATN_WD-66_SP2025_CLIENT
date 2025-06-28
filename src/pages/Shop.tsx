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
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import { Search, ExpandMore, FilterList } from '@mui/icons-material';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product.type';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000000]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedSsd, setSelectedSsd] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Available filter options
  const ramOptions = ['4GB', '8GB', '16GB', '32GB', '64GB'];
  const ssdOptions = ['128GB', '256GB', '512GB', '1TB', '2TB'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load data sequentially to reduce initial load time
      const productsRes = await productService.getAllProducts();
      setProducts(productsRes.data || []);
      
      // Load categories and brands in background
      Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands()
      ]).then(([categoriesRes, brandsRes]) => {
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      }).catch(error => {
        console.error('Error loading categories/brands:', error);
      });
      
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Lỗi khi tải dữ liệu sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory) {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(product => product.category_id === categoryId);
    }

    // Brand filter
    if (selectedBrand) {
      const brandId = parseInt(selectedBrand);
      filtered = filtered.filter(product => product.brand_id === brandId);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.variants?.[0]?.price || product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // RAM filter
    if (selectedRam.length > 0) {
      filtered = filtered.filter(product => {
        const productName = product.name.toLowerCase();
        const productDesc = (product.description || '').toLowerCase();
        const variantInfo = product.variants?.map(v => v.Name.toLowerCase()).join(' ') || '';
        const searchText = `${productName} ${productDesc} ${variantInfo}`;
        
        return selectedRam.some(ram => {
          const ramValue = ram.toLowerCase().replace('gb', '');
          return searchText.includes(ram.toLowerCase()) || 
                 searchText.includes(`${ramValue}gb`) ||
                 searchText.includes(`${ramValue} gb`) ||
                 searchText.includes(`ram ${ramValue}`);
        });
      });
    }

    // SSD filter
    if (selectedSsd.length > 0) {
      filtered = filtered.filter(product => {
        const productName = product.name.toLowerCase();
        const productDesc = (product.description || '').toLowerCase();
        const variantInfo = product.variants?.map(v => v.Name.toLowerCase()).join(' ') || '';
        const searchText = `${productName} ${productDesc} ${variantInfo}`;
        
        return selectedSsd.some(ssd => {
          const ssdValue = ssd.toLowerCase().replace(/gb|tb/, '');
          return searchText.includes(ssd.toLowerCase()) || 
                 searchText.includes(`${ssdValue}gb`) ||
                 searchText.includes(`${ssdValue}tb`) ||
                 searchText.includes(`ssd ${ssdValue}`);
        });
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

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, priceRange, selectedRam, selectedSsd]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('name');
    setPriceRange([0, 50000000]);
    setSelectedRam([]);
    setSelectedSsd([]);
    showSnackbar('Đã xóa tất cả bộ lọc', 'success');
  }, []);

  const handleRamChange = useCallback((ram: string) => {
    setSelectedRam(prev => 
      prev.includes(ram) 
        ? prev.filter(r => r !== ram)
        : [...prev, ram]
    );
  }, []);

  const handleSsdChange = useCallback((ssd: string) => {
    setSelectedSsd(prev => 
      prev.includes(ssd) 
        ? prev.filter(s => s !== ssd)
        : [...prev, ssd]
    );
  }, []);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const getCategoryName = useCallback((categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  }, [categories]);

  const getBrandName = useCallback((brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || '';
  }, [brands]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }}>Đang tải sản phẩm...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Container maxWidth="xl" sx={{ pt: 4, pb: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Cửa hàng
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tìm kiếm và khám phá sản phẩm yêu thích
          </Typography>
        </Box>
      </Container>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: { xs: '100%', md: '300px' },
            minWidth: { md: '300px' },
            backgroundColor: 'white',
            borderRight: { md: '1px solid #e0e0e0' },
            p: 3,
            maxHeight: { md: 'calc(100vh - 200px)' },
            overflowY: { md: 'auto' },
            position: { md: 'sticky' },
            top: { md: 0 }
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Bộ lọc
          </Typography>
          
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 3 }}
          />

          {/* Price Range */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>Khoảng giá</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000000}
                  step={1000000}
                  valueLabelFormat={(value) => formatPrice(value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">{formatPrice(priceRange[0])}</Typography>
                  <Typography variant="caption">{formatPrice(priceRange[1])}</Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Category Filter */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>Danh mục</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Tất cả danh mục</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          {/* Brand Filter */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>Thương hiệu</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Tất cả thương hiệu</MenuItem>
                  {brands.map(brand => (
                    <MenuItem key={brand.id} value={String(brand.id)}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          {/* RAM Filter */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>RAM</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {ramOptions.map(ram => (
                  <FormControlLabel
                    key={ram}
                    control={
                      <Checkbox
                        checked={selectedRam.includes(ram)}
                        onChange={() => handleRamChange(ram)}
                        size="small"
                      />
                    }
                    label={ram}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* SSD Filter */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1" fontWeight={600}>Ổ cứng SSD</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {ssdOptions.map(ssd => (
                  <FormControlLabel
                    key={ssd}
                    control={
                      <Checkbox
                        checked={selectedSsd.includes(ssd)}
                        onChange={() => handleSsdChange(ssd)}
                        size="small"
                      />
                    }
                    label={ssd}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

          {/* Clear Filters */}
          <Button
            fullWidth
            variant="outlined"
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Xóa tất cả bộ lọc
          </Button>
        </Box>

        {/* Right Content */}
        <Box sx={{ flex: 1, p: 3, minHeight: 'calc(100vh - 200px)' }}>
          {/* Quick Filter Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sắp xếp theo"
                >
                  <MenuItem value="name">Tên A-Z</MenuItem>
                  <MenuItem value="price_asc">Giá từ thấp lên cao</MenuItem>
                  <MenuItem value="price_desc">Giá từ cao xuống thấp</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} sản phẩm
              </Typography>
            </Stack>
          </Paper>

          {/* Active Filters */}
          {(searchTerm || selectedCategory || selectedBrand || selectedRam.length > 0 || selectedSsd.length > 0) && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {searchTerm && (
                  <Chip
                    label={`"${searchTerm}"`}
                    onDelete={() => setSearchTerm('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {selectedCategory && (
                  <Chip
                    label={getCategoryName(parseInt(selectedCategory))}
                    onDelete={() => setSelectedCategory('')}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                )}
                {selectedBrand && (
                  <Chip
                    label={getBrandName(parseInt(selectedBrand))}
                    onDelete={() => setSelectedBrand('')}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
                {selectedRam.map(ram => (
                  <Chip
                    key={ram}
                    label={`RAM ${ram}`}
                    onDelete={() => handleRamChange(ram)}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ))}
                {selectedSsd.map(ssd => (
                  <Chip
                    key={ssd}
                    label={`SSD ${ssd}`}
                    onDelete={() => handleSsdChange(ssd)}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">
                Không tìm thấy sản phẩm nào
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Thử thay đổi bộ lọc để xem thêm sản phẩm
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Shop;