import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminLayout from "./layouts/Adminlayout.jsx";

// Root App
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AdminLayout />}/>
        
      </Routes>
    </Router>
  );
}