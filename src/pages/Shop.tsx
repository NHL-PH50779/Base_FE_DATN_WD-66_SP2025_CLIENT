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
interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Attribute {
  id: number;
  name: string;
}

interface AttributeValue {
  id: number;
  attribute_id: number;
  value: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  created_at: string;
}

interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  discount?: number;
}
interface DisplayProduct {
  id: number; 
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  created_at: string;
  variant_id: number;
  sku: string;
  price: number;
  originalPrice: number;
  discount?: number;
  quantity: number;
  variant_image?: string;
  rating?: number;
  specs: {
    attribute_name: string;
    value: string;
  }[];
  brand_name: string;
}

const mockBrands: Brand[] = [
  { id: 1, name: "Dell" },
  { id: 2, name: "Apple" },
  { id: 3, name: "ASUS" },
  { id: 4, name: "Lenovo" },
  { id: 5, name: "HP" },
  { id: 6, name: "Acer" },
];

const mockCategories: Category[] = [
  { id: 1, name: "Laptop Gaming" },
  { id: 2, name: "Laptop Văn Phòng" },
  { id: 3, name: "Laptop Cao Cấp" },
];

const mockAttributes: Attribute[] = [
  { id: 1, name: "RAM" },
  { id: 2, name: "CPU" },
  { id: 3, name: "Màu sắc" },
  { id: 4, name: "Kích thước màn hình" },
];

const mockAttributeValues: AttributeValue[] = [
  { id: 101, attribute_id: 1, value: "8GB" },
  { id: 102, attribute_id: 1, value: "16GB" },
  { id: 103, attribute_id: 1, value: "32GB" },
  { id: 201, attribute_id: 2, value: "Intel i5" },
  { id: 202, attribute_id: 2, value: "Intel i7" },
  { id: 203, attribute_id: 2, value: "AMD Ryzen 9" },
  { id: 204, attribute_id: 2, value: "M1 Pro" },
  { id: 301, attribute_id: 3, value: "Bạc" },
  { id: 302, attribute_id: 3, value: "Xám" },
  { id: 303, attribute_id: 3, value: "Đen" },
  { id: 401, attribute_id: 4, value: "13 inch" },
  { id: 402, attribute_id: 4, value: "14 inch" },
  { id: 403, attribute_id: 4, value: "15 inch" },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Dell XPS 13 9310",
    description: "Mô tả Dell XPS 13 9310...",
    brand_id: 1,
    category_id: 3,
    thumbnail: "https://via.placeholder.com/300x200?text=Dell+XPS+13",
    created_at: "2023-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Laptop MacBook Pro 14 M1 Pro",
    description: "Mô tả MacBook Pro 14 M1 Pro...",
    brand_id: 2,
    category_id: 3,
    thumbnail: "https://via.placeholder.com/300x200?text=MacBook+Pro+14",
    created_at: "2023-02-20T11:30:00Z",
  },
  {
    id: 3,
    name: "Laptop ASUS ROG Zephyrus G14",
    description: "Mô tả ASUS ROG Zephyrus G14...",
    brand_id: 3,
    category_id: 1,
    thumbnail: "https://via.placeholder.com/300x200?text=ASUS+ROG+G14",
    created_at: "2023-03-10T09:00:00Z",
  },
  {
    id: 4,
    name: "Laptop Lenovo ThinkPad X1 Carbon Gen 9",
    description: "Mô tả Lenovo ThinkPad X1 Carbon...",
    brand_id: 4,
    category_id: 2,
    thumbnail: "https://via.placeholder.com/300x200?text=Lenovo+ThinkPad",
    created_at: "2023-04-05T14:00:00Z",
  },
  {
    id: 5,
    name: "Laptop HP Spectre x360",
    description: "Mô tả HP Spectre x360...",
    brand_id: 5,
    category_id: 3,
    thumbnail: "https://via.placeholder.com/300x200?text=HP+Spectre",
    created_at: "2023-05-12T16:00:00Z",
  },
  {
    id: 6,
    name: "Laptop Acer Predator Helios 300",
    description: "Mô tả Acer Predator Helios 300...",
    brand_id: 6,
    category_id: 1,
    thumbnail: "https://via.placeholder.com/300x200?text=Acer+Predator",
    created_at: "2023-06-01T08:00:00Z",
  },
  {
    id: 7,
    name: "Laptop Dell Inspiron 15",
    description: "Mô tả Dell Inspiron 15...",
    brand_id: 1,
    category_id: 2,
    thumbnail: "https://via.placeholder.com/300x200?text=Dell+Inspiron+15",
    created_at: "2023-07-20T10:00:00Z",
  },
  {
    id: 8,
    name: "Laptop ASUS VivoBook 15",
    description: "Mô tả ASUS VivoBook 15...",
    brand_id: 3,
    category_id: 2,
    thumbnail: "https://via.placeholder.com/300x200?text=ASUS+VivoBook+15",
    created_at: "2023-08-10T12:00:00Z",
  },
];

const mockProductVariants: ProductVariant[] = [
  { id: 101, product_id: 1, sku: "DELL-XPS13-B", price: 34990000, quantity: 5, image: "https://via.placeholder.com/300x200?text=Dell+XPS+13+Silver", discount: 14 },
  { id: 102, product_id: 1, sku: "DELL-XPS13-G", price: 35500000, quantity: 3, image: "https://via.placeholder.com/300x200?text=Dell+XPS+13+Grey" },
  { id: 201, product_id: 2, sku: "MBP14-M1P-16-512", price: 52990000, quantity: 8, image: "https://via.placeholder.com/300x200?text=MBP14+M1+Pro", discount: 6 },
  { id: 301, product_id: 3, sku: "ASUS-ROG-G14-32", price: 39990000, quantity: 2, image: "https://via.placeholder.com/300x200?text=ROG+G14+Black", discount: 13 },
  { id: 302, product_id: 3, sku: "ASUS-ROG-G14-16", price: 36000000, quantity: 1, image: "https://via.placeholder.com/300x200?text=ROG+G14+White" },
  { id: 401, product_id: 4, sku: "LENOVO-X1C-16", price: 45990000, quantity: 4, image: "https://via.placeholder.com/300x200?text=ThinkPad+X1+Carbon" },
  { id: 501, product_id: 5, sku: "HP-SPX360-8", price: 38990000, quantity: 7, image: "https://via.placeholder.com/300x200?text=HP+Spectre+Silver", discount: 8 },
  { id: 601, product_id: 6, sku: "ACER-P300-16", price: 29990000, quantity: 12, image: "https://via.placeholder.com/300x200?text=Acer+Predator+Black" },
  { id: 701, product_id: 7, sku: "DELL-INSP15-8", price: 15000000, quantity: 10, image: "https://via.placeholder.com/300x200?text=Dell+Inspiron+15" },
  { id: 801, product_id: 8, sku: "ASUS-VIVO15-8", price: 12000000, quantity: 15, image: "https://via.placeholder.com/300x200?text=ASUS+VivoBook+15" },
];

const mockProductVariantValues: { variant_id: number; attribute_value_id: number }[] = [
  { variant_id: 101, attribute_value_id: 102 },
  { variant_id: 101, attribute_value_id: 202 },
  { variant_id: 101, attribute_value_id: 301 },
  { variant_id: 101, attribute_value_id: 401 },
  { variant_id: 102, attribute_value_id: 102 },
  { variant_id: 102, attribute_value_id: 202 },
  { variant_id: 102, attribute_value_id: 302 },
  { variant_id: 102, attribute_value_id: 401 },
  { variant_id: 201, attribute_value_id: 102 },
  { variant_id: 201, attribute_value_id: 204 },
  { variant_id: 201, attribute_value_id: 302 },
  { variant_id: 201, attribute_value_id: 402 },
  { variant_id: 301, attribute_value_id: 103 },
  { variant_id: 301, attribute_value_id: 203 },
  { variant_id: 301, attribute_value_id: 303 },
  { variant_id: 301, attribute_value_id: 402 },
  { variant_id: 302, attribute_value_id: 102 },
  { variant_id: 302, attribute_value_id: 203 },
  { variant_id: 302, attribute_value_id: 303 },
  { variant_id: 302, attribute_value_id: 402 },
  { variant_id: 401, attribute_value_id: 102 },
  { variant_id: 401, attribute_value_id: 201 },
  { variant_id: 401, attribute_value_id: 303 },
  { variant_id: 401, attribute_value_id: 402 },
  { variant_id: 501, attribute_value_id: 101 },
  { variant_id: 501, attribute_value_id: 202 },
  { variant_id: 501, attribute_value_id: 301 },
  { variant_id: 501, attribute_value_id: 401 },
  { variant_id: 601, attribute_value_id: 102 },
  { variant_id: 601, attribute_value_id: 202 },
  { variant_id: 601, attribute_value_id: 303 },
  { variant_id: 601, attribute_value_id: 403 },
  { variant_id: 701, attribute_value_id: 101 },
  { variant_id: 701, attribute_value_id: 201 },
  { variant_id: 701, attribute_value_id: 303 },
  { variant_id: 701, attribute_value_id: 403 },
  { variant_id: 801, attribute_value_id: 101 },
  { variant_id: 801, attribute_value_id: 201 },
  { variant_id: 801, attribute_value_id: 301 },
  { variant_id: 801, attribute_value_id: 403 },
];

const compileDisplayProducts = (): DisplayProduct[] => {
  return mockProducts.map((product) => {
    const variants = mockProductVariants.filter(
      (v) => v.product_id === product.id
    );
    const primaryVariant =
      variants.reduce((minV, currentV) =>
        currentV.price < minV.price ? currentV : minV
      ) || variants[0]; 

    const originalPrice =
      primaryVariant.discount && primaryVariant.discount > 0
        ? primaryVariant.price / (1 - primaryVariant.discount / 100)
        : primaryVariant.price;

    const productSpecs: { attribute_name: string; value: string }[] = [];
    mockProductVariantValues
      .filter((pvv) => pvv.variant_id === primaryVariant.id)
      .forEach((pvv) => {
        const attrValue = mockAttributeValues.find(
          (av) => av.id === pvv.attribute_value_id
        );
        if (attrValue) {
          const attribute = mockAttributes.find(
            (a) => a.id === attrValue.attribute_id
          );
          if (attribute) {
            productSpecs.push({
              attribute_name: attribute.name,
              value: attrValue.value,
            });
          }
        }
      });

    const brandName =
      mockBrands.find((b) => b.id === product.brand_id)?.name || "N/A";

    return {
      ...product,
      variant_id: primaryVariant.id,
      sku: primaryVariant.sku,
      price: primaryVariant.price,
      originalPrice: originalPrice,
      discount: primaryVariant.discount,
      quantity: primaryVariant.quantity,
      variant_image: primaryVariant.image,
      rating: Math.floor(Math.random() * 2) + 4,
      specs: productSpecs,
      brand_name: brandName,
    };
  });
};

const CATEGORY_PAGE_SIZE = 8;

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

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 60000000]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getFiltersFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const minPrice = parseInt(params.get("minPrice") || "0");
    const maxPrice = parseInt(params.get("maxPrice") || "60000000");
    const brands = params.get("brands")?.split(",").map(Number).filter(Boolean) || [];
    const attributes = params.get("attributes")?.split(",").map(Number).filter(Boolean) || [];
    const sort = params.get("sort") || "default";
    const page = parseInt(params.get("page") || "1");

    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands(brands);
    setSelectedAttributes(attributes);
    setSortBy(sort);
    setCurrentPage(page);
  }, [location.search]);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (priceRange[0] !== 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 60000000) params.set("maxPrice", priceRange[1].toString());
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(","));
    if (selectedAttributes.length > 0) params.set("attributes", selectedAttributes.join(","));
    if (sortBy !== "default") params.set("sort", sortBy);
    if (currentPage !== 1) params.set("page", currentPage.toString());

    navigate({ search: params.toString() }, { replace: true });
  }, [priceRange, selectedBrands, selectedAttributes, sortBy, currentPage, navigate]);

  useEffect(() => {
    setLoading(true);
    getFiltersFromUrl();
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let fetchedProducts = compileDisplayProducts();
      if (categoryId) {
        const catIdNum = parseInt(categoryId);
        fetchedProducts = fetchedProducts.filter(
          (p) => p.category_id === catIdNum
        );
        setCurrentCategory(mockCategories.find(c => c.id === catIdNum) || null);
      } else {
        setCurrentCategory(null);
      }
      setProducts(fetchedProducts);
      setLoading(false);
    };
    fetchData();
  }, [categoryId, getFiltersFromUrl]);

  useEffect(() => {
    updateUrlParams();
  }, [priceRange, selectedBrands, selectedAttributes, sortBy, currentPage, updateUrlParams]);

  const applyFilters = (productsToFilter: DisplayProduct[]): DisplayProduct[] => {
    return productsToFilter.filter((product) => {
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const inBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand_id);
      const hasSelectedAttributes =
        selectedAttributes.length === 0 ||
        selectedAttributes.every((selectedAttrValueId) =>
          mockProductVariantValues.some(
            (pvv) =>
              pvv.variant_id === product.variant_id &&
              pvv.attribute_value_id === selectedAttrValueId
          )
        );
      return inPriceRange && inBrand && hasSelectedAttributes;
    });
  };

  const applySorting = (productsToSort: DisplayProduct[]): DisplayProduct[] => {
    return [...productsToSort].sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      } else if (sortBy === "price-desc") {
        return b.price - a.price;
      } else if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name) * -1;
      } else if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });
  };

  const filteredAndSortedProducts = applySorting(applyFilters(products));
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / CATEGORY_PAGE_SIZE
  );
  const startIndex = (currentPage - 1) * CATEGORY_PAGE_SIZE;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + CATEGORY_PAGE_SIZE
  );

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
    setCurrentPage(1);
  };

  const handleAttributeChange = (attributeValueId: number) => {
    setSelectedAttributes((prev) =>
      prev.includes(attributeValueId)
        ? prev.filter((id) => id !== attributeValueId)
        : [...prev, attributeValueId]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const uniqueBrands = mockBrands;
  const uniqueAttributes: {
    attribute: Attribute;
    values: AttributeValue[];
  }[] = mockAttributes.map((attr) => ({
    attribute: attr,
    values: mockAttributeValues.filter((av) => av.attribute_id === attr.id),
  }));

  return (
    <Container className="category-page py-8">
      {loading ? (
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
                  min={0}
                  max={60000000}
                  step={1000000}
                  marks={[
                    { value: 0, label: "0đ" },
                    { value: 20000000, label: "20tr" },
                    { value: 40000000, label: "40tr" },
                    { value: 60000000, label: "60tr+" },
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
            <Box className="w-3/4">
              <Box className="flex justify-between items-center mb-6">
                <Typography variant="h5" className="font-bold">
                  SẢN PHẨM ({filteredAndSortedProducts.length} SẢN PHẨM)
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
              {paginatedProducts.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-8">
                  Không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginatedProducts.map((product) => (
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