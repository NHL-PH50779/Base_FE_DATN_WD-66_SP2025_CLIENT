import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Stack,
  Typography,
  styled,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { categoryService } from "../../services/category.service";
import { productService } from "../../services/product.service";
import { authService } from "../../services/auth/auth.service";
import { cartService } from "../../services/cart.service";
import { wishlistService } from "../../services/wishlist.service";
import { useCartStore } from "../../stores/cart.store";
import type { Product } from "../../types/product.type";

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { cartCount, wishlistCount, setCartCount, setWishlistCount } = useCartStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchProducts();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchProducts = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const response = await productService.searchProducts(searchTerm);
      setSearchResults(response.data?.slice(0, 5) || []); // Chỉ hiện 5 kết quả
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryAnchor(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchor(null);
  };

  const handleCategorySelect = (categoryId: number) => {
    navigate(`/shop?category=${categoryId}`);
    handleCategoryClose();
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleAdminLogin = () => {
    window.location.href = 'http://localhost:5173/admin/login';
    handleUserClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleUserClose();
  };

  const handleWallet = () => {
    navigate('/wallet');
    handleUserClose();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    handleUserClose();
  };

  const handleSearchIconClick = () => {
    console.log('Search icon clicked'); // Debug
    setShowSearchBar(!showSearchBar);
  };

  const handleSearchClose = () => {
    setShowSearchBar(false);
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    handleSearchClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      handleSearchClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const menus = [
    { label: "Trang chủ", link: "/home" },
    { 
      label: "Danh mục", 
      link: "/shop",
      hasDropdown: true,
      onClick: handleCategoryClick
    },
    { label: "Đơn hàng", link: "/orders" },
    { label: "Về chúng tôi", link: "/about" },
    { label: "Liên hệ", link: "/contact" },
  ];

  return (
    <>
      <Wrapper direction="row" justifyContent="space-between" alignItems="center">
        {/* Logo */}
        <Box>
          <Link to="/home">
            <img width={100} height={100} src="/logo.png" alt="logo" />
          </Link>
        </Box>

        {/* Menu - Ẩn khi search bar hiện */}
        <Stack
          direction="row"
          spacing={6}
          sx={{
            display: { xs: "none", md: showSearchBar ? "none" : "flex" }
          }}
        >
          {menus.map((menu, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              {menu.hasDropdown ? (
                <MenuButton
                  onClick={menu.onClick}
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <MenuLink>{menu.label}</MenuLink>
                  <ExpandMoreIcon sx={{ ml: 0.5, fontSize: '1.2rem' }} />
                </MenuButton>
              ) : (
                <NavLink
                  to={menu.link}
                  style={{ textDecoration: "none" }}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <MenuLink>{menu.label}</MenuLink>
                </NavLink>
              )}
            </Box>
          ))}
        </Stack>

        {/* Search Bar - Hiện khi click search icon */}
        {/* Debug: showSearchBar = {showSearchBar.toString()} */}
        {showSearchBar && (
          <Box sx={{ 
            flex: 1, 
            mx: 3,
            position: 'relative'
          }}>
            <ClickAwayListener onClickAway={handleSearchClose}>
              <Box>
                <form onSubmit={handleSearchSubmit}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearchClose} size="small">
                            <CloseIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#bdbdbd',
                          },
                        }
                      }
                    }}
                  />
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1,
                      maxHeight: 300,
                      overflow: 'auto',
                      zIndex: 1000,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    <List sx={{ p: 0 }}>
                      {searchResults.map((product) => (
                        <ListItem
                          key={product.id}
                          component="div"
                          onClick={() => handleProductClick(product.id)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <img
                              src={product.thumbnail?.startsWith('http') 
                                ? product.thumbnail 
                                : `http://localhost/storage/products/${product.thumbnail}`
                              }
                              alt={product.name}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 4,
                                marginRight: 12
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="error">
                                {formatPrice(product.variants?.[0]?.price || 0)}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
        )}

        {/* Icons */}
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton onClick={handleUserClick}>
            <img src="/user.svg" alt="user" width={20} />
          </IconButton>
          
          <IconButton onClick={handleSearchIconClick}>
            <SearchIcon />
          </IconButton>
          
          <Badge color="error" badgeContent={wishlistCount > 0 ? wishlistCount : null}>
            <IconButton component={Link} to="/wishlist">
              <FavoriteBorderIcon />
            </IconButton>
          </Badge>
          
          <Badge color="error" badgeContent={cartCount > 0 ? cartCount : null}>
            <Link to="/cart">
              <IconButton>
                <img src="/cart.svg" alt="cart" width={20} />
              </IconButton>
            </Link>
          </Badge>
        </Stack>
      </Wrapper>

      {/* Category Dropdown Menu */}
      <Menu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={handleCategoryClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/shop'); handleCategoryClose(); }}>
          <Typography fontWeight={600}>Tất cả sản phẩm</Typography>
        </MenuItem>
        <Divider />
        {categories.map((category) => (
          <MenuItem 
            key={category.id} 
            onClick={() => handleCategorySelect(category.id)}
          >
            <Typography>{category.name}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={handleUserClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon sx={{ mr: 1, color: '#2196f3' }} />
          <Typography>Thông tin cá nhân</Typography>
        </MenuItem>
        <MenuItem onClick={handleWallet}>
          <AccountBalanceWalletIcon sx={{ mr: 1, color: '#4CAF50' }} />
          <Typography>Ví của tôi</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleAdminLogin}>
          <AdminPanelSettingsIcon sx={{ mr: 1, color: '#ff9800' }} />
          <Typography>Trang quản trị</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1, color: '#f44336' }} />
          <Typography>Đăng xuất</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;

// ===== Styled components =====
const Wrapper = styled(Stack)(({ theme }) => ({
  height: 100,
  padding: "0 20px",
  [theme.breakpoints.up("md")]: {
    padding: "0 50px",
  },
}));

const MenuLink = styled(Typography)(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s ease",
  paddingBottom: 4,
  fontWeight: 500,
  color: "#000",
  "&:hover": {
    transform: "translateY(-2px)",
    fontWeight: 600,
  },
  "&.active": {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  },
}));

const MenuButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    '& .MuiTypography-root': {
      transform: 'translateY(-2px)',
      fontWeight: 600,
    }
  }
});