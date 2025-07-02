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
  const [categoryIcon, setCategoryIcon] = useState(null);
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
      setCategoryIcon(null);
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
    setCategoryIcon(null);
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
      formData.append("categoryIcon", categoryIcon);
    } else {
      formData.append("categoryId", selectedCategoryId);
      if (addNewSubCategory) {
        formData.append("newSubCategoryName", newSubCategoryName);
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
        // Refresh categories to show newly created ones
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Product</h2>
        {message && (
          <p className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={isNewCategory ? "new" : selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
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

          {/* New Category Fields */}
          {isNewCategory && (
            <>
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
              <div>
                <label className="block text-sm font-medium mb-2">Category Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCategoryIcon(e.target.files[0])}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="New SubCategory Name"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </>
          )}

          {/* SubCategory Selection for Existing Categories */}
          {!isNewCategory && selectedCategoryId && (
            <div>
              <label className="block text-sm font-medium mb-2">SubCategory</label>
              <select
                value={addNewSubCategory ? "new" : selectedSubCategoryId}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
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

          {/* New SubCategory Field */}
          {addNewSubCategory && !isNewCategory && (
            <input
              type="text"
              placeholder="New SubCategory Name"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          )}

          {/* Product Fields */}
          <input
            type="text"
            placeholder="Brand Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <input
            type="text"
            placeholder="Item Name"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <input
            type="text"
            placeholder="Model Number"
            value={productInfo}
            onChange={(e) => setProductInfo(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <input
            type="number"
            placeholder="Buying Price"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <input
            type="number"
            placeholder="Selling Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;