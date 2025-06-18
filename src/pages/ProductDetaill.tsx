import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Snackbar, Alert, Box, Divider, Grid, Rating, TextField, Chip } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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

interface Comment {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  created_at: string;
  username: string;
  rating: number;
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

interface ProductVariantValue {
  id: number;
  variant_id: number;
  attribute_value_id: number;
}

interface DisplayProduct {
  id: number;
  name: string;
  description: string;
  brand_id: number;
  category_id: number;
  thumbnail: string;
  created_at: string;
  selectedVariantId: number;
  sku: string;
  price: number;
  quantity: number;
  variantImage?: string;
  brand_name: string;
  category_name: string;
  displayPrice: number;
  originalPrice: number;
  discountPercentage?: number;
  attributes: { attribute_id: number; attribute_name: string; value_id: number; value: string }[];
  averageRating: number;
  totalReviews: number;
  cpu?: string;
  ram?: string;
  ssd?: string;
  vga?: string;
  display_size?: string;
  battery?: string;
  weight?: string;
}

const mockBrands: Brand[] = [
  { id: 1, name: "Gigabyte" },
  { id: 2, name: "Lenovo" },
  { id: 3, name: "Asus" },
  { id: 4, name: "Dell" },
  { id: 5, name: "HP" },
  { id: 6, name: "Acer" },
];

const mockCategories: Category[] = [
  { id: 1, name: "Laptop Gaming" },
  { id: 2, name: "Laptop Văn phòng" },
  { id: 3, name: "Laptop Đồ họa" },
  { id: 4, name: "Laptop Mỏng nhẹ" },
];

const mockAttributes: Attribute[] = [
  { id: 1, name: "Màu sắc" },
  { id: 2, name: "Kích thước" },
  { id: 3, name: "Bộ nhớ RAM" },
  { id: 4, name: "Ổ cứng SSD" },
];

const mockAttributeValues: AttributeValue[] = [
  { id: 101, attribute_id: 1, value: "Đen" },
  { id: 102, attribute_id: 1, value: "Trắng" },
  { id: 103, attribute_id: 1, value: "Bạc" },
  { id: 105, attribute_id: 1, value: "Xanh" },
  { id: 106, attribute_id: 1, value: "Xanh đậm" },
  { id: 201, attribute_id: 2, value: "13 inch" },
  { id: 202, attribute_id: 2, value: "14 inch" },
  { id: 203, attribute_id: 2, value: "15.6 inch" },
  { id: 301, attribute_id: 3, value: "8GB" },
  { id: 302, attribute_id: 3, value: "16GB" },
  { id: 303, attribute_id: 3, value: "32GB" },
  { id: 401, attribute_id: 4, value: "256GB" },
  { id: 402, attribute_id: 4, value: "512GB" },
  { id: 403, attribute_id: 4, value: "1TB" },
];

const mockProductsDB = [
  {
    id: 1,
    name: "Laptop Gigabyte G5 KF5-53VN383SH",
    description: "Laptop gaming hiệu năng cao với bộ vi xử lý Intel Core i5 thế hệ 13 và card đồ họa mạnh mẽ, mang lại trải nghiệm chơi game mượt mà và khả năng xử lý tác vụ nặng. Thiết kế tản nhiệt hiệu quả, màn hình tần số quét cao cho hình ảnh sắc nét, lý tưởng cho game thủ và những người làm đồ họa bán chuyên.",
    brand_id: 1,
    category_id: 1,
    thumbnail: "https://dl.chotot.com/thumb/images/v1_thumbnail/2024/04/15/v1_thumbnail_d56d812d1b0d466981604a1df58ff154.jpg",
    created_at: "2024-01-15T10:00:00Z",
    cpu: "Intel Core i5-13500H",
    ram: "8GB DDR4 3200MHz (nâng cấp tối đa 32GB)",
    ssd: "512GB NVMe PCIe Gen4 SSD",
    vga: "NVIDIA GeForce RTX 4060 8GB GDDR6",
    display_size: "15.6 inch FHD (1920x1080) IPS 144Hz",
    battery: "54Wh",
    weight: "2.1 kg",
  },
  {
    id: 2,
    name: "Laptop Lenovo IdeaPad Slim 3 14IRH10 83K00008VN",
    description: "Chiếc laptop mỏng nhẹ, sang trọng, phù hợp cho học tập và làm việc văn phòng. Với vi xử lý Intel Core i5 và thiết kế tối ưu, máy mang lại hiệu suất ổn định và thời lượng pin tốt, dễ dàng mang theo mọi lúc mọi nơi.",
    brand_id: 2,
    category_id: 2,
    thumbnail: "https://cdn.tgdd.vn/Products/Images/44/307446/lenovo-ideapad-slim-3-14irh8-i5-82xv000wvn-thumb-600x600.jpg",
    created_at: "2024-02-01T09:30:00Z",
    cpu: "Intel Core i5-1235U",
    ram: "8GB LPDDR5 4800MHz (Onboard)",
    ssd: "512GB NVMe PCIe Gen4 SSD",
    vga: "Intel Iris Xe Graphics",
    display_size: "14 inch FHD (1920x1080) IPS",
    battery: "47Wh",
    weight: "1.37 kg",
  },
  {
    id: 3,
    name: "Laptop Dell Inspiron 3525",
    description: "Laptop Dell Inspiron 3525 là sự lựa chọn đáng tin cậy cho công việc văn phòng và giải trí cơ bản, với bộ xử lý AMD Ryzen 5 và ổ cứng SSD nhanh chóng. Thiết kế bền bỉ, mang đến sự ổn định và hiệu quả.",
    brand_id: 4,
    category_id: 2,
    thumbnail: "https://phongvu.vn/cdn-cgi/image/fit=in,width=500,height=500,quality=95,f=auto/https://images.phongvu.vn/Images/v_03_2023/dell-inspiron-3525-o.jpg",
    created_at: "2024-04-05T11:45:00Z",
    cpu: "AMD Ryzen 5 5625U",
    ram: "8GB DDR4 3200MHz",
    ssd: "512GB NVMe PCIe Gen3 SSD",
    vga: "AMD Radeon Graphics",
    display_size: "15.6 inch FHD (1920x1080) Anti-glare",
    battery: "41Wh",
    weight: "1.9 kg",
  },
  {
    id: 4,
    name: "Laptop Asus Zenbook 14 OLED UX3402VA-KM203W",
    description: "Asus Zenbook 14 OLED UX3402VA-KM203W là chiếc laptop cao cấp với màn hình OLED tuyệt đẹp, hiệu năng mạnh mẽ từ chip Intel Core i7 thế hệ 13, và thiết kế mỏng nhẹ. Lý tưởng cho người dùng chuyên nghiệp cần sự di động và hiệu suất vượt trội.",
    brand_id: 3,
    category_id: 4,
    thumbnail: "https://file.hstatic.net/1000300977/file/laptop-asus-zenbook-14-oled-ux3402va-km203w_04040974e402432a939f50e8a7281313.jpg",
    created_at: "2024-05-25T10:00:00Z",
    cpu: "Intel Core i7-1360P",
    ram: "16GB LPDDR5 4800MHz",
    ssd: "512GB NVMe PCIe Gen4 SSD",
    vga: "Intel Iris Xe Graphics",
    display_size: "14 inch 2.8K (2880 x 1800) OLED 90Hz",
    battery: "75Wh",
    weight: "1.39 kg",
  },
];

const mockProductVariants: ProductVariant[] = [
  { id: 101, product_id: 1, sku: "G5KF5-BLACK-8G-512G", price: 22990000, quantity: 15, image: "https://dl.chotot.com/thumb/images/v1_thumbnail/2024/04/15/v1_thumbnail_d56d812d1b0d466981604a1df58ff154.jpg", discount: 12 },
  { id: 102, product_id: 1, sku: "G5KF5-BLACK-16G-512G", price: 23990000, quantity: 10, image: "https://dl.chotot.com/thumb/images/v1_thumbnail/2024/04/15/v1_thumbnail_d56d812d1b0d466981604a1df58ff154.jpg", discount: 10 },
  { id: 103, product_id: 1, sku: "G5KF5-BLACK-16G-1T", price: 25990000, quantity: 5, image: "https://dl.chotot.com/thumb/images/v1_thumbnail/2024/04/15/v1_thumbnail_d56d812d1b0d466981604a1df58ff154.jpg", discount: 8 },
  { id: 201, product_id: 2, sku: "LVSLIM3-SILVER-8G-512G", price: 14979000, quantity: 20, image: "https://cdn.tgdd.vn/Products/Images/44/307446/lenovo-ideapad-slim-3-14irh8-i5-82xv000wvn-thumb-600x600.jpg", discount: 13 },
  { id: 202, product_id: 2, sku: "LVSLIM3-BLUE-8G-512G", price: 15100000, quantity: 12, image: "https://cdn.tgdd.vn/Products/Images/44/307446/lenovo-ideapad-slim-3-14irh8-i5-82xv000wvn-thumb-600x600.jpg" },
  { id: 301, product_id: 3, sku: "DELL3525-BLACK-8G-512G", price: 13990000, quantity: 25, image: "https://phongvu.vn/cdn-cgi/image/fit=in,width=500,height=500,quality=95,f=auto/https://images.phongvu.vn/Images/v_03_2023/dell-inspiron-3525-o.jpg", discount: 10 },
  { id: 302, product_id: 3, sku: "DELL3525-BLACK-16G-512G", price: 15500000, quantity: 8, image: "https://phongvu.vn/cdn-cgi/image/fit=in,width=500,height=500,quality=95,f=auto/https://images.phongvu.vn/Images/v_03_2023/dell-inspiron-3525-o.jpg" },
  { id: 401, product_id: 4, sku: "ZENBOOK14-BLUE-16G-512G", price: 29990000, quantity: 18, image: "https://file.hstatic.net/1000300977/file/laptop-asus-zenbook-14-oled-ux3402va-km203w_04040974e402432a939f50e8a7281313.jpg", discount: 5 },
];

const mockProductVariantValues: ProductVariantValue[] = [
  { id: 1, variant_id: 101, attribute_value_id: 101 },
  { id: 2, variant_id: 101, attribute_value_id: 301 },
  { id: 3, variant_id: 101, attribute_value_id: 402 },
  { id: 4, variant_id: 101, attribute_value_id: 203 },
  { id: 5, variant_id: 102, attribute_value_id: 101 },
  { id: 6, variant_id: 102, attribute_value_id: 302 },
  { id: 7, variant_id: 102, attribute_value_id: 402 },
  { id: 8, variant_id: 102, attribute_value_id: 203 },
  { id: 9, variant_id: 103, attribute_value_id: 101 },
  { id: 10, variant_id: 103, attribute_value_id: 302 },
  { id: 11, variant_id: 103, attribute_value_id: 403 },
  { id: 12, variant_id: 103, attribute_value_id: 203 },
  { id: 13, variant_id: 201, attribute_value_id: 103 },
  { id: 14, variant_id: 201, attribute_value_id: 301 },
  { id: 15, variant_id: 201, attribute_value_id: 402 },
  { id: 16, variant_id: 201, attribute_value_id: 202 },
  { id: 17, variant_id: 202, attribute_value_id: 105 },
  { id: 18, variant_id: 202, attribute_value_id: 301 },
  { id: 19, variant_id: 202, attribute_value_id: 402 },
  { id: 20, variant_id: 202, attribute_value_id: 202 },
  { id: 21, variant_id: 301, attribute_value_id: 101 },
  { id: 22, variant_id: 301, attribute_value_id: 301 },
  { id: 23, variant_id: 301, attribute_value_id: 402 },
  { id: 24, variant_id: 301, attribute_value_id: 203 },
  { id: 25, variant_id: 302, attribute_value_id: 101 },
  { id: 26, variant_id: 302, attribute_value_id: 302 },
  { id: 27, variant_id: 302, attribute_value_id: 402 },
  { id: 28, variant_id: 302, attribute_value_id: 203 },
  { id: 29, variant_id: 401, attribute_value_id: 106 },
  { id: 30, variant_id: 401, attribute_value_id: 302 },
  { id: 31, variant_id: 401, attribute_value_id: 402 },
  { id: 32, variant_id: 401, attribute_value_id: 202 },
];

const mockComments: Comment[] = [
  { id: 1, user_id: 1, product_id: 1, content: "Sản phẩm tuyệt vời, hiệu năng chơi game đỉnh cao!", created_at: "2024-05-01T10:30:00Z", username: "Nguyễn Văn A", rating: 5 },
  { id: 2, user_id: 2, product_id: 1, content: "Máy hơi nóng khi chơi game nặng, nhưng nhìn chung rất tốt trong tầm giá.", created_at: "2024-05-02T11:00:00Z", username: "Trần Thị B", rating: 4 },
  { id: 3, user_id: 3, product_id: 2, content: "Laptop mỏng nhẹ, dùng văn phòng rất mượt.", created_at: "2024-04-10T09:00:00Z", username: "Lê Văn C", rating: 4 },
  { id: 4, user_id: 4, product_id: 2, content: "Pin dùng được cả ngày, rất tiện lợi.", created_at: "2024-04-12T15:00:00Z", username: "Phạm Thị D", rating: 5 },
  { id: 5, user_id: 5, product_id: 3, content: "Thiết kế đẹp, màn hình hiển thị tốt.", created_at: "2024-06-01T10:00:00Z", username: "Hoàng Văn E", rating: 4 },
  { id: 6, user_id: 1, product_id: 4, content: "Màn hình OLED quá đỉnh, màu sắc rực rỡ. Làm đồ họa mê ly!", created_at: "2024-06-05T14:20:00Z", username: "Nguyễn Văn A", rating: 5 },
  { id: 7, user_id: 2, product_id: 4, content: "Giá hơi cao nhưng xứng đáng. Hiệu năng ổn định.", created_at: "2024-06-07T16:00:00Z", username: "Trần Thị B", rating: 4 },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");
  const [availableVariants, setAvailableVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<DisplayProduct[]>([]);
  const [addToCartSuccess, setAddToCartSuccess] = useState<boolean>(false); // Thêm state mới để điều hướng

  const calculateDiscountedPrice = (originalPrice: number, discountPercentage?: number) => {
    return discountPercentage && discountPercentage > 0
      ? originalPrice * (1 - discountPercentage / 100)
      : originalPrice;
  };

  useEffect(() => {
    setLoading(true);
    const fetchProductData = () => {
      setTimeout(() => {
        const productId = Number(id);
        if (isNaN(productId)) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const foundProductDB = mockProductsDB.find((p) => p.id === productId);
        if (!foundProductDB) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const productVariants = mockProductVariants.filter((v) => v.product_id === foundProductDB.id);
        setAvailableVariants(productVariants);

        const defaultVariant = productVariants.length > 0 ? productVariants[0] : null;
        setSelectedVariant(defaultVariant);

        const brand = mockBrands.find((b) => b.id === foundProductDB.brand_id);
        const category = mockCategories.find((c) => c.id === foundProductDB.category_id);

        const productComments = mockComments.filter((c) => c.product_id === foundProductDB.id);
        const totalRating = productComments.reduce((sum, c) => sum + c.rating, 0);
        const averageRating = productComments.length > 0 ? totalRating / productComments.length : 0;
        setComments(productComments);

        let productAttributes: { attribute_id: number; attribute_name: string; value_id: number; value: string }[] = [];
        if (defaultVariant) {
          const variantValues = mockProductVariantValues.filter((pvv) => pvv.variant_id === defaultVariant.id);
          productAttributes = variantValues.map((pvv) => {
            const attrValue = mockAttributeValues.find((av) => av.id === pvv.attribute_value_id);
            const attribute = mockAttributes.find((a) => a.id === attrValue?.attribute_id);
            return {
              attribute_id: attribute?.id || 0,
              attribute_name: attribute?.name || "N/A",
              value_id: attrValue?.id || 0,
              value: attrValue?.value || "N/A",
            };
          });
        }

        const displayProduct: DisplayProduct = {
          id: foundProductDB.id,
          name: foundProductDB.name,
          description: foundProductDB.description,
          brand_id: foundProductDB.brand_id,
          category_id: foundProductDB.category_id,
          thumbnail: foundProductDB.thumbnail,
          created_at: foundProductDB.created_at,
          selectedVariantId: defaultVariant?.id || 0,
          sku: defaultVariant?.sku || "N/A",
          price: defaultVariant?.price || 0,
          quantity: defaultVariant?.quantity || 0,
          variantImage: defaultVariant?.image || foundProductDB.thumbnail,
          brand_name: brand?.name || "Không rõ",
          category_name: category?.name || "Không rõ",
          originalPrice: defaultVariant?.price || 0,
          discountPercentage: defaultVariant?.discount,
          displayPrice: calculateDiscountedPrice(defaultVariant?.price || 0, defaultVariant?.discount),
          attributes: productAttributes,
          averageRating,
          totalReviews: productComments.length,
          cpu: foundProductDB.cpu,
          ram: foundProductDB.ram,
          ssd: foundProductDB.ssd,
          vga: foundProductDB.vga,
          display_size: foundProductDB.display_size,
          battery: foundProductDB.battery,
          weight: foundProductDB.weight,
        };

        setProduct(displayProduct);

        const related = mockProductsDB
          .filter((p) => p.category_id === foundProductDB.category_id && p.id !== foundProductDB.id)
          .slice(0, 4)
          .map((p) => {
            const defaultRelatedVariant = mockProductVariants.find((v) => v.product_id === p.id);
            return {
              id: p.id,
              name: p.name,
              description: p.description,
              brand_id: p.brand_id,
              category_id: p.category_id,
              thumbnail: p.thumbnail,
              created_at: p.created_at,
              selectedVariantId: defaultRelatedVariant?.id || 0,
              sku: defaultRelatedVariant?.sku || "N/A",
              price: defaultRelatedVariant?.price || 0,
              quantity: defaultRelatedVariant?.quantity || 0,
              variantImage: defaultRelatedVariant?.image || p.thumbnail,
              brand_name: mockBrands.find((b) => b.id === p.brand_id)?.name || "N/A",
              category_name: mockCategories.find((c) => c.id === p.category_id)?.name || "N/A",
              originalPrice: defaultRelatedVariant?.price || 0,
              discountPercentage: defaultRelatedVariant?.discount,
              displayPrice: calculateDiscountedPrice(defaultRelatedVariant?.price || 0, defaultRelatedVariant?.discount),
              attributes: [],
              averageRating: 0,
              totalReviews: 0,
            } as DisplayProduct;
          });
        setRelatedProducts(related);

        setLoading(false);
      }, 500);
    };

    fetchProductData();
  }, [id]);

  const handleVariantSelect = useCallback(
    (variant: ProductVariant) => {
      if (!product) return;
      setSelectedVariant(variant);
      const updatedProduct: DisplayProduct = {
        ...product,
        selectedVariantId: variant.id,
        sku: variant.sku,
        price: variant.price,
        quantity: variant.quantity,
        variantImage: variant.image || product.thumbnail,
        originalPrice: variant.price,
        discountPercentage: variant.discount,
        displayPrice: calculateDiscountedPrice(variant.price, variant.discount),
        attributes: mockProductVariantValues
          .filter((pvv) => pvv.variant_id === variant.id)
          .map((pvv) => {
            const attrValue = mockAttributeValues.find((av) => av.id === pvv.attribute_value_id);
            const attribute = mockAttributes.find((a) => a.id === attrValue?.attribute_id);
            return {
              attribute_id: attribute?.id || 0,
              attribute_name: attribute?.name || "N/A",
              value_id: attrValue?.id || 0,
              value: attrValue?.value || "N/A",
            };
          }),
      };
      setProduct(updatedProduct);
    },
    [product]
  );

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      setSnackbarMessage("Vui lòng chọn biến thể sản phẩm trước khi thêm vào giỏ hàng.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (selectedVariant.quantity <= 0) {
      setSnackbarMessage("Sản phẩm này đã hết hàng!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = cartItems.findIndex((item: any) => item.variant_id === selectedVariant.id);

    if (existingItemIndex > -1) {
      const newQuantity = cartItems[existingItemIndex].quantity + 1;
      if (newQuantity > selectedVariant.quantity) {
        setSnackbarMessage(`Không thể thêm hơn số lượng tồn kho (${selectedVariant.quantity})!`);
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }
      cartItems[existingItemIndex].quantity = newQuantity;
      setSnackbarMessage("Đã cập nhật số lượng sản phẩm trong giỏ hàng!");
      setSnackbarSeverity("info");
    } else {
      cartItems.push({
        product_id: product.id,
        variant_id: selectedVariant.id,
        name: product.name,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        discount: selectedVariant.discount,
        thumbnail: product.thumbnail,
        variantImage: selectedVariant.image,
        quantity: 1,
        attributes: product.attributes, // Luôn đảm bảo thuộc tính được cập nhật theo biến thể đã chọn
      });
      setSnackbarMessage("Sản phẩm đã được thêm vào giỏ hàng!");
      setSnackbarSeverity("success");
      setAddToCartSuccess(true); // Đặt trạng thái thành công để kích hoạt điều hướng
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
    if (addToCartSuccess) {
      navigate("/cart"); // Điều hướng sau khi snackbar đóng nếu thêm thành công
      setAddToCartSuccess(false); // Reset trạng thái
    }
  };

  if (loading) {
    return (
      <Container className="flex justify-center items-center h-screen">
        <Typography variant="h5">Đang tải chi tiết sản phẩm...</Typography>
      </Container>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <Container className="flex flex-col justify-center items-center h-screen">
        <Typography variant="h5" color="error">
          Không tìm thấy sản phẩm hoặc biến thể!
        </Typography>
        <Link to="/" className="mt-4">
          <Button variant="contained" color="primary">
            Quay lại trang chủ
          </Button>
        </Link>
      </Container>
    );
  }

  const groupedAttributes = product.attributes.reduce((acc, attr) => {
    if (!acc[attr.attribute_name]) {
      acc[attr.attribute_name] = [];
    }
    acc[attr.attribute_name].push(attr);
    return acc;
  }, {} as { [key: string]: typeof product.attributes });

  return (
    <Container className="py-8 px-4 md:px-8 lg:px-16 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className="flex justify-center items-center h-full max-h-[500px] overflow-hidden rounded-lg shadow-md bg-gray-50">
              <img
                src={selectedVariant.image || product.thumbnail}
                alt={product.name}
                className="max-w-full h-auto object-contain"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
              {product.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600 text-sm mb-1">
              Mã SKU: <span className="font-medium">{selectedVariant.sku}</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 text-sm mb-1">
              Thương hiệu: <span className="font-medium">{product.brand_name}</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 text-sm mb-4">
              Danh mục: <span className="font-medium">{product.category_name}</span>
            </Typography>
            <Typography variant="body2" className="text-gray-600 text-sm mb-4">
              Ngày tạo: <span className="font-medium">{format(new Date(product.created_at), "dd/MM/yyyy", { locale: vi })}</span>
            </Typography>
            <div className="flex items-center mb-4">
              <Rating name="read-only" value={product.averageRating} precision={0.5} readOnly size="medium" />
              <Typography variant="body2" className="text-gray-600 ml-2">
                ({product.totalReviews} đánh giá)
              </Typography>
            </div>
            <Box className="mb-6">
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <>
                  <Typography variant="h5" className="text-red-600 font-bold">
                    {product.displayPrice.toLocaleString("vi-VN")} đ
                  </Typography>
                  <Typography variant="body1" className="text-gray-500 line-through mt-1">
                    {product.originalPrice.toLocaleString("vi-VN")} đ
                  </Typography>
                  <Typography variant="body2" className="text-green-600 font-semibold mt-1">
                    Tiết kiệm: {product.discountPercentage}% ({Math.abs(product.originalPrice - product.displayPrice).toLocaleString("vi-VN")} đ)
                  </Typography>
                </>
              ) : (
                <Typography variant="h5" className="text-gray-900 font-bold">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </Typography>
              )}
            </Box>
            <Box className="mb-6 p-4 border rounded-lg bg-gray-50">
              <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
                Lựa chọn cấu hình:
              </Typography>
              {Object.entries(groupedAttributes).map(([attrName, attrValues]) => (
                <Box key={attrName} className="mb-4">
                  <Typography variant="subtitle1" className="font-medium mb-2">
                    {attrName}:
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {mockAttributeValues
                      .filter((av) => attrValues.some((item) => item.attribute_id === av.attribute_id))
                      .map((av) => {
                        const isAvailable = availableVariants.some((variant) =>
                          mockProductVariantValues.some((pvv) => pvv.variant_id === variant.id && pvv.attribute_value_id === av.id)
                        );
                        const potentialVariant = availableVariants.find((variant) => {
                          const variantAttrValues = mockProductVariantValues
                            .filter((pvv) => pvv.variant_id === variant.id)
                            .map((pvv) => pvv.attribute_value_id);
                          const currentSelectedAttrValues = product.attributes.map((attr) => attr.value_id);
                          const filteredCurrentAttrs = currentSelectedAttrValues.filter((id) => {
                            const attrVal = mockAttributeValues.find((v) => v.id === id);
                            return attrVal?.attribute_id !== av.attribute_id;
                          });
                          const requiredAttrValues = [...filteredCurrentAttrs, av.id];
                          return requiredAttrValues.every((valId) => variantAttrValues.includes(valId));
                        });
                        const isSelected = product.attributes.some((item) => item.value_id === av.id);
                        const isDisabled = !isAvailable || !potentialVariant || potentialVariant.quantity <= 0;
                        return (
                          <Chip
                            key={av.id}
                            label={av.value}
                            clickable
                            color={isSelected ? "primary" : "default"}
                            variant={isSelected ? "filled" : "outlined"} // Sửa "contained" thành "filled"
                            onClick={() => {
                              if (!isDisabled && potentialVariant) {
                                handleVariantSelect(potentialVariant);
                              }
                            }}
                            disabled={isDisabled}
                            sx={{
                              borderColor: isSelected ? "primary.main" : "grey.400",
                              "&:hover": {
                                backgroundColor: isSelected ? "primary.dark" : "grey.200",
                                opacity: isDisabled ? 0.6 : 1,
                              },
                              opacity: isDisabled ? 0.5 : 1,
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease-in-out",
                            }}
                          />
                        );
                      })}
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="body1" className="mb-4 text-gray-700">
              Tồn kho: <span className={`font-semibold ${selectedVariant.quantity > 0 ? "text-green-600" : "text-red-600"}`}>{selectedVariant.quantity > 0 ? `${selectedVariant.quantity} sản phẩm` : "Hết hàng"}</span>
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
                onClick={handleAddToCart}
                startIcon={<AddShoppingCartIcon />}
                disabled={selectedVariant.quantity <= 0}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                className="flex-grow py-3 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold rounded-lg shadow-md transition duration-300"
                onClick={() => {
                  if (selectedVariant.quantity > 0) {
                    handleAddToCart();
                    // navigate("/cart"); // Điều hướng ngay lập tức (có thể bỏ qua snackbar)
                  } else {
                    setSnackbarMessage("Sản phẩm này đã hết hàng!");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                  }
                }}
                disabled={selectedVariant.quantity <= 0}
              >
                Mua ngay
              </Button>
            </div>
          </Grid>
        </Grid>
        <Divider className="my-8" />
        <Box className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 text-gray-700 rounded-lg shadow-sm">
          <Typography variant="h6" className="font-semibold mb-2 text-blue-800">
            Mô tả sản phẩm
          </Typography>
          <Typography variant="body1" component="div">
            {product.description.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </Typography>
        </Box>
        <Box className="mb-8 p-4 bg-gray-50 border rounded-lg shadow-sm">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-3 border-b pb-2">
            Thông số kỹ thuật chi tiết
          </Typography>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {product.cpu && (
              <li>
                <span className="font-medium">CPU:</span> {product.cpu}
              </li>
            )}
            {product.ram && (
              <li>
                <span className="font-medium">RAM:</span> {product.ram}
              </li>
            )}
            {product.ssd && (
              <li>
                <span className="font-medium">Ổ cứng:</span> {product.ssd}
              </li>
            )}
            {product.vga && (
              <li>
                <span className="font-medium">Card đồ họa:</span> {product.vga}
              </li>
            )}
            {product.display_size && (
              <li>
                <span className="font-medium">Màn hình:</span> {product.display_size}
              </li>
            )}
            {product.battery && (
              <li>
                <span className="font-medium">Pin:</span> {product.battery}
              </li>
            )}
            {product.weight && (
              <li>
                <span className="font-medium">Cân nặng:</span> {product.weight}
              </li>
            )}
            {product.attributes.length > 0 &&
              product.attributes.map((attr, index) => (
                <li key={index}>
                  <span className="font-medium">{attr.attribute_name}:</span> {attr.value} (Biến thể đã chọn)
                </li>
              ))}
          </ul>
        </Box>
        <Box className="mb-8 p-4 bg-white border rounded-lg shadow-sm">
          <Typography variant="h5" className="font-bold mb-4 text-gray-900 border-b pb-2">
            Bình luận và Đánh giá
          </Typography>
          {comments.length === 0 ? (
            <Typography variant="body1" className="text-gray-600 italic">
              Chưa có bình luận nào cho sản phẩm này.
            </Typography>
          ) : (
            <Box className="space-y-4">
              {comments.map((comment) => (
                <Box key={comment.id} className="border p-4 rounded-md bg-gray-50">
                  <Typography variant="subtitle1" className="font-semibold text-blue-700">
                    {comment.username}
                  </Typography>
                  <Rating name={`comment-rating-${comment.id}`} value={comment.rating} readOnly size="small" className="mb-1" /> {/* Đã thêm readOnly và size */}
                  <Typography variant="body2" className="text-gray-700">
                    {comment.content}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" className="mt-1 block">
                    {format(new Date(comment.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Phần sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <Box className="mt-12">
            <Typography variant="h5" className="font-bold mb-6 text-gray-900 border-b pb-2">
              Sản phẩm liên quan
            </Typography>
            <Grid container spacing={4}>
              {relatedProducts.map((p) => (
                <Grid item key={p.id} xs={12} sm={6} md={3}>
                  <Link to={`/products/${p.id}`} className="block h-full no-underline">
                    <Box className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                      <Box className="w-full h-48 flex justify-center items-center overflow-hidden bg-gray-50">
                        <img
                          src={p.thumbnail}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </Box>
                      <Box className="p-4 flex flex-col flex-grow">
                        <Typography variant="subtitle1" className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {p.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="mb-2">
                          {p.category_name}
                        </Typography>
                        <Box className="flex items-center mb-2">
                          <Rating name={`product-rating-${p.id}`} value={p.averageRating} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({p.totalReviews})
                          </Typography>
                        </Box>
                        {p.discountPercentage && p.discountPercentage > 0 ? (
                          <Box className="flex flex-col">
                            <Typography variant="body1" className="text-red-600 font-bold">
                              {p.displayPrice.toLocaleString("vi-VN")} đ
                            </Typography>
                            <Typography variant="body2" className="text-gray-500 line-through">
                              {p.originalPrice.toLocaleString("vi-VN")} đ
                            </Typography>
                            <Typography variant="caption" className="text-green-600 font-semibold mt-0.5">
                              -{p.discountPercentage}%
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body1" className="text-gray-900 font-bold">
                            {p.originalPrice.toLocaleString("vi-VN")} đ
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;