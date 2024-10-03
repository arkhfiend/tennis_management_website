import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from '../components/userNavbar';
import AdminSidebar from './adminSidebar';
function BaseHOD() {
  return (
    <div className="wrapper">
      <UserNavbar />
      <AdminSidebar />
      <div className="content-wrapper">
      <Outlet />
      </div>
    </div>
  );
}

export default BaseHOD;