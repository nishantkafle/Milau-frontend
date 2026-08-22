import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const SALES_ROLES = ['staff'];

const SalesRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = (user?.role || '').toLowerCase();

  if (user && (user.isSale || SALES_ROLES.includes(userRole))) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default SalesRoutes;
