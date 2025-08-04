import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLogin from "./Pages/AdminLogin";
import Home from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import OrdersPage from "./Pages/OderPage";
import QueryList from "./Pages/GetAllQuery";
import ProfileRequests from "./Pages/ProfileRequests";
import CategorySelection from "./Pages/CategorySelection";
import Product from "./Pages/Product";
import CategoryList from "./Pages/Category/CategoryList";
import AdminLayout from "./Pages/AdminLayout";
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ element }) => {
  const { isAdminLoggedIn } = useAuth();
  return isAdminLoggedIn ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* No routes here */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />

          {/* Admin Routes with Sidebar Layout */}
          <Route element={<PrivateRoute element={<AdminLayout />} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/editProduct" element={<EditProduct />} />
            <Route path="/getAllOrder" element={<OrdersPage />} />
            <Route path="/getAllQuery" element={<QueryList />} />
            <Route path="/profile" element={<ProfileRequests />} />
            <Route path="/category" element={<CategorySelection />} />
            <Route path="/uploadProduct" element={<Product />} />
            <Route path="/categoryList" element={<CategoryList />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
