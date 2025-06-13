import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface DisplayProduct {
  id: number; // product_id
  name: string; // product name
  thumbnail: string; 
  description: string;
  brand_id: number;
  category_id: number;
  created_at: string;

  
  variant_id: number;
  sku: string; 
  price: number; 
  quantity: number; 
  variant_image?: string; 

  discount?: number; 
  rating?: number; // Ví dụ: tổng hợp từ bảng comments
  specs?: string; // Ví dụ: tổng hợp từ attribute_values
  code?: string; // Có thể là SKU hoặc một mã sản phẩm khác
}

// Interface cho Categories
interface Category {
  id: number;
  name: string;
  // Có thể thêm icon hoặc image cho category nếu cần
  image?: string;
}

// Interface cho Brands
interface Brand {
  id: number;
  name: string;
  // Có thể thêm logo cho brand nếu cần
  logo?: string;
}

// Interface cho News
interface NewsItem {
  id: number;
  title: string;
  content: string; // Chỉ lấy một phần hoặc đoạn tóm tắt
  thumbnail?: string;
  created_at: string;
}
const mockDisplayProducts: DisplayProduct[] = [
  {
    id: 1,
    name: "Laptop Gigabyte G5 KF5-53VN383SH",
    description: "Laptop gaming hiệu năng cao với bộ vi xử lý Intel Core i5 thế hệ 13 và card đồ họa mạnh mẽ, mang lại trải nghiệm chơi game mượt mà và khả năng xử lý tác vụ nặng. Thiết kế tản nhiệt hiệu quả, màn hình tần số quét cao cho hình ảnh sắc nét, lý tưởng cho game thủ và những người làm đồ họa bán chuyên.",
    brand_id: 1,
    category_id: 1,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-01-15T10:00:00Z",
    variant_id: 101,
    sku: "SKU-GIGA-G5-001",
    price: 22990000,
    quantity: 50,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 12,
    rating: 4.5,
    specs: "Intel Core i5-13500H / 8GB / 512GB",
    code: "M5 SP-NBGI0046",
  },
  {
    id: 2,
    name: "Laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN",
    description: "Chiếc laptop mỏng nhẹ, sang trọng, phù hợp cho học tập và làm việc văn phòng. Với vi xử lý Intel Core i5 và thiết kế tối ưu, máy mang lại hiệu suất ổn định và thời lượng pin tốt, dễ dàng mang theo mọi lúc mọi nơi.",
    brand_id: 2,
    category_id: 2,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-06-05T09:30:00Z",
    variant_id: 102,
    sku: "SKU-LENOVO-S3-001",
    price: 14979000,
    quantity: 120,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 13,
    rating: 4.0,
    specs: "Intel Core i5-1235U",
    code: "M6 SP-NBLN0948",
  },
  {
    id: 3,
    name: "Laptop Asus VivoBook 14 X1405VA-LY623W",
    description: "Laptop đa năng với hiệu năng mạnh mẽ nhờ chip Intel Core i5 thế hệ 13 và 16GB RAM, lý tưởng cho công việc đồ họa nhẹ và giải trí hàng ngày. Màn hình sắc nét và thiết kế thời trang, phù hợp cho sinh viên và nhân viên văn phòng.",
    brand_id: 3,
    category_id: 2,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-06-08T14:15:00Z",
    variant_id: 103,
    sku: "SKU-ASUS-V14-001",
    price: 14490000,
    quantity: 80,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 0,
    rating: 4.0,
    specs: "Intel Core i5-13420H / 16GB",
    code: "M8 SP-NBA51443",
  },
  {
    id: 4,
    name: "Laptop Dell Inspiron 3525",
    description: "Laptop Dell Inspiron 3525 là sự lựa chọn đáng tin cậy cho công việc văn phòng và giải trí cơ bản, với bộ xử lý AMD Ryzen 5 và ổ cứng SSD nhanh chóng. Thiết kế bền bỉ, mang đến sự ổn định và hiệu quả.",
    brand_id: 4,
    category_id: 2,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-04-05T11:45:00Z",
    variant_id: 104,
    sku: "SKU-DELL-I3525-001",
    price: 13990000,
    quantity: 60,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 10,
    rating: 4.2,
    specs: "AMD Ryzen 5 5625U / 8GB / 512GB",
    code: "M7 SP-NBDI0042",
  },
  {
    id: 5,
    name: "Laptop HP Pavilion 15-eh2024AU",
    description: "HP Pavilion 15-eh2024AU nổi bật với hiệu năng mạnh mẽ từ chip AMD Ryzen 7 và dung lượng lưu trữ lớn, thích hợp cho đa nhiệm và các ứng dụng đòi hỏi cao. Thiết kế thanh lịch, phù hợp với mọi môi trường làm việc.",
    brand_id: 5,
    category_id: 3,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-05-20T16:00:00Z",
    variant_id: 105,
    sku: "SKU-HP-P15-001",
    price: 17990000,
    quantity: 45,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 15,
    rating: 4.3,
    specs: "AMD Ryzen 7 5825U / 16GB / 1TB",
    code: "M9 SP-NBHP0045",
  },
  {
    id: 6,
    name: "Laptop Acer Aspire 5 A515-58-56ZK",
    description: "Acer Aspire 5 A515-58-56ZK là chiếc laptop cân bằng giữa hiệu năng và giá cả, phù hợp cho sinh viên và nhân viên văn phòng. Máy có thiết kế hiện đại và đủ mạnh mẽ để xử lý các tác vụ hàng ngày.",
    brand_id: 6,
    category_id: 2,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-06-01T08:00:00Z",
    variant_id: 106,
    sku: "SKU-ACER-A5-001",
    price: 15990000,
    quantity: 90,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 8,
    rating: 4.1,
    specs: "Intel Core i5-1235U / 8GB / 512GB",
    code: "M10 SP-NBAC0047",
  },
  {
    id: 7,
    name: "Laptop Dell XPS 13 9320",
    description: "Dell XPS 13 9320 là một trong những laptop ultrabook cao cấp nhất, với thiết kế mỏng nhẹ, màn hình đẹp và hiệu năng mạnh mẽ, phù hợp cho những người dùng đòi hỏi cao về cả thẩm mỹ lẫn hiệu suất.",
    brand_id: 4,
    category_id: 3,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-03-01T10:00:00Z",
    variant_id: 107,
    sku: "SKU-DELL-XPS13-001",
    price: 35000000,
    quantity: 30,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 20,
    rating: 4.8,
    specs: "Intel Core i7-1260P / 16GB / 512GB",
    code: "M11 SP-NBDE0050",
  },
  {
    id: 8,
    name: "MacBook Air M2 2024",
    description: "MacBook Air M2 2024 mang đến hiệu suất vượt trội và thời lượng pin cả ngày, với thiết kế mỏng nhẹ và màn hình Liquid Retina tuyệt đẹp, hoàn hảo cho công việc sáng tạo và giải trí.",
    brand_id: 7,
    category_id: 3,
    thumbnail: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    created_at: "2024-06-09T18:00:00Z",
    variant_id: 108,
    sku: "SKU-APPLE-MBA2-001",
    price: 28000000,
    quantity: 70,
    variant_image: "https://tse2.mm.bing.net/th?id=OIP.4zRcV3UHKCWNZqwKCgCJ3wHaGE&pid=Api&P=0&h=220",
    discount: 5,
    rating: 4.9,
    specs: "Apple M2 chip / 8GB / 256GB",
    code: "M12 SP-NBAP0001",
  },
];

const mockCategories: Category[] = [
  { id: 1, name: "Laptop Văn phòng", image: "https://up.yimg.com/ib/th?id=OIP.AgG7Ho8-kmSSvCiRzv-TbQHaHa&pid=Api&rs=1&c=1&qlt=95&w=110&h=110" },
  { id: 2, name: "Laptop Gaming", image: "https://s.yimg.com/lo/api/res/1.2/LQk4ejLxPmHL7YRIUW3PYQ--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtoPTMwMDtzcz0xO3c9MzAw/https://i5.walmartimages.com/seo/XPG-Xenia-15G-15-6-Gaming-Laptop-Intel-Core-i7-13700H-NVIDIA-GeForce-RTX-4060-1-TB-SSD-Windows-11-Home_16c55d95-6f18-4d0b-9918-ca25df5702b9.3d1f9c8c62136644367886964d3efd12.jpeg" },
  { id: 3, name: "Laptop Cao Cấp", image: "https://tse1.mm.bing.net/th?id=OIP.kJzmgtmJd7jdI6mJeK2fywHaD8&pid=Api&P=0&h=220" },
 
];

const mockBrands: Brand[] = [
  { id: 1, name: "Gigabyte", logo: "https://up.yimg.com/ib/th?id=OIP.6c34iIbfNmaqM3ShNkicBQHaEK&pid=Api&rs=1&c=1&qlt=95&w=191&h=107" },
  { id: 2, name: "Lenovo", logo: "https://up.yimg.com/ib/th?id=OIP.DdH9aAX5h4lmaG0fTmWjngHaCe&pid=Api&rs=1&c=1&qlt=95&w=263&h=87" },
  { id: 3, name: "Asus", logo: "https://up.yimg.com/ib/th?id=OIP.jo5IbrDN_V02hDGLLRyjygHaEK&pid=Api&rs=1&c=1&qlt=95&w=195&h=109" },
  { id: 4, name: "Dell", logo: "https://up.yimg.com/ib/th?id=OIP.SQo91Sr6F5BL3emlJszSTwHaHa&pid=Api&rs=1&c=1&qlt=95&w=109&h=109" },
  { id: 5, name: "HP", logo: "https://up.yimg.com/ib/th?id=OIP.7IEX1sqp0oZ7C8Y9wByESgHaEK&pid=Api&rs=1&c=1&qlt=95&w=187&h=105" },
  { id: 6, name: "Acer", logo: "https://up.yimg.com/ib/th?id=OIP.j4Dxo6zkzlPx1j2oEK_HbwHaEo&pid=Api&rs=1&c=1&qlt=95&w=114&h=71" },
  { id: 7, name: "Apple", logo: "https://tse2.mm.bing.net/th?id=OIP.-YzNxFgXai7xpeemFi5vvgHaEK&pid=Api&P=0&h=220" },
];

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Top 5 Laptop Gaming đáng mua nhất năm 2025",
    content: "Khám phá những chiếc laptop gaming mạnh mẽ và đáng giá nhất hiện nay, từ hiệu năng, thiết kế đến giá thành...",
    thumbnail: "https://sp.yimg.com/ib/th?id=OIP.ixSL_FnEe26QM8Bt-D5E5QHaEj&pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
    created_at: "2025-06-10T10:00:00Z",
  },
  {
    id: 2,
    title: "Hướng dẫn chọn Laptop văn phòng phù hợp với ngân sách",
    content: "Bạn đang tìm kiếm một chiếc laptop cho công việc? Bài viết này sẽ giúp bạn đưa ra lựa chọn tốt nhất...",
    thumbnail: "https://sp.yimg.com/ib/th?id=OIP.ixSL_FnEe26QM8Bt-D5E5QHaEj&pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
    created_at: "2025-06-08T14:30:00Z",
  },
  {
    id: 3,
    title: "Công nghệ tản nhiệt mới trên Laptop cao cấp",
    content: "Các nhà sản xuất đang ngày càng đầu tư vào công nghệ tản nhiệt để tối ưu hiệu suất của laptop...",
    thumbnail: "https://sp.yimg.com/ib/th?id=OIP.ixSL_FnEe26QM8Bt-D5E5QHaEj&pid=Api&w=148&h=148&c=7&dpr=2&rs=1",
    created_at: "2025-06-05T09:00:00Z",
  },
];

// Component hiển thị từng sản phẩm
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
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setProducts(mockDisplayProducts);
        setCategories(mockCategories);
        setBrands(mockBrands);
        setNews(mockNews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)); // Lấy 3 bài tin tức mới nhất
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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