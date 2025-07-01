import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import { Person, Lock, LocationOn } from '@mui/icons-material';
import { authService } from '../services/auth/auth.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    birth_date: '',
    gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // Style đồng bộ cho tất cả input
  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      height: '56px',
      borderRadius: '8px',
      fontSize: '16px',
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#bdbdbd',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 14px',
      fontSize: '16px',
    }
  };

  // Style cho textarea (địa chỉ)
  const textareaStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontSize: '16px',
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#bdbdbd',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '16px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 14px',
      fontSize: '16px',
    }
  };

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      console.log('Loading user data in profile:', user);
      console.log('User address fields:', {
        province: user.province,
        district: user.district, 
        ward: user.ward,
        address: user.address
      });
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        province: user.province || '',
        district: user.district || '',
        ward: user.ward || '',
        address: user.address || '',
        birth_date: user.birth_date || '',
        gender: user.gender || ''
      });
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      setError('Họ tên không được để trống');
      return;
    }
    if (!profileData.province.trim() || !profileData.district.trim() || !profileData.ward.trim() || !profileData.address.trim()) {
      setError('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating profile with data:', profileData);
      const response = await authService.updateProfile(profileData);
      console.log('Profile update response:', response);
      
      // Refresh user data in localStorage
      if (response.user) {
        console.log('New user data from server:', response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log('Updated localStorage user data');
      } else {
        console.log('No user data in response, updating manually');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Manually updated user data:', updatedUser);
      }
      
      setSuccess('Cập nhật thông tin thành công!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    if (passwordData.new_password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.changePassword(passwordData);
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
            Quản lý thông tin cá nhân
          </Typography>

          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab icon={<Person />} label="Thông tin cá nhân" />
            <Tab icon={<Lock />} label="Đổi mật khẩu" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleProfileSubmit}>
              <Stack spacing={3}>
                {/* Thông tin cá nhân */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#2196F3' }} />
                  Thông tin cá nhân
                </Typography>
                
                <TextField
                  fullWidth
                  label="Họ tên đầy đủ *"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  required
                  sx={inputStyle}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại *"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    required
                    helperText="Để liên hệ giao hàng"
                    sx={inputStyle}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profileData.email}
                    disabled
                    helperText="Email không thể thay đổi"
                    sx={inputStyle}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={profileData.birth_date}
                    onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    sx={inputStyle}
                  />
                  <FormControl fullWidth sx={inputStyle}>
                    <InputLabel sx={{ fontSize: '16px' }}>Giới tính</InputLabel>
                    <Select
                      value={profileData.gender || ''}
                      onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                      sx={{ height: '56px', fontSize: '16px' }}
                      label="Giới tính"
                    >
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Địa chỉ giao hàng */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <LocationOn sx={{ color: '#4CAF50' }} />
                  Địa chỉ giao hàng
                </Typography>
                
                <TextField
                  fullWidth
                  label="Tỉnh/Thành phố *"
                  value={profileData.province}
                  onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                  placeholder="Nhập tỉnh/thành phố"
                  required
                  sx={inputStyle}
                />
                
                <TextField
                  fullWidth
                  label="Quận/Huyện *"
                  value={profileData.district}
                  onChange={(e) => setProfileData({...profileData, district: e.target.value})}
                  placeholder="Nhập quận/huyện"
                  required
                  sx={inputStyle}
                />
                
                <TextField
                  fullWidth
                  label="Phường/Xã *"
                  value={profileData.ward}
                  onChange={(e) => setProfileData({...profileData, ward: e.target.value})}
                  placeholder="Nhập phường/xã"
                  required
                  sx={inputStyle}
                />
                
                <TextField
                  fullWidth
                  label="Địa chỉ chi tiết *"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Số nhà, tên đường, tòa nhà..."
                  required
                  sx={inputStyle}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </Stack>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handlePasswordSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  required
                  sx={inputStyle}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    required
                    sx={inputStyle}
                  />
                  <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                    required
                    sx={inputStyle}
                  />
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                </Button>
              </Stack>
            </form>
          </TabPanel>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;