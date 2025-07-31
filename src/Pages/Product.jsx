import React, { useState, useEffect } from "react";

const ProductForm = () => {
  // Product basic info (step 1)
  const [productInfo, setProductInfo] = useState({
    title: "",
    buyingPrice: "",
    sellingPrice: "",
    brand: "",
    modelName: "",
    size: "",
    machineName: "",
    description: "",
    quantity: "",
  });

  // Category selection and matching (step 2)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryData, setCategoryData] = useState({
    subcategory: "",
    brand: "",
    productName: "",
    modelName: "",
    size: "",
  });

  // Past data for product dropdowns
  const [productPastData, setProductPastData] = useState({
    title: [],
    brands: [],
    modelNames: [],
    sizes: [],
    machineName: [],
  });

  // Past data for category dropdowns
  const [categoryPastData, setCategoryPastData] = useState({
    subcategories: [],
    brands: [],
    productNames: [],
    modelNames: [],
    sizes: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Show new option toggles for product fields
  const [showNewProductOption, setShowNewProductOption] = useState({
    title: false,
    brand: false,
    modelName: false,
    size: false,
    machineName: false,
  });

  const categories = [
    { value: "machinery", label: "Machinery", endpoint: "machinery" },
    { value: "brands", label: "Brand", endpoint: "brands" },
    { value: "spare-parts", label: "Spare Parts", endpoint: "spare-part" },
    // Add your 4th category here
  ];

  // Fetch product past data on component mount
  useEffect(() => {
    fetchProductPastData();
  }, []);

  // Fetch category past data when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryPastData();
    }
  }, [selectedCategory]);

  const fetchProductPastData = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/product/getProductAdmin");
      const data = await response.json();
      if (response.ok) {
        setProductPastData(data);
      }
    } catch (error) {
      console.error("Error fetching product past data:", error);
    }
  };

  const fetchCategoryPastData = async () => {
    try {
      const categoryConfig = categories.find(cat => cat.value === selectedCategory);
      if (!categoryConfig) return;

      const response = await fetch(`https://hardware-hive-backend.vercel.app/api/category/${categoryConfig.endpoint}/past-data`);
      const data = await response.json();
      if (response.ok) {
        setCategoryPastData(data);
      }
    } catch (error) {
      console.error("Error fetching category past data:", error);
    }
  };

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    // Reset category data when category changes
    setCategoryData({
      subcategory: "",
      brand: "",
      productName: "",
      modelName: "",
      size: "",
    });
    setCategoryPastData({
      subcategories: [],
      brands: [],
      productNames: [],
      modelNames: [],
      sizes: [],
    });
  };

  const handleCategoryDataChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleNewProductOption = (field) => {
    setShowNewProductOption(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for product API
    const formData = new FormData();
    
    // Add basic product info
    Object.keys(productInfo).forEach(key => {
      formData.append(key, productInfo[key]);
    });

    // Add category info
    formData.append("category", selectedCategory);
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key]) {
        formData.append(`category_${key}`, categoryData[key]);
      }
    });

    // Add image
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Call PRODUCT API (not category API)
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product uploaded successfully!");
        // Reset all form data
        setProductInfo({
          title: "",
          buyingPrice: "",
          sellingPrice: "",
          brand: "",
          modelName: "",
          size: "",
          machineName: "",
          description: "",
          quantity: "",
        });
        setSelectedCategory("");
        setCategoryData({
          subcategory: "",
          brand: "",
          productName: "",
          modelName: "",
          size: "",
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Refresh product past data
        fetchProductPastData();
      } else {
        alert("Error uploading product: " + result.message);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  const renderProductDropdownWithAddOption = (fieldName, placeholder, options) => {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {placeholder} *
        </label>
        {!showNewProductOption[fieldName] ? (
          <>
            <select
              name={fieldName}
              value={productInfo[fieldName]}
              onChange={handleProductInfoChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select {placeholder}</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="text-sm text-blue-600 mt-1 underline"
              onClick={() => toggleNewProductOption(fieldName)}
            >
              Add new {placeholder}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              name={fieldName}
              value={productInfo[fieldName]}
              onChange={handleProductInfoChange}
              placeholder={`Enter new ${placeholder}`}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              className="text-sm text-gray-600 mt-1 underline"
              onClick={() => toggleNewProductOption(fieldName)}
            >
              Select existing {placeholder}
            </button>
          </>
        )}
      </div>
    );
  };

  const renderCategoryDropdown = (fieldName, placeholder, options, required = true) => {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {placeholder}
        </label>
        <select
          name={fieldName}
          value={categoryData[fieldName]}
          onChange={handleCategoryDataChange}
          className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          required={required}
        >
          <option value="">Select {placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderCategoryFields = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory) {
      case "machinery":
        return (
          <>
            {renderCategoryDropdown("subcategory", "subcategory", categoryPastData.subcategories)}
            {renderCategoryDropdown("brand", "brand", categoryPastData.brands)}
            {renderCategoryDropdown("productName", "machinery product name", categoryPastData.productNames)}
            {renderCategoryDropdown("modelName", "model name", categoryPastData.modelNames)}
            {renderCategoryDropdown("size", "size", categoryPastData.sizes)}
          </>
        );
      case "brands":
        return (
          <>
            {renderCategoryDropdown("subcategory", "brand subcategory", categoryPastData.subcategories)}
          </>
        );
      case "spare-parts":
        return (
          <>
            {renderCategoryDropdown("subcategory", "spare part subcategory", categoryPastData.subcategories)}
            {renderCategoryDropdown("brand", "machinery name", categoryPastData.brands)}
            {renderCategoryDropdown("productName", "spare part name", categoryPastData.productNames)}
            {renderCategoryDropdown("size", "size", categoryPastData.sizes)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* STEP 1: Basic Product Information - LEFT SIDE */}
      <div className="w-1/2 border rounded-lg shadow-lg bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Step 1: Product Information</h3>
        
        {/* Product fields with dropdown options */}
        {renderProductDropdownWithAddOption("title", "title", productPastData.title)}
        {renderProductDropdownWithAddOption("brand", "brand", productPastData.brands)}
        {renderProductDropdownWithAddOption("modelName", "model name", productPastData.modelNames)}
        {renderProductDropdownWithAddOption("size", "size", productPastData.sizes)}
        {renderProductDropdownWithAddOption("machineName", "machine name", productPastData.machineName)}

        {/* Price and quantity fields (always input) */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buying Price *
          </label>
          <input
            type="number"
            name="buyingPrice"
            value={productInfo.buyingPrice}
            onChange={handleProductInfoChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            step="0.01"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price *
          </label>
          <input
            type="number"
            name="sellingPrice"
            value={productInfo.sellingPrice}
            onChange={handleProductInfoChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            step="0.01"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={productInfo.quantity}
            onChange={handleProductInfoChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={productInfo.description}
            onChange={handleProductInfoChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image *
          </label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            className="border p-2 w-full rounded" 
            accept="image/*"
            required 
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative border rounded-lg p-3 bg-gray-100 w-fit">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Image Preview</p>
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="text-red-500 hover:text-red-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <img
              src={imagePreview}
              alt="preview"
              className="w-32 h-auto rounded shadow-md border"
            />
          </div>
        )}
      </div>

      {/* STEP 2: Category Selection and Matching - RIGHT SIDE */}
      <div className="w-1/2 border rounded-lg shadow-lg bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Step 2: Match with Category</h3>
        
        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category *
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Category Fields */}
        {selectedCategory && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Match with {categories.find(cat => cat.value === selectedCategory)?.label} Data
            </h4>
            {renderCategoryFields()}
          </div>
        )}

        {!selectedCategory && (
          <div className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-lg">
            Please select a category to see matching options
          </div>
        )}

        {/* Submit Button */}
        <form onSubmit={handleSubmit} className="mt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
            disabled={!selectedCategory}
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;