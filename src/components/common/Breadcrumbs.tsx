// src/common/Breadcrumbs.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material'; // Sử dụng Material-UI Breadcrumbs

const pathNameMap: { [key: string]: string } = {
  'product': 'Sản phẩm',
  'login': 'Đăng nhập',
  'register': 'Đăng ký',
  'forgot-password': 'Quên mật khẩu',
  'cart': 'Giỏ hàng',
  'news': 'Tin tức',
  
};

interface BreadcrumbItem {
  name: string;
  path: string;
  isLast: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x); // Tách đường dẫn và loại bỏ khoảng trắng

  const breadcrumbs: BreadcrumbItem[] = pathnames.map((value, index) => {
    const last = index === pathnames.length - 1;
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

    // Cố gắng lấy tên thân thiện từ map, nếu không có thì format lại (thay dấu gạch ngang bằng khoảng trắng, viết hoa chữ cái đầu)
    const displayName = pathNameMap[value] || value.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
      name: displayName,
      path: to,
      isLast: last,
    };
  });

  return (
    <div className="bg-gray-100 py-3 px-4 md:px-8 lg:px-16 text-sm text-gray-600">
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link to="/" className="hover:underline text-blue-600">
          Trang chủ
        </Link>
        {breadcrumbs.map((crumb) => (
          crumb.isLast ? (
            <Typography key={crumb.name} color="text.primary">
              {crumb.name}
            </Typography>
          ) : (
            <Link key={crumb.name} to={crumb.path} className="hover:underline text-blue-600">
              {crumb.name}
            </Link>
          )
        ))}
      </MuiBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;