import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home, Package, Users, Shield, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "./ui/Button";

// Navbar Component
const Navbar = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="md:hidden">
          <Menu size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-700">Bảng điều khiển</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Xin chào, <b>Admin</b></span>
        <img src="https://i.pravatar.cc/40" alt="avatar" className="w-10 h-10 rounded-full border" />
      </div>
    </div>
  );
};
export default Navbar;