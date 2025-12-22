import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../contexts/AuthContext";

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="md:hidden">
          <Menu size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-700">Bảng điều khiển</h2>
      </div>
      <div className="flex items-center gap-4 relative">
        <span className="text-gray-600">
          Xin chào, <b>{user?.fullName || user?.email || 'Admin'}</b>
        </span>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition"
          >
            <img 
              src={user?.avatar || "https://i.pravatar.cc/40"} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border" 
            />
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;