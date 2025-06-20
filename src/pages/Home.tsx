import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
  Divider,
  Stack,
} from "@mui/material";
// Import các kiểu dữ liệu đã định nghĩa
import type { Product, Category, Brand, Banner, News, ApiResponse } from "../types/product.type";
// Import instance Axios
import instance from "../apis/index";

const Home = () => {
  // States cho các phần dữ liệu
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải chung cho tất cả các phần
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);

  // Hàm để lấy sản phẩm nổi bật (ví dụ: 8 sản phẩm)
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      // Giả định API endpoint là `/products` và có thể lọc theo `is_featured` hoặc có logic riêng
      const { data } = await instance.get<ApiResponse<Product[]>>("/products", {
        params: { limit: 8, is_featured: true }, // Thêm is_featured nếu API hỗ trợ
      });
      setFeaturedProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    }
  }, []);

  // Hàm để lấy sản phẩm mới nhất
  const fetchLatestProducts = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<Product[]>>("/products", {
        params: { limit: 8, sort_by: 'created_at', sort_order: 'desc' },
      });
      setLatestProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch latest products:", error);
    }
  }, []);

  // Hàm để lấy sản phẩm giảm giá (ví dụ: có giá khuyến mãi, hoặc discount > 0)
  const fetchDiscountedProducts = useCallback(async () => {
    try {
      // Giả định API endpoint có thể lọc sản phẩm giảm giá
      const { data } = await instance.get<ApiResponse<Product[]>>("/products", {
        params: { limit: 8, has_discount: true }, // Thêm has_discount nếu API hỗ trợ
      });
      setDiscountedProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch discounted products:", error);
    }
  }, []);

  // Hàm để lấy banners
  const fetchBanners = useCallback(async () => {
    try {
      // Giả định API endpoint cho banners là `/banners`
      const { data } = await instance.get<ApiResponse<Banner[]>>("/banners", {
        params: { limit: 3, is_active: true, sort_by: 'order', sort_order: 'asc' }, // Lấy 3 banner đang hoạt động
      });
      setBanners(data.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  }, []);

  // Hàm để lấy danh mục sản phẩm
  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<Category[]>>("/categories", {
        params: { limit: 6 }, // Lấy một số danh mục tiêu biểu
      });
      setCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Hàm để lấy thương hiệu nổi bật
  const fetchFeaturedBrands = useCallback(async () => {
    try {
      // Giả định API có thể lọc thương hiệu nổi bật, hoặc lấy tất cả và chọn
      const { data } = await instance.get<ApiResponse<Brand[]>>("/brands", {
        params: { limit: 6, is_featured: true }, // Thêm is_featured nếu API hỗ trợ
      });
      setFeaturedBrands(data.data);
    } catch (error) {
      console.error("Failed to fetch featured brands:", error);
    }
  }, []);

  // Hàm để lấy tin tức mới nhất
  const fetchLatestNews = useCallback(async () => {
    try {
      const { data } = await instance.get<ApiResponse<News[]>>("/news", {
        params: { limit: 3, sort_by: 'created_at', sort_order: 'desc' }, // Lấy 3 bài tin tức mới nhất
      });
      setLatestNews(data.data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  }, []);


  // useEffect để tải tất cả dữ liệu khi component được mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeaturedProducts(),
        fetchLatestProducts(),
        fetchDiscountedProducts(),
        fetchBanners(),
        fetchCategories(),
        fetchFeaturedBrands(),
        fetchLatestNews(),
      ]);
      setLoading(false);
    };

    loadAllData();
  }, [fetchFeaturedProducts, fetchLatestProducts, fetchDiscountedProducts, fetchBanners, fetchCategories, fetchFeaturedBrands, fetchLatestNews]);


  // Helper component để hiển thị danh sách sản phẩm theo từng section
  const ProductSection = ({ title, productsList }: { title: string; productsList: Product[] }) => (
    <Box sx={{ my: 5 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>
      {productsList.length > 0 ? (
        <Grid container spacing={3}>
          {productsList.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
                      height: 180,
                      objectFit: "contain",
                      padding: "16px",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ minHeight: '50px' }}>
                      {product.name}
                    </Typography>
                    {product.variants && product.variants.length > 0 && (
                      <Typography variant="body1" color="text.secondary">
                        Giá từ: {product.variants[0].price.toLocaleString("vi-VN")}₫
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
        <Typography variant="body1" textAlign="center" color="text.secondary">
          Không có sản phẩm nào để hiển thị trong phần này.
        </Typography>
      )}
    </Box>
  );

  return (
    <Container sx={{ mt: 4 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 150px)">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Phần Banner Quảng cáo */}
          {/* {banners.length > 0 && (
            <Box sx={{ my: 4 }}>
              <Grid container spacing={2}>
                {banners.map((banner) => (
                  <Grid item xs={12} md={banners.length === 1 ? 12 : (banners.length === 2 ? 6 : 4)} key={banner.id}>
                    <Card
                      sx={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    > */}
                      {/* <Link to={banner.link || '#'} style={{ textDecoration: 'none' }}>
                        <CardMedia
                          component="img"
                          image={banner.image_url || "https://placehold.co/1200x400/888888/FFFFFF?text=Banner"}
                          alt={banner.title || "Banner Quảng cáo"}
                          sx={{ height: { xs: 150, sm: 250, md: 300 }, objectFit: "cover" }}
                        />
                        {banner.title && (
                          <CardContent sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                            color: 'white',
                            p: 2,
                          }}>
                            <Typography variant="h6" component="div">{banner.title}</Typography>
                            {banner.description && <Typography variant="body2">{banner.description}</Typography>}
                          </CardContent>
                        )}
                      </Link> */}
                    {/* </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 5 }} /> */}

          {/* Phần Danh mục Sản phẩm */}
          {categories.length > 0 && (
            <Box sx={{ my: 5 }}>
              <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                Khám phá Danh mục
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {categories.map((category) => (
                  <Grid item key={category.id} xs={6} sm={4} md={3} lg={2}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Link to={`/categories/${category.id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                        {/* Có thể thêm icon hoặc hình ảnh cho danh mục tại đây */}
                        <Box sx={{ width: 60, height: 60, mb: 1, bgcolor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h4" color="primary">🛍️</Typography> {/* Icon placeholder */}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {category.name}
                        </Typography>
                      </Link>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 5 }} />

          {/* Phần Sản phẩm nổi bật */}
          <ProductSection title="Sản phẩm nổi bật" productsList={featuredProducts} />

          <Divider sx={{ my: 5 }} />

          {/* Phần Sản phẩm mới nhất */}
          <ProductSection title="Sản phẩm mới nhất" productsList={latestProducts} />

          <Divider sx={{ my: 5 }} />

          {/* Phần Sản phẩm giảm giá */}
          <ProductSection title="Sản phẩm giảm giá" productsList={discountedProducts} />

          <Divider sx={{ my: 5 }} />

          {/* Phần Thương hiệu nổi bật */}
          {featuredBrands.length > 0 && (
            <Box sx={{ my: 5 }}>
              <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                Thương hiệu nổi bật
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {featuredBrands.map((brand) => (
                  <Grid item key={brand.id} xs={6} sm={4} md={3} lg={2}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Link to={`/brands/${brand.id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                        {/* Có thể thêm logo thương hiệu tại đây */}
                        <Box sx={{ width: 80, height: 80, mb: 1, bgcolor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h5" color="secondary">🏢</Typography> {/* Logo placeholder */}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {brand.name}
                        </Typography>
                      </Link>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 5 }} />

          {/* Phần Tin tức mới nhất */}
          {latestNews.length > 0 && (
            <Box sx={{ my: 5 }}>
              <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                Tin tức mới nhất
              </Typography>
              <Grid container spacing={3}>
                {latestNews.map((newsItem) => (
                  <Grid item key={newsItem.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <Link to={`/news/${newsItem.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <CardMedia
                          component="img"
                          image={newsItem.thumbnail || "https://placehold.co/600x300/AAAAAA/FFFFFF?text=News"}
                          alt={newsItem.title}
                          sx={{ height: 180, objectFit: "cover" }}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {newsItem.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3, // Giới hạn 3 dòng
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {newsItem.content}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                            {new Date(newsItem.created_at).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Link>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          component={Link}
                          to={`/news/${newsItem.id}`}
                          sx={{ borderRadius: "15px" }}
                        >
                          Đọc thêm
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Home;
