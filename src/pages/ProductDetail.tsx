import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "../App.css";
import {
  Button,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import type { Product, ProductVariant } from "../types/product.type";
import instance from "../apis";

const ProductDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const getProduct = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await instance.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getProduct(id);
  }, [id]);

  const handleQuantityChange = (val: number) => {
    if (!selectedVariant) return;
    const limited = Math.max(1, Math.min(val, selectedVariant.stock));
    setQuantity(limited);
  };

  // 👇 Giá mặc định: nếu có biến thể thì lấy giá biến thể đầu tiên, không thì 0
  const defaultPrice =
    product?.variants && product.variants.length > 0
      ? product.variants[0].price
      : 0;

  return (
    <Container sx={{ mt: 4 }}>
      {product ? (
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          gap={4}
          p={4}
          boxShadow={3}
          borderRadius={2}
          bgcolor="white"
        >
          <CardMedia
            component="img"
            alt={product.name}
            height="300"
            image={product.thumbnail}
            sx={{ objectFit: "contain", maxWidth: 300 }}
          />

          <CardContent sx={{ maxWidth: 500, width: "100%" }}>
            <Typography gutterBottom variant="h5">
              {product.name}
            </Typography>

            <Typography variant="subtitle1" gutterBottom color="text.secondary">
              {product.description}
            </Typography>

            {/* ✅ Hiển thị giá (nếu chọn biến thể thì lấy giá biến thể, không thì giá mặc định) */}
            <Typography variant="h6" color="primary" mb={2}>
              Giá:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedVariant?.price ?? defaultPrice)}
            </Typography>

            {product.variants?.length > 0 ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Chọn dung lượng:
                </Typography>
                <Stack direction="row" gap={2} flexWrap="wrap" mb={2}>
                  {product.variants
                    .filter((variant) =>
                      variant.Name.toLowerCase().includes("gb")
                    )
                    .map((variant) => (
                      <Button
                        key={variant.id}
                        variant={
                          selectedVariant?.id === variant.id
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                      >
                        {variant.Name}
                      </Button>
                    ))}
                </Stack>
              </>
            ) : (
              <Typography color="gray">
                Không có biến thể sản phẩm nào.
              </Typography>
            )}

            {selectedVariant && (
              <Stack direction="row" gap={2} alignItems="center" mb={2}>
                <Typography>Số lượng:</Typography>
                <IconButton onClick={() => handleQuantityChange(quantity - 1)}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  size="small"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  inputProps={{ min: 1, max: selectedVariant.stock }}
                  sx={{ width: 80 }}
                />
                <IconButton onClick={() => handleQuantityChange(quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={!selectedVariant}
              onClick={async () => {
                if (!selectedVariant) {
                  alert("Vui lòng chọn một biến thể.");
                  return;
                }

                try {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng.");
                    return;
                  }

                  const response = await fetch(
                    "http://localhost:8000/api/cart",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        product_id: product?.id,
                        product_variant_id: selectedVariant.id,
                        quantity,
                      }),
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    alert(data.message || "Thêm vào giỏ hàng thất bại.");
                    return;
                  }

                  alert(data.message);
                } catch (error) {
                  console.error("Lỗi khi thêm vào giỏ hàng:", error);
                  alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
                }
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </CardContent>
        </Box>
      ) : (
        !loading && (
          <Typography variant="h6" textAlign="center" mt={4}>
            Không tìm thấy sản phẩm.
          </Typography>
        )
      )}
    </Container>
  );
};

export default ProductDetail;
