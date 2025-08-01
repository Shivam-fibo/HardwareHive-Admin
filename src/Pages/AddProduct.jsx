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
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewSubCategory, setIsNewSubCategory] = useState(false);
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [newModel, setNewModel] = useState('');
  const [newSize, setNewSize] = useState('');
  const [brandImage, setBrandImage] = useState(null);
  const [productBrand, setProductBrand] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [subCategoryError, setSubCategoryError] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [productBrands, setProductBrands] = useState([]);
  const [productModels, setProductModels] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [isCustomProductBrand, setIsCustomProductBrand] = useState(false);
  const [isCustomProductModel, setIsCustomProductModel] = useState(false);
  const [isCustomProductSize, setIsCustomProductSize] = useState(false);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [brandImagePreview, setBrandImagePreview] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch categories with subcategories (existing)
        const categoriesRes = await fetch("https://hardware-hive-backend.vercel.app/api/admin/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Fetch all standalone data for dropdowns
        const [allCategoriesRes, allSubCategoriesRes, allBrandsRes, modelsRes, sizesRes] = await Promise.all([
          fetch("https://hardware-hive-backend.vercel.app/api/admin/all-categories"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/all-subcategories"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/all-brands"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/all-models"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/all-sizes")
        ]);

        setAllCategories(await allCategoriesRes.json());
        setAllSubCategories(await allSubCategoriesRes.json());
        setAllBrands(await allBrandsRes.json());
        setAllModels(await modelsRes.json());
        setAllSizes(await sizesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId && !isNewCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(`https://hardware-hive-backend.vercel.app/api/admin/subcategories/${selectedCategoryId}`);
          const data = await response.json();
          setAvailableSubCategories(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubCategories();
      setSelectedSubCategoryId("");
      setSelectedBrandId("");
      setAvailableBrands([]);
      setIsNewSubCategory(false);
      setIsNewBrand(false);
    }
  }, [selectedCategoryId, isNewCategory]);

  // Update brands when subcategory changes
  useEffect(() => {
    if (selectedSubCategoryId && !isNewSubCategory) {
      fetchBrands(selectedSubCategoryId);
      setSelectedBrandId("");
      setIsNewBrand(false);
    }
  }, [selectedSubCategoryId, isNewSubCategory]);

  const fetchBrands = async (subCategoryId) => {
    try {
      const response = await fetch(`https://hardware-hive-backend.vercel.app/api/admin/brands/${subCategoryId}`);
      const data = await response.json();
      setAvailableBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Existing helper functions
  const checkSubCategoryExists = (name) => {
    if (!selectedCategoryId) return false;

    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
    if (!selectedCategory) return false;

    return selectedCategory.subcategories.some(
      subCat => subCat.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleCategoryChange = (value) => {
    if (value === "new") {
      setIsNewCategory(true);
      setSelectedCategoryId("");
      setSelectedSubCategoryId("");
      setSelectedBrandId("");
      setAvailableSubCategories([]);
      setAvailableBrands([]);
    } else {
      setIsNewCategory(false);
      setSelectedCategoryId(value);
      setNewCategoryName("");
      setNewSubCategoryName("");
      setNewBrandName("");
      setNewProductId("");
      setBrandImage(null);
    }
  };

  const handleSubCategoryChange = (value) => {
    if (value === "new") {
      if (newSubCategoryName && checkSubCategoryExists(newSubCategoryName)) {
        setSubCategoryError("Subcategory already exists");
      } else {
        setSubCategoryError("");
      }
      setIsNewSubCategory(true);
      setSelectedSubCategoryId("");
      setSelectedBrandId("");
      setAvailableBrands([]);
    } else {
      setIsNewSubCategory(false);
      setSelectedSubCategoryId(value);
      setNewSubCategoryName("");
      setNewBrandName("");
      setNewProductId("");
      setBrandImage(null);
      setSubCategoryError("");
    }
  };

  const handleBrandChange = (value) => {
    if (value === "new") {
      setIsNewBrand(true);
      setSelectedBrandId("");
    } else {
      setIsNewBrand(false);
      setSelectedBrandId(value);
      setNewBrandName("");
      setNewProductId("");
      setBrandImage(null);
    }
  };

  const handleModelChange = (value) => {
    if (value === "other") {
      setIsCustomModel(true);
      setNewModel("");
    } else {
      setIsCustomModel(false);
      setNewModel(value);
    }
  };

  const handleSizeChange = (value) => {
    if (value === "other") {
      setIsCustomSize(true);
      setNewSize("");
    } else {
      setIsCustomSize(false);
      setNewSize(value);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [brandsRes, modelsRes, sizesRes] = await Promise.all([
          fetch("https://hardware-hive-backend.vercel.app/api/admin/product-brands"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/product-models"),
          fetch("https://hardware-hive-backend.vercel.app/api/admin/product-sizes")
        ]);

        setProductBrands(await brandsRes.json());
        setProductModels(await modelsRes.json());
        setProductSizes(await sizesRes.json());
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  // Add these handler functions
  const handleProductBrandChange = (value) => {
    if (value === "other") {
      setIsCustomProductBrand(true);
      setProductBrand("");
    } else {
      setIsCustomProductBrand(false);
      setProductBrand(value);
    }
  };

  const handleProductModelChange = (value) => {
    if (value === "other") {
      setIsCustomProductModel(true);
      setProductInfo("");
    } else {
      setIsCustomProductModel(false);
      setProductInfo(value);
    }
  };

  const handleProductSizeChange = (value) => {
    if (value === "other") {
      setIsCustomProductSize(true);
      setSubheading("");
    } else {
      setIsCustomProductSize(false);
      setSubheading(value);
    }
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
    setSelectedBrandId("");
    setIsNewCategory(false);
    setIsNewSubCategory(false);
    setIsNewBrand(false);
    setProductBrand("")
    setNewCategoryName("");
    setNewSubCategoryName("");
    setNewBrandName("");
    setNewProductId("");
    setBrandImage(null);
    setProductImagePreview(null);
  setBrandImagePreview(null);
  };

  const handleSubmit = async () => {
    if ((isNewCategory || isNewSubCategory) && checkSubCategoryExists(newSubCategoryName)) {
      setSubCategoryError("Subcategory already exists");
      setMessage("Please fix the errors before submitting");
      setLoading(false);
      return;
    }
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subheading", subheading);
    formData.append("productInfo", productInfo);
    formData.append("productBrand", productBrand)
    formData.append("price", price);
    formData.append("buyingPrice", buyingPrice);
    formData.append("image", image);
    formData.append("isNewCategory", isNewCategory);
    formData.append("isNewSubCategory", isNewSubCategory);
    formData.append("isNewBrand", isNewBrand);
    formData.append("model", newModel);
    formData.append("size", newSize);

    if (isNewCategory) {
      formData.append("newCategoryName", newCategoryName);
      formData.append("newSubCategoryName", newSubCategoryName);
      formData.append("newBrandName", newBrandName);
      formData.append("newProductId", newProductId);
      formData.append("brandImage", brandImage);
    } else {
      formData.append("categoryId", selectedCategoryId);
      if (isNewSubCategory) {
        formData.append("newSubCategoryName", newSubCategoryName);
        formData.append("newBrandName", newBrandName);
        formData.append("newProductId", newProductId);
        formData.append("brandImage", brandImage);
      } else {
        formData.append("subCategoryId", selectedSubCategoryId);
        if (isNewBrand) {
          formData.append("newBrandName", newBrandName);
          formData.append("newProductId", newProductId);
          formData.append("brandImage", brandImage);
        } else {
          formData.append("brandId", selectedBrandId);
        }
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

  const getSelectedBrand = () => {
    if (selectedBrandId) {
      return availableBrands.find(brand => brand._id === selectedBrandId);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Upload Product</h2>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${message.includes('successfully')
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category, SubCategory & Brand Section */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Category & Brand Selection</h3>

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
                    {allCategories.map((category) => (
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
                      value={isNewSubCategory ? "new" : selectedSubCategoryId}
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
                {(isNewCategory || isNewSubCategory) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      {isNewCategory ? "SubCategory Name" : "New SubCategory Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter subcategory name"
                      value={newSubCategoryName}
                      onChange={(e) => {
                        setNewSubCategoryName(e.target.value);
                        if (checkSubCategoryExists(e.target.value)) {
                          setSubCategoryError("Subcategory already exists");
                        } else {
                          setSubCategoryError("");
                        }
                      }}
                      className={`w-full p-3 border ${subCategoryError ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      required
                    />
                    {subCategoryError && (
                      <p className="mt-1 text-sm text-red-600">{subCategoryError}</p>
                    )}
                  </div>
                )}

                {/* Brand Selection */}
                {!isNewCategory && !isNewSubCategory && selectedSubCategoryId && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Brand</label>
                    <select
                      value={isNewBrand ? "new" : selectedBrandId}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Brand</option>
                      {availableBrands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name} - {brand.productId}
                        </option>
                      ))}
                      <option value="new">+ Add New Brand</option>
                    </select>
                  </div>
                )}

                {/* New Brand Name and Product ID */}
                {(isNewCategory || isNewSubCategory || isNewBrand) && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Brand Name</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Product Name</label>
                      <input
                        type="text"
                        placeholder="Enter product ID"
                        value={newProductId}
                        onChange={(e) => setNewProductId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Model Number</label>
                      <select
                        value={isCustomModel ? "other" : newModel}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Model</option>
                        {allModels.map((model, index) => (
                          <option key={index} value={model}>
                            {model}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {isCustomModel && (
                        <input
                          type="text"
                          placeholder="Enter custom model"
                          value={newModel}
                          onChange={(e) => setNewModel(e.target.value)}
                          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Size</label>
                      <select
                        value={isCustomSize ? "other" : newSize}
                        onChange={(e) => handleSizeChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Size</option>
                        {allSizes.map((size, index) => (
                          <option key={index} value={size}>
                            {size}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {isCustomSize && (
                        <input
                          type="text"
                          placeholder="Enter custom size"
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Brand Image */}
                {(isNewCategory || isNewSubCategory || isNewBrand) && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Brand Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBrandImageChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {brandImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={brandImagePreview}
                          alt="Brand Preview"
                          className="h-40 object-contain border rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Brand Display */}
                {getSelectedBrand() && (
                  <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Selected Brand:</h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={getSelectedBrand().image}
                        alt={getSelectedBrand().name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-gray-700 font-medium">{getSelectedBrand().name}</span>
                        <p className="text-sm text-gray-500">ID: {getSelectedBrand().productId}</p>
                      </div>
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
                    <label className="block text-sm font-medium mb-2 text-gray-700">Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter Item Name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Brand</label>
                    <select
                      value={isCustomProductBrand ? "other" : productBrand}
                      onChange={(e) => handleProductBrandChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Brand</option>
                      {productBrands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                    {isCustomProductBrand && (
                      <input
                        type="text"
                        placeholder="Enter custom brand"
                        value={productBrand}
                        onChange={(e) => setProductBrand(e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Model Number</label>
                    <select
                      value={isCustomProductModel ? "other" : productInfo}
                      onChange={(e) => handleProductModelChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Model</option>
                      {productModels.map((model, index) => (
                        <option key={index} value={model}>
                          {model}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                    {isCustomProductModel && (
                      <input
                        type="text"
                        placeholder="Enter custom model"
                        value={productInfo}
                        onChange={(e) => setProductInfo(e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Size</label>
                    <select
                      value={isCustomProductSize ? "other" : subheading}
                      onChange={(e) => handleProductSizeChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Size</option>
                      {productSizes.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                    {isCustomProductSize && (
                      <input
                        type="text"
                        placeholder="Enter custom size"
                        value={subheading}
                        onChange={(e) => setSubheading(e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    )}
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
                      onChange={handleProductImageChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {productImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <img
                          src={productImagePreview}
                          alt="Product Preview"
                          className="h-40 object-contain border rounded-lg"
                        />
                      </div>
                    )}
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