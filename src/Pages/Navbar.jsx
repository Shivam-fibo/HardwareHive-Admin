import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust the path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();            
    navigate("/");      
  };

  return (
    <div className="bg-white p-2">
      <header className="w-full h-full flex justify-between items-center cursor-pointer">
        <img src="./ss_power_tool.svg" width="150px" />
        <div className="text-xl font-bold text-[#013E70] text-center">Admin Panel</div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="bg-[#013E70] rounded-xl border font-bold border-[#013E70] text-white cursor-pointer w-16 h-8 flex items-center justify-center hover:scale-105 transition-transform"
        >
          Logout
        </div>
      </header>
    </div>
  );
};

export default Navbar;
