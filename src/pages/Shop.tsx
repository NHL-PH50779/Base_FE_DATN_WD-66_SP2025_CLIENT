import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Pagination,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material/Select";

// Import các hàm API từ shop.api.ts
import {
  getShopProducts,
  getShopBrands,
  getShopCategories,
  getShopAttributes,
} from "../apis/shop.api"; // Đảm bảo đường dẫn này đúng

// Import các kiểu dữ liệu từ product.type
import type {
  Brand,
  Category,
  Attribute,
  AttributeValue,
} from "../types/shop.type";
import type {
  
  DisplayProduct,
} from "../types/product.type";

// ProductCard component (giữ nguyên)
const ProductCard = ({ product }: { product: DisplayProduct }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const displayImage = product.variant_image || product.thumbnail;

  return (
    <Link to={`/product/${product.id}`} className="block w-full">
      <Box className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-32 object-contain mb-2 rounded"
        />
        <Typography variant="body2" className="text-gray-600 text-sm mb-1">
          SKU: {product.sku || "N/A"}
        </Typography>
        <Typography
          variant="h6"
          className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem]"
        >
          {product.name}
        </Typography>
        <p className="text-gray-600 text-sm mb-1 line-clamp-1">
          {product.specs
            .map((s) => `${s.attribute_name}: ${s.value}`)
            .join(", ")}
        </p>
        <div className="flex justify-center items-center text-yellow-500 mb-2">
          {"★".repeat(Math.floor(product.rating || 0))}
          {"☆".repeat(5 - Math.floor(product.rating || 0))} (
          {product.rating ? product.rating.toFixed(1) : "N/A"})
        </div>
        {product.discount && product.discount > 0 ? (
          <>
            <p className="text-gray-500 line-through text-sm">
              {formatPrice(product.originalPrice)}
            </p>
            <p className="text-red-600 font-bold text-lg">
              {formatPrice(product.price)}
            </p>
            <p className="text-green-600 text-sm font-semibold">
              Giảm {product.discount}%
            </p>
          </>
        ) : (
          <p className="text-red-600 font-bold text-lg">
            {formatPrice(product.price)}
          </p>
        )}
        <Button
          variant="contained"
          className="mt-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          Xem chi tiết
        </Button>
      </Box>
    </Link>
  );
};

const CATEGORY_PAGE_SIZE = 8; // Kích thước trang mặc định

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0); // Tổng số sản phẩm từ API
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // Dữ liệu bộ lọc (brands, attributes) cũng sẽ được tải từ API
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

  // State của các bộ lọc/sắp xếp/phân trang
  const [priceRange, setPriceRange] = useState<number[]>([0, 60000000]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Constants for price range (can be fetched from API or defined globally)
  const MIN_PRICE_GLOBAL = 0;
  const MAX_PRICE_GLOBAL = 60000000;

  // Hàm đọc bộ lọc từ URL (giữ nguyên)
  const getFiltersFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const minPrice = parseInt(params.get("minPrice") || MIN_PRICE_GLOBAL.toString());
    const maxPrice = parseInt(params.get("maxPrice") || MAX_PRICE_GLOBAL.toString());
    const brands = params.get("brands")?.split(",").map(Number).filter(Boolean) || [];
    const attributes = params.get("attributes")?.split(",").map(Number).filter(Boolean) || [];
    const sort = params.get("sort") || "default";
    const page = parseInt(params.get("page") || "1");

    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands(brands);
    setSelectedAttributes(attributes);
    setSortBy(sort);
    setCurrentPage(page);
  }, [location.search, MIN_PRICE_GLOBAL, MAX_PRICE_GLOBAL]);

  // Hàm cập nhật URL params (giữ nguyên)
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (priceRange[0] !== MIN_PRICE_GLOBAL) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== MAX_PRICE_GLOBAL) params.set("maxPrice", priceRange[1].toString());
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(","));
    if (selectedAttributes.length > 0) params.set("attributes", selectedAttributes.join(","));
    if (sortBy !== "default") params.set("sort", sortBy);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    navigate({ search: params.toString() }, { replace: true });
  }, [
    priceRange,
    selectedBrands,
    selectedAttributes,
    sortBy,
    currentPage,
    navigate,
    MIN_PRICE_GLOBAL,
    MAX_PRICE_GLOBAL,
  ]);

  // useEffect để tải dữ liệu ban đầu (brands, categories, attributes) một lần
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsRes, categoriesRes, attributesRes] = await Promise.all([
          getShopBrands(),
          getShopCategories(),
          getShopAttributes(),
        ]);
        setBrands(brandsRes);
        setCategories(categoriesRes);
        setAttributes(attributesRes.attributes);
        setAttributeValues(attributesRes.attributeValues);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
      }
    };
    fetchInitialData();
  }, []); // Chỉ chạy một lần khi component mount

  // useEffect để tải sản phẩm khi categoryId hoặc các bộ lọc thay đổi
  useEffect(() => {
    setLoading(true);
    getFiltersFromUrl(); // Đảm bảo state được đồng bộ với URL trước khi gọi API

    const fetchProducts = async () => {
      try {
        const params = {
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
          attributeValueIds: selectedAttributes.length > 0 ? selectedAttributes : undefined,
          sortBy: sortBy,
          page: currentPage,
          pageSize: CATEGORY_PAGE_SIZE,
        };
        const response = await getShopProducts(params);
        setProducts(response.products);
        setTotalProducts(response.totalProducts);

        // Cập nhật currentCategory dựa trên categoryId từ URL
        if (categoryId) {
          setCurrentCategory(
            categories.find((c) => c.id === parseInt(categoryId)) || null
          );
        } else {
          setCurrentCategory(null);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi fetchProducts khi `categories` đã được tải, đảm bảo `currentCategory` được tìm thấy đúng
    if (categories.length > 0 || !categoryId) { // categories.length > 0 nếu đã tải xong, hoặc nếu không có categoryId thì không cần chờ
        fetchProducts();
    }

  }, [
    categoryId,
    priceRange,
    selectedBrands,
    selectedAttributes,
    sortBy,
    currentPage,
    getFiltersFromUrl,
    categories, // Thêm categories vào dependency array
  ]);

  // useEffect để cập nhật URL mỗi khi các bộ lọc/sắp xếp/phân trang thay đổi
  useEffect(() => {
    updateUrlParams();
  }, [priceRange, selectedBrands, selectedAttributes, sortBy, currentPage, updateUrlParams]);


  const totalPages = Math.ceil(totalProducts / CATEGORY_PAGE_SIZE);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleBrandChange = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleAttributeChange = (attributeValueId: number) => {
    setSelectedAttributes((prev) =>
      prev.includes(attributeValueId)
        ? prev.filter((id) => id !== attributeValueId)
        : [...prev, attributeValueId]
    );
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Dữ liệu cho các bộ lọc từ API
  const uniqueBrands = brands;
  const uniqueAttributes: {
    attribute: Attribute;
    values: AttributeValue[];
  }[] = attributes.map((attr) => ({
    attribute: attr,
    values: attributeValues.filter((av) => av.attribute_id === attr.id),
  }));

  return (
    <Container className="category-page py-8">
      {loading && products.length === 0 ? ( // Chỉ hiển thị "Đang tải" nếu chưa có sản phẩm nào
        <div className="flex justify-center items-center h-64">
          <Typography variant="h6" className="text-gray-700">
            Đang tải sản phẩm...
          </Typography>
        </div>
      ) : (
        <>
          <Typography variant="h4" className="text-center font-bold text-gray-800 mb-6">
            {currentCategory ? currentCategory.name : "Tất cả sản phẩm"}
          </Typography>
          <Box className="flex gap-8">
            {/* Sidebar bộ lọc */}
            <Box className="w-1/4 pr-8 border-r border-gray-200">
              <Typography variant="h5" className="font-bold mb-4">
                BỘ LỌC
              </Typography>
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold mb-2">
                  DANH MỤC HIỆN TẠI
                </Typography>
                <Typography className="text-gray-700 text-lg">
                  {currentCategory ? currentCategory.name : "Tất cả"}
                </Typography>
                {categoryId && (
                  <Link to="/shop" className="text-blue-600 hover:underline text-sm mt-1 block">
                    Xem tất cả sản phẩm
                  </Link>
                )}
              </div>
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold mb-2">
                  KHOẢNG GIÁ
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={MIN_PRICE_GLOBAL}
                  max={MAX_PRICE_GLOBAL}
                  step={1000000}
                  marks={[
                    { value: MIN_PRICE_GLOBAL, label: "0đ" },
                    { value: 20000000, label: "20tr" },
                    { value: 40000000, label: "40tr" },
                    { value: MAX_PRICE_GLOBAL, label: "60tr+" },
                  ]}
                  disableSwap
                />
                <Box className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{priceRange[0].toLocaleString()}đ</span>
                  <span>{priceRange[1].toLocaleString()}đ</span>
                </Box>
              </div>
              <div className="mb-6">
                <Typography variant="h6" className="font-semibold mb-2">
                  HÃNG SẢN XUẤT
                </Typography>
                <FormGroup>
                  {uniqueBrands.map((brand) => (
                    <FormControlLabel
                      key={brand.id}
                      control={
                        <Checkbox
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => handleBrandChange(brand.id)}
                          size="small"
                        />
                      }
                      label={brand.name}
                    />
                  ))}
                </FormGroup>
              </div>
              {uniqueAttributes.map((attrGroup) => (
                <div key={attrGroup.attribute.id} className="mb-6">
                  <Typography variant="h6" className="font-semibold mb-2">
                    {attrGroup.attribute.name.toUpperCase()}
                  </Typography>
                  <FormGroup>
                    {attrGroup.values.map((attrValue) => (
                      <FormControlLabel
                        key={attrValue.id}
                        control={
                          <Checkbox
                            checked={selectedAttributes.includes(attrValue.id)}
                            onChange={() => handleAttributeChange(attrValue.id)}
                            size="small"
                          />
                        }
                        label={attrValue.value}
                      />
                    ))}
                  </FormGroup>
                </div>
              ))}
            </Box>
            {/* Phần hiển thị sản phẩm */}
            <Box className="w-3/4">
              <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold">
                  SẢN PHẨM ({totalProducts} SẢN PHẨM)
                </Typography>
                <Box className="flex items-center space-x-2">
                  <Typography variant="body1">Sắp xếp theo:</Typography>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Sắp xếp" }}
                    size="small"
                  >
                    <MenuItem value="default">Mặc định</MenuItem>
                    <MenuItem value="price-asc">Giá: Thấp đến Cao</MenuItem>
                    <MenuItem value="price-desc">Giá: Cao đến Thấp</MenuItem>
                    <MenuItem value="name-asc">Tên: A-Z</MenuItem>
                    <MenuItem value="name-desc">Tên: Z-A</MenuItem>
                    <MenuItem value="newest">Mới nhất</MenuItem>
                    <MenuItem value="oldest">Cũ nhất</MenuItem>
                  </Select>
                </Box>
              </Box>
              {products.length === 0 && !loading ? ( // Chỉ hiển thị nếu không có sản phẩm VÀ không còn tải
                <div className="text-center text-gray-600 text-lg mt-8">
                  Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.variant_id} product={product} />
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <Box className="flex justify-center mt-8">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={1}
                    boundaryCount={1}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CategoryPage;