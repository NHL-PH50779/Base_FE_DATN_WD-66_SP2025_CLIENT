import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import type { Category, Brand, NewsItem, DisplayProduct } from "../types/product.type";
import {
  getAllLaptops,
  getCategories,
  getBrands,
  getNews,
} from "../apis/product.api"; // Đảm bảo đường dẫn này đúng với file api.ts/js của bạn

// Component hiển thị từng sản phẩm (giữ nguyên)
const ProductCard = ({ product }: { product: DisplayProduct }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const originalPrice = product.discount && product.discount > 0
    ? product.price / (1 - product.discount / 100)
    : product.price;

  const displayImage = product.variant_image || product.thumbnail;

  return (
    <Link to={`/product/${product.id}`} className="block w-full">
      <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
        <img src={displayImage} alt={product.name} className="w-full h-32 object-contain mb-2 rounded" />
        <Typography variant="body2" className="text-gray-600 text-sm mb-1">SKU: {product.sku || 'N/A'}</Typography>
        <Typography variant="h6" className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">{product.name}</Typography>
        <p className="text-gray-600 text-sm mb-1 line-clamp-1">{product.specs}</p>
        <div className="flex justify-center items-center text-yellow-500 mb-2">
          {'★'.repeat(Math.floor(product.rating || 0))}
          {'☆'.repeat(5 - Math.floor(product.rating || 0))} ({product.rating ? product.rating.toFixed(1) : 'N/A'})
        </div>
        {product.discount && product.discount > 0 ? (
          <>
            <p className="text-gray-500 line-through text-sm">{formatPrice(originalPrice)}</p>
            <p className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</p>
            <p className="text-green-600 text-sm font-semibold">Giảm {product.discount}%</p>
          </>
        ) : (
          <p className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</p>
        )}
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">Xem chi tiết</button>
      </div>
    </Link>
  );
};

const Home = () => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tải sản phẩm
        const productsRes = await getAllLaptops();
        setProducts(productsRes.data); // Giả định API trả về mảng DisplayProduct trực tiếp

        // Tải danh mục
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data); // Giả định API trả về mảng Category trực tiếp

        // Tải thương hiệu
        const brandsRes = await getBrands();
        setBrands(brandsRes.data); // Giả định API trả về mảng Brand trực tiếp

        // Tải tin tức
        const newsRes = await getNews();
        setNews(newsRes.data.sort((a: NewsItem, b: NewsItem) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)); // Lấy 3 bài tin tức mới nhất và sắp xếp

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Các phần lọc và sắp xếp dữ liệu vẫn giữ nguyên, hoạt động trên dữ liệu đã được tải về
  const featuredProducts = products.filter(p => (p.rating || 0) >= 4.5).slice(0, 5);
  const newArrivals = [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const discountedProducts = products.filter(p => (p.discount || 0) > 0).sort((a, b) => (b.discount || 0) - (a.discount || 0)).slice(0, 5);

  const renderSectionTitle = (title: string) => (
    <Typography variant="h5" className="text-center font-bold text-gray-800 mb-6 mt-8">
      {title}
    </Typography>
  );

  const renderProductSection = (title: string, productList: DisplayProduct[]) => (
    <section className="mb-12">
      {renderSectionTitle(title)}
      {productList.length === 0 ? (
        <Typography className="text-center text-gray-600">Không có sản phẩm nào để hiển thị.</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productList.map((product) => (
            <ProductCard key={product.variant_id} product={product} />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <Container className="home py-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Typography variant="h6" className="text-gray-700">Đang tải dữ liệu...</Typography>
        </div>
      ) : (
        <>
          {/* Danh mục sản phẩm */}
          ---
          {renderSectionTitle("Danh mục sản phẩm")}
          <section className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link to={`/category/${category.id}`} key={category.id} className="block">
                  <Box className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                    {category.image && (
                      <img src={category.image} alt={category.name} className="w-24 h-24 object-contain mx-auto mb-2 rounded-full" />
                    )}
                    <Typography variant="subtitle1" className="font-semibold text-gray-800">{category.name}</Typography>
                  </Box>
                </Link>
              ))}
            </div>
          </section>

          {/* Thương hiệu nổi bật */}
          ---
          {renderSectionTitle("Thương hiệu nổi bật")}
          <section className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <Link to={`/brand/${brand.id}`} key={brand.id} className="block">
                  <Box className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                    {brand.logo && (
                      <img src={brand.logo} alt={brand.name} className="w-32 h-16 object-contain mx-auto mb-2" />
                    )}
                    <Typography variant="subtitle1" className="font-semibold text-gray-800">{brand.name}</Typography>
                  </Box>
                </Link>
              ))}
            </div>
          </section>

          {/* Sản phẩm nổi bật */}
          {renderProductSection("Sản phẩm nổi bật", featuredProducts)}

          {/* Sản phẩm mới nhất */}
          {renderProductSection("Sản phẩm mới nhất", newArrivals)}

          {/* Sản phẩm giảm giá */}
          {renderProductSection("Sản phẩm giảm giá", discountedProducts)}

          {/* Tin tức/Blog mới nhất */}
          ---
          {renderSectionTitle("Tin tức/Blog mới nhất")}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link to={`/news/${item.id}`} key={item.id} className="block">
                  <Box className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4 flex-grow">
                      <Typography variant="h6" className="font-semibold text-gray-800 line-clamp-2 mb-2">{item.title}</Typography>
                      <Typography variant="body2" className="text-gray-600 line-clamp-3">{item.content}</Typography>
                      <Typography variant="caption" color="textSecondary" className="block mt-2">
                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                      </Typography>
                    </div>
                    <button className="m-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 self-start">Đọc thêm</button>
                  </Box>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </Container>
  );
};

export default Home;