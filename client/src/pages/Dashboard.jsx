import React from "react";
import { Home, Package, Users, Shield, Settings, LogOut, Menu } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { motion } from "framer-motion";

// Dashboard Page Component
const DashboardPage = () => {
  const stats = [
    { title: "Tổng sản phẩm", value: 124, icon: <Package size={24} /> },
    { title: "Người dùng", value: 98, icon: <Users size={24} /> },
    { title: "Đơn hàng", value: 56, icon: <Home size={24} /> },
    { title: "Doanh thu", value: "$12,430", icon: <Shield size={24} /> },
  ];

  return (
    <motion.div
      className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-md rounded-2xl hover:shadow-lg transition">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h4 className="text-gray-500 text-sm mb-1">{stat.title}</h4>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
            <div className="text-blue-500 bg-blue-50 p-3 rounded-full">{stat.icon}</div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
};
export default DashboardPage;