import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();



  return (

    <div className="bg-white p-2">

      <header
        className="w-full h-full flex justify-between items-center cursor-pointer " >
        <img src="./ss_power_tool.svg" width={"150px"} />
        <div className="text-xl font-bold text-[#013E70] text-center">Admin Panel</div>
     <div className="bg-[#013E70] rounded-xl border font-bold  border-[#013E70] text-white cursor-pointer w-16 h-8 flex items-center justify-center">
  Logout
</div>

      </header>
      
    </div>
  );
};

export default Navbar;
