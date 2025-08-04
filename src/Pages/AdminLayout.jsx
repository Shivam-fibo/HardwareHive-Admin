// src/Pages/AdminLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-6 space-y-4  shadow-md">
          <button onClick={() => navigate("/dashboard")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Dashboard</button>
          <button onClick={() => navigate("/category")} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Add Category</button>
          <button onClick={() => navigate("/uploadProduct")} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Add Product</button>
          <button onClick={() => navigate("/editProduct")} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">Edit Product</button>
          <button onClick={() => navigate("/getAllQuery")} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded">Query</button>
          <button onClick={() => navigate("/getAllOrder")} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">Show Orders</button>
          <button onClick={() => navigate("/profile")} className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded">Profile Requests</button>
        </div>

        {/* Right Panel (Outlet for pages) */}
        <div className="flex-1 p-6 overflow-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
