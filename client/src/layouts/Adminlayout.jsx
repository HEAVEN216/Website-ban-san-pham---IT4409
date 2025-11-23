import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import DashboardPage from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Users from '../pages/Users';
import Admins from '../pages/Admins';
import Carts from '../pages/Carts';
import Reviews from '../pages/Reviews';
import Income from '../pages/Income';
import CartDetail from '../components/CartDetail';


// Layout Wrapper
const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
            <Route path="admins" element={<Admins />} />
            <Route path="carts" element={<Carts />} />
            <Route path="carts/:id" element={<CartDetail />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="income" element={<Income />} />
            <Route path="*" element={<div className="p-8"> <h2 className="text-2xl font-semibold mb-4 text-gray-700">404 - Trang không tìm thấy</h2> <p className="text-gray-600 text-base leading-relaxed">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p> </div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;