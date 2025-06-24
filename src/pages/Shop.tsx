import React, { useEffect, useState } from 'react';
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
  Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product.type';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedBrand, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
        brandService.getAllBrands()
      ]);
      
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category_id === parseInt(selectedCategory)
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.brand_id === parseInt(selectedBrand)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0);
        case 'price_desc':
          return (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('name');
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  const getBrandName = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || '';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Cửa hàng
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Tìm kiếm và khám phá sản phẩm yêu thích
        </Typography>
      </Box>

      {/* Horizontal Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          {/* Search */}
          <TextField
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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

          {/* Brand Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
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

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sắp xếp"
            >
              <MenuItem value="name">Tên A-Z</MenuItem>
              <MenuItem value="price_asc">Giá tăng</MenuItem>
              <MenuItem value="price_desc">Giá giảm</MenuItem>
            </Select>
          </FormControl>

          {/* Clear Filters */}
          <Button
            variant="outlined"
            size="small"
            onClick={clearFilters}
            sx={{ minWidth: 'auto' }}
          >
            Xóa lọc
          </Button>
        </Stack>
      </Paper>

      <Box>
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
            </Stack>
          </Box>
        )}

        {/* Results Count & Products */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            {filteredProducts.length} sản phẩm
          </Typography>
        </Box>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
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
    </Container>
  );
};

export default Shop;