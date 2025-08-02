import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();



  return (

    <div className="bg-white p-2">

      <header
        className="w-full h-full flex justify-between items-center cursor-pointer  "
        onClick={() => navigate("/") }
      >
        <img src="./ss_power_tool.svg" width={"150px"} className="sm:ml-6" />
        <div className="text-xl font-bold text-[#013E70] text-center">Admin Panel</div>
        <div></div>
      </header>
      
    </div>
  );
};

export default Navbar;
