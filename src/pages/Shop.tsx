import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Pagination, // Import Pagination
} from "@mui/material";
// Import các kiểu dữ liệu đã định nghĩa
import type { Product, ApiResponse, Category, Brand, Attribute, AttributeValue } from "../types/product.type";
// Import instance Axios
import instance from "../apis/index";

// Giá trị tối đa mặc định cho thanh trượt giá
const MAX_PRICE_VALUE = 100000000; // Ví dụ: 100 triệu VNĐ

const CategoryPage = () => {
  const { categoryId: paramCategoryId } = useParams<{ categoryId?: string }>();

  // States cho dữ liệu sản phẩm
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // States cho dữ liệu lọc (dropdown, checkbox)
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  // States cho các giá trị lọc được chọn
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(paramCategoryId ? Number(paramCategoryId) : '');
  const [selectedBrandId, setSelectedBrandId] = useState<number | ''>('');
  // Map: attributeId -> [attributeValueId1, attributeValueId2, ...]
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<Record<number, number[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE_VALUE]);
  const [sortBy, setSortBy] = useState<string>('created_at'); // Mặc định sắp xếp theo ngày tạo
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Mặc định sắp xếp giảm dần

  // States cho phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const productsPerPage = 12; // Số sản phẩm trên mỗi trang

  // Hàm để lấy danh mục
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<Category[]>>("/categories");
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Hàm để lấy thương hiệu
  const fetchBrands = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<Brand[]>>("/brands");
      setBrands(data.data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  }, []);

  // Hàm để lấy thuộc tính và giá trị thuộc tính
  const fetchAttributes = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<Attribute[]>>("/attributes");
      setAttributes(data.data);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  }, []);

  // Hàm chính để lấy sản phẩm dựa trên các bộ lọc và phân trang
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params: any = {
        page: currentPage,
        limit: productsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        min_price: priceRange[0],
        max_price: priceRange[1],
      };

      if (selectedCategoryId !== '') {
        params.category_id = selectedCategoryId;
      }
      if (selectedBrandId !== '') {
        params.brand_id = selectedBrandId;
      }

      // Thêm các giá trị thuộc tính đã chọn vào params
      const attributeValueIds: number[] = [];
      for (const attrId in selectedAttributeValues) {
        attributeValueIds.push(...selectedAttributeValues[attrId]);
      }
      if (attributeValueIds.length > 0) {
        // API có thể cần định dạng 'attribute_values[]=1,2,3' hoặc 'attribute_values=1,2,3'
        // Tôi sẽ dùng định dạng mảng để backend xử lý dễ hơn.
        params.attribute_values = attributeValueIds.join(','); // Ví dụ: 1,3,5
      }

      const { data } = await instance.get<ApiResponse<Product[]>>("/products", { params });
      setProducts(data.data);
      setTotalProducts(data.meta?.total || 0);
      setTotalPages(data.meta?.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, [currentPage, productsPerPage, sortBy, sortOrder, selectedCategoryId, selectedBrandId, selectedAttributeValues, priceRange]);

  // Effects để tải dữ liệu ban đầu (danh mục, thương hiệu, thuộc tính)
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchAttributes();
  }, [fetchCategories, fetchBrands, fetchAttributes]);

  // Effect để tải sản phẩm khi các bộ lọc hoặc trang thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Cập nhật selectedCategoryId khi paramCategoryId thay đổi (ví dụ: điều hướng từ trang chủ)
  useEffect(() => {
    if (paramCategoryId) {
      setSelectedCategoryId(Number(paramCategoryId));
    }
  }, [paramCategoryId]);


  // Handlers cho việc thay đổi bộ lọc
  const handleCategoryChange = (event: any) => {
    setSelectedCategoryId(event.target.value as number | '');
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleBrandChange = (event: any) => {
    setSelectedBrandId(event.target.value as number | '');
    setCurrentPage(1);
  };

  const handleAttributeValueChange = (attributeId: number, attributeValueId: number) => {
    setSelectedAttributeValues((prev) => {
      const newValues = { ...prev };
      if (!newValues[attributeId]) {
        newValues[attributeId] = [];
      }

      if (newValues[attributeId].includes(attributeValueId)) {
        newValues[attributeId] = newValues[attributeId].filter((id) => id !== attributeValueId);
      } else {
        newValues[attributeId].push(attributeValueId);
      }
      return newValues;
    });
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleSortChange = (event: any) => {
    const [by, order] = (event.target.value as string).split('_');
    setSortBy(by);
    setSortOrder(order as 'asc' | 'desc');
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const resetFilters = () => {
    setSelectedCategoryId(paramCategoryId ? Number(paramCategoryId) : '');
    setSelectedBrandId('');
    setSelectedAttributeValues({});
    setPriceRange([0, MAX_PRICE_VALUE]);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Danh mục sản phẩm
      </Typography>

      <Grid container spacing={3}>
        {/* Phần Lọc và Sắp xếp */}
        <Grid item xs={12} md={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "8px", mb: 3 }}>
            <Typography variant="h6" gutterBottom>Bộ lọc</Typography>

            {/* Lọc theo Danh mục */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-select-label">Danh mục</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategoryId}
                label="Danh mục"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Lọc theo Thương hiệu */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="brand-select-label">Thương hiệu</InputLabel>
              <Select
                labelId="brand-select-label"
                id="brand-select"
                value={selectedBrandId}
                label="Thương hiệu"
                onChange={handleBrandChange}
              >
                <MenuItem value="">Tất cả thương hiệu</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Lọc theo Giá */}
            <Typography gutterBottom sx={{ mt: 3 }}>Khoảng giá:</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={MAX_PRICE_VALUE}
              step={100000} // Bước nhảy 100.000 VNĐ
              marks={[
                { value: 0, label: '0₫' },
                { value: MAX_PRICE_VALUE / 2, label: `${(MAX_PRICE_VALUE / 2).toLocaleString("vi-VN")}₫` },
                { value: MAX_PRICE_VALUE, label: `${MAX_PRICE_VALUE.toLocaleString("vi-VN")}₫` },
              ]}
              disableSwap // Ngăn kéo giá trị thấp hơn vượt quá giá trị cao hơn
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">{priceRange[0].toLocaleString("vi-VN")}₫</Typography>
                <Typography variant="body2">{priceRange[1].toLocaleString("vi-VN")}₫</Typography>
            </Box>


            {/* Lọc theo Thuộc tính */}
            {attributes.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Thuộc tính</Typography>
                {attributes.map((attr) => (
                  <Box key={attr.id} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{attr.name}</Typography>
                    <FormGroup>
                      {attr.values.map((val) => (
                        <FormControlLabel
                          key={val.id}
                          control={
                            <Checkbox
                              checked={selectedAttributeValues[attr.id]?.includes(val.id) || false}
                              onChange={() => handleAttributeValueChange(attr.id, val.id)}
                            />
                          }
                          label={val.value}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                ))}
              </Box>
            )}

            {/* Nút Reset Bộ lọc */}
            <Button
              variant="outlined"
              onClick={resetFilters}
              fullWidth
              sx={{ mt: 3 }}
            >
              Đặt lại bộ lọc
            </Button>
          </Box>
        </Grid>

        {/* Phần Hiển thị Sản phẩm */}
        <Grid item xs={12} md={9}>
          {/* Sắp xếp */}
          <FormControl sx={{ minWidth: 200, mb: 3 }}>
            <InputLabel id="sort-select-label">Sắp xếp theo</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={`${sortBy}_${sortOrder}`}
              label="Sắp xếp theo"
              onChange={handleSortChange}
            >
              <MenuItem value="created_at_desc">Mới nhất</MenuItem>
              <MenuItem value="created_at_asc">Cũ nhất</MenuItem>
              <MenuItem value="price_asc">Giá: Thấp đến Cao</MenuItem>
              <MenuItem value="price_desc">Giá: Cao đến Thấp</MenuItem>
              <MenuItem value="name_asc">Tên: A-Z</MenuItem>
              <MenuItem value="name_desc">Tên: Z-A</MenuItem>
            </Select>
          </FormControl>

          {loadingProducts ? (
            // Hiển thị vòng tròn tải nếu đang tải dữ liệu sản phẩm
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {products.length > 0 ? (
                <Grid container spacing={4}>
                  {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          transition: "transform 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <CardMedia
                            component="img"
                            image={product.thumbnail || "https://placehold.co/400x300/CCCCCC/FFFFFF?text=No+Image"}
                            alt={product.name}
                            sx={{
                              height: 200,
                              objectFit: "contain",
                              padding: "16px",
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: '60px' }}>
                              {product.name}
                            </Typography>
                            {product.variants && product.variants.length > 0 && (
                              <Typography variant="body1" color="text.secondary">
                                Giá từ: {product.variants[0].price.toLocaleString("vi-VN")}₫
                              </Typography>
                            )}
                            {product.brand && (
                              <Typography variant="body2" color="text.secondary">
                                Thương hiệu: {product.brand.name}
                              </Typography>
                            )}
                            {product.category && (
                              <Typography variant="body2" color="text.secondary">
                                Danh mục: {product.category.name}
                              </Typography>
                            )}
                          </CardContent>
                        </Link>
                        <Box sx={{ p: 2, pt: 0 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            component={Link}
                            to={`/products/${product.id}`}
                            sx={{
                              borderRadius: "20px",
                              mt: 1,
                              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                              color: "white",
                              "&:hover": {
                                background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                              },
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="h6" textAlign="center" mt={4}>
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                </Typography>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <Stack spacing={2} sx={{ my: 4, alignItems: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2">
                    Hiển thị {products.length} trên {totalProducts} sản phẩm
                  </Typography>
                </Stack>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryPage;
