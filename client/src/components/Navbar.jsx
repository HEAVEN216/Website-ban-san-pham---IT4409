import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">Shop</span>
      </div>

      <div className="navbar-right">
        <Link to="/">Trang chủ</Link>
        <Link to="/cart">Giỏ hàng</Link>
        <Link to="/account">Tài khoản</Link>
      </div>
    </nav>
  );
}
