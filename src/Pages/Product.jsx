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
  });

  // Category selection and matching for each category
  const [machineryData, setMachineryData] = useState({
    enabled: false,
    subcategory: "",
    brand: "",
    productName: "",
    modelName: "",
    size: "",
  });

  const [brandsData, setBrandsData] = useState({
    enabled: false,
    subcategory: "",
  });

  const [sparePartsData, setSparePartsData] = useState({
    enabled: false,
    subcategory: "",
    brand: "",
    productName: "",
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

  // Past data for each category
  const [machineryPastData, setMachineryPastData] = useState({
    subcategories: [],
    brands: [],
    productNames: [],
    modelNames: [],
    sizes: [],
  });

  const [brandsPastData, setBrandsPastData] = useState({
    subcategories: [],
  });

  const [sparePartsPastData, setSparePartsPastData] = useState({
    subcategories: [],
    brands: [],
    productNames: [],
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

  // Fetch product past data on component mount
  useEffect(() => {
    fetchProductPastData();
  }, []);

  // Fetch category past data when categories are enabled
  useEffect(() => {
    if (machineryData.enabled && machineryPastData.subcategories.length === 0) {
      fetchMachineryPastData();
    }
  }, [machineryData.enabled]);

  useEffect(() => {
    if (brandsData.enabled && brandsPastData.subcategories.length === 0) {
      fetchBrandsPastData();
    }
  }, [brandsData.enabled]);

  useEffect(() => {
    if (sparePartsData.enabled && sparePartsPastData.subcategories.length === 0) {
      fetchSparePartsPastData();
    }
  }, [sparePartsData.enabled]);

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

  const fetchMachineryPastData = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/machinery/past-data");
      const data = await response.json();
      if (response.ok) {
        setMachineryPastData(data);
      }
    } catch (error) {
      console.error("Error fetching machinery past data:", error);
    }
  };

  const fetchBrandsPastData = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/brands/past-data");
      const data = await response.json();
      if (response.ok) {
        setBrandsPastData(data);
      }
    } catch (error) {
      console.error("Error fetching brands past data:", error);
    }
  };

  const fetchSparePartsPastData = async () => {
    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/spare-part/past-data");
      const data = await response.json();
      if (response.ok) {
        setSparePartsPastData(data);
      }
    } catch (error) {
      console.error("Error fetching spare parts past data:", error);
    }
  };

  const handleProductInfoChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMachineryDataChange = (e) => {
    const { name, value } = e.target;
    setMachineryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandsDataChange = (e) => {
    const { name, value } = e.target;
    setBrandsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSparePartsDataChange = (e) => {
    const { name, value } = e.target;
    setSparePartsData((prev) => ({
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

  const handleSubmit = async () => {
    // Check if at least one category is enabled
    if (!machineryData.enabled && !brandsData.enabled && !sparePartsData.enabled) {
      alert("Please enable at least one category!");
      return;
    }

    // Prepare data for product API
    const formData = new FormData();
    
    // Add basic product info
    Object.keys(productInfo).forEach(key => {
      formData.append(key, productInfo[key]);
    });

    // Prepare category data
    const categoryData = {};
    const selectedCategories = [];

    if (machineryData.enabled) {
      selectedCategories.push("machinery");
      categoryData.machinery = {
        subcategory: machineryData.subcategory,
        brand: machineryData.brand,
        productName: machineryData.productName,
        modelName: machineryData.modelName,
        size: machineryData.size,
      };
    }

    if (brandsData.enabled) {
      selectedCategories.push("brands");
      categoryData.brands = {
        subcategory: brandsData.subcategory,
      };
    }

    if (sparePartsData.enabled) {
      selectedCategories.push("spare-parts");
      categoryData["spare-parts"] = {
        subcategory: sparePartsData.subcategory,
        brand: sparePartsData.brand,
        productName: sparePartsData.productName,
        size: sparePartsData.size,
      };
    }

    // Add categories info
    formData.append("categories", JSON.stringify(selectedCategories));
    formData.append("categoryData", JSON.stringify(categoryData));

    // Add image
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      // Call PRODUCT API
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
      
        });
        setMachineryData({
          enabled: false,
          subcategory: "",
          brand: "",
          productName: "",
          modelName: "",
          size: "",
        });
        setBrandsData({
          enabled: false,
          subcategory: "",
        });
        setSparePartsData({
          enabled: false,
          subcategory: "",
          brand: "",
          productName: "",
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

  const renderDropdown = (name, value, onChange, placeholder, options, required = true) => {
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {placeholder}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
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

  const getEnabledCategoriesCount = () => {
    let count = 0;
    if (machineryData.enabled) count++;
    if (brandsData.enabled) count++;
    if (sparePartsData.enabled) count++;
    return count;
  };

  return (
    <div className="flex gap-4 p-4 min-h-screen">
      {/* SECTION 1: Product Information */}
      <div className="w-1/4 border rounded-lg shadow-lg bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 bg-blue-100 p-2 rounded">
          Product Information
        </h3>
        
        {renderProductDropdownWithAddOption("title", "title", productPastData.title)}
        {renderProductDropdownWithAddOption("brand", "brand", productPastData.brands)}
        {renderProductDropdownWithAddOption("modelName", "model name", productPastData.modelNames)}
        {renderProductDropdownWithAddOption("size", "size", productPastData.sizes)}
        {renderProductDropdownWithAddOption("machineName", "machine name", productPastData.machineName)}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={productInfo.description}
            onChange={handleProductInfoChange}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image *</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            className="border p-2 w-full rounded" 
            accept="image/*"
            required 
          />
        </div>

        {imagePreview && (
          <div className="relative border rounded-lg p-3 bg-gray-100 w-fit">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Preview</p>
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
            <img src={imagePreview} alt="preview" className="w-24 h-auto rounded shadow-md border" />
          </div>
        )}
      </div>

      {/* SECTION 2: Machinery Category */}
      <div className="w-1/4 border rounded-lg shadow-lg bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 bg-green-100 p-2 rounded flex-1">
            Machinery Category
          </h3>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              checked={machineryData.enabled}
              onChange={(e) => setMachineryData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {machineryData.enabled ? (
          <div className="space-y-1">
            {renderDropdown("subcategory", machineryData.subcategory, handleMachineryDataChange, "subcategory", machineryPastData.subcategories)}
            {renderDropdown("brand", machineryData.brand, handleMachineryDataChange, "brand", machineryPastData.brands)}
            {renderDropdown("productName", machineryData.productName, handleMachineryDataChange, "machinery product name", machineryPastData.productNames)}
            {renderDropdown("modelName", machineryData.modelName, handleMachineryDataChange, "model name", machineryPastData.modelNames)}
            {renderDropdown("size", machineryData.size, handleMachineryDataChange, "size", machineryPastData.sizes)}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-16 bg-gray-50 rounded-lg">
            Enable this category to add machinery details
          </div>
        )}
      </div>

      {/* SECTION 3: Brands Category */}
      <div className="w-1/4 border rounded-lg shadow-lg bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 bg-yellow-100 p-2 rounded flex-1">
            Brands Category
          </h3>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              checked={brandsData.enabled}
              onChange={(e) => setBrandsData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {brandsData.enabled ? (
          <div className="space-y-1">
            {renderDropdown("subcategory", brandsData.subcategory, handleBrandsDataChange, "brand subcategory", brandsPastData.subcategories)}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-16 bg-gray-50 rounded-lg">
            Enable this category to add brand details
          </div>
        )}
      </div>

      {/* SECTION 4: Spare Parts Category */}
      <div className="w-1/4 border rounded-lg shadow-lg bg-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 bg-red-100 p-2 rounded flex-1">
            Spare Parts Category
          </h3>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              checked={sparePartsData.enabled}
              onChange={(e) => setSparePartsData(prev => ({ ...prev, enabled: e.target.checked }))}
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {sparePartsData.enabled ? (
          <div className="space-y-1">
            {renderDropdown("subcategory", sparePartsData.subcategory, handleSparePartsDataChange, "spare part subcategory", sparePartsPastData.subcategories)}
            {renderDropdown("brand", sparePartsData.brand, handleSparePartsDataChange, "machinery name", sparePartsPastData.brands)}
            {renderDropdown("productName", sparePartsData.productName, handleSparePartsDataChange, "spare part name", sparePartsPastData.productNames)}
            {renderDropdown("size", sparePartsData.size, handleSparePartsDataChange, "size", sparePartsPastData.sizes)}
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-16 bg-gray-50 rounded-lg">
            Enable this category to add spare parts details
          </div>
        )}
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-4 px-8 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-lg"
          disabled={getEnabledCategoriesCount() === 0}
        >
          Submit Product 
          {getEnabledCategoriesCount() > 0 && (
            <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded-full text-sm">
              {getEnabledCategoriesCount()} enabled
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;