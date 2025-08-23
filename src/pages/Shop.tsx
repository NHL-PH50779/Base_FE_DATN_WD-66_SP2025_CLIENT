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
  FormControlLabel,
  Pagination
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

  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedSsd, setSelectedSsd] = useState<string[]>([]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Các tùy chọn lọc theo dữ liệu thuộc tính có sẵn
  const ramOptions = ['8GB', '16GB', '32GB', '64GB'];
  const ssdOptions = ['128GB', '256GB', '512GB', '1TB'];
  const cpuOptions = ['Intel', 'AMD'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load data sequentially to reduce initial load time
      const productsRes = await productService.getAllProducts();
      const productsData = productsRes.data || [];
      setProducts(productsData);
      
      // Debug: Kiểm tra tên sản phẩm
      console.log('Products data:', productsData);
      if (productsData.length > 0) {
        console.log('Sample product names:');
        productsData.slice(0, 5).forEach((product, index) => {
          console.log(`${index + 1}. ${product.name}`);
          console.log(`   Description: ${product.description || 'N/A'}`);
          if (product.variants && product.variants.length > 0) {
            console.log(`   Variants: ${product.variants.map(v => v.Name || 'N/A').join(', ')}`);
          }
        });
      }
      
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



    // RAM filter - chỉ dùng text search
    if (selectedRam.length > 0) {
      console.log('Filtering by RAM:', selectedRam);
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description || ''}`.toLowerCase();
        const variantText = product.variants?.map(v => v.Name || '').join(' ').toLowerCase() || '';
        const searchText = `${productText} ${variantText}`;
        
        const found = selectedRam.some(ram => {
          const ramNum = ram.replace('GB', '');
          const match = searchText.includes(ram.toLowerCase()) || 
                       searchText.includes(`${ramNum}gb`) ||
                       searchText.includes(`${ramNum} gb`) ||
                       searchText.includes(`ram ${ramNum}`) ||
                       searchText.includes(`${ramNum}g`) ||
                       searchText.match(new RegExp(`\\b${ramNum}\\s*gb?\\b`, 'i'));
          if (match) console.log('RAM match:', ram, 'in product:', product.name, 'searchText:', searchText);
          return match;
        });
        return found;
      });
      console.log('Products after RAM filter:', filtered.length);
    }

    // SSD filter - chỉ dùng text search
    if (selectedSsd.length > 0) {
      console.log('Filtering by SSD:', selectedSsd);
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description || ''}`.toLowerCase();
        const variantText = product.variants?.map(v => v.Name || '').join(' ').toLowerCase() || '';
        const searchText = `${productText} ${variantText}`;
        
        const found = selectedSsd.some(ssd => {
          const ssdNum = ssd.replace(/GB|TB/i, '');
          const unit = ssd.includes('TB') ? 'tb' : 'gb';
          const match = searchText.includes(ssd.toLowerCase()) || 
                       searchText.includes(`${ssdNum}${unit}`) ||
                       searchText.includes(`${ssdNum} ${unit}`) ||
                       searchText.includes(`ssd ${ssdNum}`) ||
                       searchText.match(new RegExp(`\\b${ssdNum}\\s*${unit}\\b`, 'i')) ||
                       (unit === 'tb' && searchText.includes(`${ssdNum}t`));
          if (match) console.log('SSD match:', ssd, 'in product:', product.name, 'searchText:', searchText);
          return match;
        });
        return found;
      });
      console.log('Products after SSD filter:', filtered.length);
    }

    // CPU filter - chỉ dùng text search
    if (selectedCpu.length > 0) {
      console.log('Filtering by CPU:', selectedCpu);
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description || ''}`;
        const variantText = product.variants?.map(v => v.Name || '').join(' ') || '';
        const searchText = `${productText} ${variantText}`;
        
        const found = selectedCpu.some(cpu => {
          const match = searchText.toLowerCase().includes(cpu.toLowerCase());
          if (match) console.log('CPU match:', cpu, 'in product:', product.name, 'searchText:', searchText);
          return match;
        });
        return found;
      });
      console.log('Products after CPU filter:', filtered.length);
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
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy, selectedRam, selectedSsd, selectedCpu]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, selectedRam, selectedSsd, selectedCpu]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('name');
    setSelectedRam([]);
    setSelectedSsd([]);
    setSelectedCpu([]);
    setCurrentPage(1); // Reset to first page
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

  const handleCpuChange = useCallback((cpu: string) => {
    setSelectedCpu(prev => 
      prev.includes(cpu) 
        ? prev.filter(c => c !== cpu)
        : [...prev, cpu]
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
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Cửa hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
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

          {/* Tạm thời ẩn bộ lọc RAM/SSD/CPU vì dữ liệu không phù hợp */}
          {false && (
            <>
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

              {/* CPU Filter */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight={600}>Bộ xử lý (CPU)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup>
                    {cpuOptions.slice(0, 10).map(cpu => (
                      <FormControlLabel
                        key={cpu}
                        control={
                          <Checkbox
                            checked={selectedCpu.includes(cpu)}
                            onChange={() => handleCpuChange(cpu)}
                            size="small"
                          />
                        }
                        label={cpu.length > 30 ? `${cpu.substring(0, 30)}...` : cpu}
                        title={cpu}
                      />
                    ))}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>
            </>
          )}

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
              <Stack direction="row" spacing={2} alignItems="center">
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
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Hiển thị</InputLabel>
                  <Select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    label="Hiển thị"
                  >
                    <MenuItem value={6}>6 sản phẩm</MenuItem>
                    <MenuItem value={12}>12 sản phẩm</MenuItem>
                    <MenuItem value={24}>24 sản phẩm</MenuItem>
                    <MenuItem value={48}>48 sản phẩm</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
              <Typography variant="body2" color="text.secondary">
                Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} trong {filteredProducts.length} sản phẩm
              </Typography>
            </Stack>
          </Paper>

          {/* Active Filters */}
          {(searchTerm || selectedCategory || selectedBrand) && (
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

              </Stack>
            </Box>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPagination-ul': {
                        justifyContent: 'center'
                      }
                    }}
                  />
                </Box>
              )}
            </>
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