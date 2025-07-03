import { useState, useEffect } from "react";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [price, setPrice] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Category management states
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [addNewSubCategory, setAddNewSubCategory] = useState(false);

  // Fetch existing categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId && !isNewCategory) {
      const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
      setAvailableSubCategories(selectedCategory?.subcategories || []);
      setSelectedSubCategoryId("");
      setAddNewSubCategory(false);
    }
  }, [selectedCategoryId, categories, isNewCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (value) => {
    if (value === "new") {
      setIsNewCategory(true);
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
      setAvailableSubCategories([]);
    } else {
      setIsNewCategory(false);
      setSelectedCategoryId(value);
      setNewCategoryName("");
      setNewSubCategoryName("");
      setSubCategoryImage(null);
    }
  };

  const handleSubCategoryChange = (value) => {
    if (value === "new") {
      setAddNewSubCategory(true);
      setSelectedSubCategoryId("");
    } else {
      setAddNewSubCategory(false);
      setSelectedSubCategoryId(value);
      setNewSubCategoryName("");
      setSubCategoryImage(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubheading("");
    setProductInfo("");
    setPrice("");
    setBuyingPrice("");
    setImage(null);
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setIsNewCategory(false);
    setNewCategoryName("");
    setNewSubCategoryName("");
    setSubCategoryImage(null);
    setAddNewSubCategory(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subheading", subheading);
    formData.append("productInfo", productInfo);
    formData.append("price", price);
    formData.append("buyingPrice", buyingPrice);
    formData.append("image", image);
    formData.append("isNewCategory", isNewCategory);

    if (isNewCategory) {
      formData.append("newCategoryName", newCategoryName);
      formData.append("newSubCategoryName", newSubCategoryName);
      formData.append("subCategoryImage", subCategoryImage);
    } else {
      formData.append("categoryId", selectedCategoryId);
      if (addNewSubCategory) {
        formData.append("newSubCategoryName", newSubCategoryName);
        formData.append("subCategoryImage", subCategoryImage);
      } else {
        formData.append("subCategoryId", selectedSubCategoryId);
      }
    }

    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/admin/uploadProduct", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Product uploaded successfully!");
        resetForm();
        fetchCategories();
      } else {
        setMessage(data.error || "Failed to upload product.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedSubCategory = () => {
    if (selectedSubCategoryId) {
      return availableSubCategories.find(sub => sub._id === selectedSubCategoryId);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Upload Product</h2>
          
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category & SubCategory Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Category Selection</h3>
                
                {/* Category Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                  <select
                    value={isNewCategory ? "new" : selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                </div>

                {/* New Category Name */}
                {isNewCategory && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">New Category Name</label>
                    <input
                      type="text"
                      placeholder="Enter new category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {/* SubCategory Selection */}
                {!isNewCategory && selectedCategoryId && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">SubCategory</label>
                    <select
                      value={addNewSubCategory ? "new" : selectedSubCategoryId}
                      onChange={(e) => handleSubCategoryChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select SubCategory</option>
                      {availableSubCategories.map((subCat) => (
                        <option key={subCat._id} value={subCat._id}>
                          {subCat.name}
                        </option>
                      ))}
                      <option value="new">+ Add New SubCategory</option>
                    </select>
                  </div>
                )}

                {/* New SubCategory Name */}
                {(isNewCategory || addNewSubCategory) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      {isNewCategory ? "SubCategory Name" : "New SubCategory Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter subcategory name"
                      value={newSubCategoryName}
                      onChange={(e) => setNewSubCategoryName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {/* SubCategory Image */}
                {(isNewCategory || addNewSubCategory) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">SubCategory Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSubCategoryImage(e.target.files[0])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {/* Selected SubCategory Display */}
                {getSelectedSubCategory() && (
                  <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Selected SubCategory:</h4>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={getSelectedSubCategory().image} 
                        alt={getSelectedSubCategory().name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span className="text-gray-700">{getSelectedSubCategory().name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Product Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Brand Name</label>
                    <input
                      type="text"
                      placeholder="Enter brand name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={subheading}
                      onChange={(e) => setSubheading(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Model Number</label>
                    <input
                      type="text"
                      placeholder="Enter model number"
                      value={productInfo}
                      onChange={(e) => setProductInfo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Buying Price</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={buyingPrice}
                        onChange={(e) => setBuyingPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Selling Price</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;