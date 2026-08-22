import React from 'react'
import { Outlet,Navigate } from 'react-router-dom';

const ADMIN_ROLES = ['super_admin', 'system_operator', 'system_admin', 'vendor'];

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = (user?.role || '').toLowerCase();

  if (user && (user.isAdmin || ADMIN_ROLES.includes(userRole))) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }

};

export default AdminRoutes