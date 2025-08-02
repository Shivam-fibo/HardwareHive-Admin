import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="">
      <Navbar/>
      <hr className="h-1 bg-[#013E70]" />
      <div className="w-full max-w-md">
        <div className=" rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
         
          </div>
          
          <div className="p-6 space-y-4">
            
            <button 
              onClick={() => navigate("/dashboard")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Dashboard
            </button>
            
            <button 
              onClick={() => navigate("/category")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Add Category
            </button>

              <button 
              onClick={() => navigate("/uploadProduct")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Add Product
            </button> 


            <button 
              onClick={() => navigate("/editProduct")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Edit Product
            </button>
            <button 
              onClick={() => navigate("/getAllQuery")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Query
            </button>
            <button 
              onClick={() => navigate("/addShowAllProduct")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Show All Products
            </button>

            <button 
              onClick={() => navigate("/getAllOrder")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Show Order Placed
            </button>


               <button 
              onClick={() => navigate("/profile")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Profile Requires
            </button>

               {/* <button 
              onClick={() => navigate("/category")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Category
            </button> */}

          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default Home;