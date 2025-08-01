import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLogin from "./Pages/AdminLogin";
import Home from "./Pages/Home";
import AdminDashboard from "./Pages/AdminDashboard"
import AddProduct from "./Pages/AddProduct";
import ShowAllProduct from "./Pages/ShowAllProduct";
import EditProduct from "./Pages/EditProduct";
import { Toaster } from 'react-hot-toast'
import OrdersPage from "./Pages/OderPage";
import QueryList from "./Pages/GetAllQuery";
import ProfileRequests from "./Pages/ProfileRequests";
import CategorySelection from "./Pages/CategorySelection";
import Product from "./Pages/Product";
import CategoryList from "./Pages/Category/CategoryList";
const PrivateRoute = ({ element }) => {
  const { isAdminLoggedIn } = useAuth();
  return isAdminLoggedIn ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<AdminDashboard/>} />}/>
          <Route path="/addProduct" element={<PrivateRoute element={<AddProduct/>} />}/>
          <Route path="/editProduct" element={<PrivateRoute element={<EditProduct/>} />}/>
          <Route path="/addShowAllProduct" element={<PrivateRoute element={<ShowAllProduct/>} />}/>
          <Route path="/getAllOrder" element={<PrivateRoute element={<OrdersPage/>} />}/>
          <Route path="/getAllQuery" element={<PrivateRoute element={<QueryList/>} />}/>
          <Route path = "/profile" element={<PrivateRoute element={<ProfileRequests/>}/>}/>
          <Route path ="/category" element={<PrivateRoute element={<CategorySelection/>}/>}/>
          <Route path ="/uploadProduct" element={<PrivateRoute element={<Product/>}/>}/>
          <Route path ="/categoryList" element={<PrivateRoute element={<CategoryList/>}/>}/>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
