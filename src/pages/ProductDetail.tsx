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
import type { Product } from "../types/product.type";
import instance from "../apis";
// import { useCart } from "src/contexts/ShoppingContext";

const ProductDetail = () => {
  // const { setCart } = useCart();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState<number>(0);

  const getProduct = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await instance.get(`/products/${id}`);
      console.log("Product detail API response:", data);

      // ✅ Giả sử API trả về { data: { id, title, price, ... } }
      setProduct(data.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getProduct(id);
  }, [id]);

  return (
    <div>
      {/* <Loading isShow={loading} /> */}
      <Container className="pr-detail">
        {product && (
          <div className="ctsp">
            <CardMedia
              component="img"
              alt={product.name}
              height="400"
              image={product.thumbnail}
              sx={{ objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>

              {product.variants && product.variants.length > 0 ? (
                <div>
                  <Typography variant="h6" gutterBottom>
                    Các biến thể và giá:
                  </Typography>
                  {product.variants.map((variant, index) => (
                    <Typography key={index}>
                      - Tên: {variant.name}- Giá:{" "}
                      {parseInt(variant.price).toLocaleString("vi-VN")} VND,
                      Kho: {variant.stock}
                    </Typography>
                  ))}
                </div>
              ) : (
                <Typography variant="h6" gutterBottom>
                  Không có biến thể sản phẩm nào.
                </Typography>
              )}

              <Typography variant="subtitle1" gutterBottom>
                {product.description}
              </Typography>

              <Stack direction="row" gap={2} alignItems="center">
                <Typography>Quantity: </Typography>
                <IconButton
                  onClick={() => setQuantity(quantity === 0 ? 0 : quantity - 1)}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  id="outlined-basic"
                  label="quantity"
                  variant="outlined"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  inputProps={{ min: 0 }}
                />
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <AddIcon />
                </IconButton>

                <Button
                  variant="outlined"
                  // onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </Button>
              </Stack>
            </CardContent>
          </div>
        )}

        {!product && !loading && (
          <Typography variant="h6" mt={4} textAlign="center">
            Không tìm thấy sản phẩm.
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;
