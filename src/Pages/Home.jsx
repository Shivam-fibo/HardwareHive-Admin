import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white text-center">Dashboard</h1>
          </div>
          
          <div className="p-6 space-y-4">
            
            <button 
              onClick={() => navigate("/dashboard")} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center font-medium"
            >
              Dashboard
            </button>
            
            <button 
              onClick={() => navigate("/addProduct")} 
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
          </div>
          
          <div className="bg-gray-700 px-6 py-4">
            <p className="text-gray-400 text-center text-sm">Product Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;