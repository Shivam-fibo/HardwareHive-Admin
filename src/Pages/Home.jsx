import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <Navbar />
      <hr className="h-1 bg-[#013E70]" />
      <div className="w-full max-w-md">
        <div className="overflow-hidden">
          <div className="p-6 space-y-4">
  <button
    onClick={() => navigate("/dashboard")}
    className="w-48 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Dashboard
  </button>

  <button
    onClick={() => navigate("/category")}
    className="w-48 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Add Category
  </button>

  <button
    onClick={() => navigate("/uploadProduct")}
    className="w-48 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Add Product
  </button>

  <button
    onClick={() => navigate("/editProduct")}
    className="w-48 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Edit Product
  </button>

  <button
    onClick={() => navigate("/getAllQuery")}
    className="w-48 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Query
  </button>


  <button
    onClick={() => navigate("/getAllOrder")}
    className="w-48 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Show Order Placed
  </button>

  <button
    onClick={() => navigate("/profile")}
    className="w-48 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition duration-300 transform hover:scale-110 flex items-center justify-center font-medium cursor-pointer"
  >
    Profile Requires
  </button>
</div>




        </div>
      </div>
    </div>
  );
};

export default Home;