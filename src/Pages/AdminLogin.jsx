import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hardware-hive.vercel.app/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        login(); // Set admin login state
        navigate("/home"); // Redirect to home page
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleInputChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleInputChange} required />
          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
