import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
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
      console.log("Product detail API response:", data);
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

  return (
    <Container className="pr-detail" sx={{ mt: 4 }}>
      {product ? (
        <div className="ctsp">
          <CardMedia
            component="img"
            alt={product.name}
            height="400"
            image={product.thumbnail}
            sx={{ objectFit: "contain" }}
          />

          <CardContent>
            <Typography gutterBottom variant="h5">
              {product.name}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              {product.description}
            </Typography>

            {product.variants && product.variants.length > 0 ? (
              <div>
                <Typography variant="h6" gutterBottom>
                  Chọn biến thể:
                </Typography>
                <Stack direction="row" gap={2} flexWrap="wrap" mb={2}>
                  {product.variants.map((variant) => (
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
                      {variant.name} - {variant.price.toLocaleString("vi-VN")}₫
                    </Button>
                  ))}
                </Stack>
              </div>
            ) : (
              <Typography color="gray">
Không có biến thể sản phẩm nào.
              </Typography>
            )}

            {selectedVariant && (
              <>
                <Typography variant="body1" gutterBottom>
                  Giá: {selectedVariant.price.toLocaleString("vi-VN")}₫ — Kho:{" "}
                  {selectedVariant.stock}
                </Typography>

                <Stack direction="row" gap={2} alignItems="center" mb={2}>
                  <Typography>Số lượng:</Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number(e.target.value))
                    }
                    inputProps={{ min: 1, max: selectedVariant.stock }}
                    sx={{ width: 80 }}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </>
            )}

            <Button
              variant="outlined"
              disabled={!selectedVariant}
              onClick={() => {
                if (!selectedVariant) {
                  alert("Vui lòng chọn một biến thể.");
                  return;
                }
                alert(
                  `Đã thêm ${quantity} sản phẩm "${selectedVariant.name}" vào giỏ hàng`
                );
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </CardContent>
        </div>
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