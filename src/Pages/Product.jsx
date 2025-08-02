import React, { useState, useEffect, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [formData, setFormData] = useState({
    title: "",
    buyingPrice: "",
    sellingPrice: "",
    machineName: "",
    brand: "",
    modelName: "",
    size: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pastData, setPastData] = useState({
    title: [],
    buyingPrice: [],
    sellingPrice: [],
    brands: [],
    machineName: [],
    modelNames: [],
    sizes: [],
  });

  // Tracks which fields are in "Add new" input mode
  const [showNewOption, setShowNewOption] = useState({
    title: false,
    buyingPrice: false,
    sellingPrice: false,
    brand: false,
    machineName: false,
    modelName: false,
    size: false,
  });

  const navigate = useNavigate();
  const { setProductData } = useContext(ProductContext);

  useEffect(() => {
    // Fetch past data when component mounts
    const fetchPastData = async () => {
      try {
        const response = await fetch(
          "https://hardware-hive-backend.vercel.app/api/product/getProductAdmin"
        );
        const data = await response.json();
        if (response.ok) {
          setPastData(data);
        }
      } catch (error) {
        console.error("Error fetching past product data:", error);
      }
    };
    fetchPastData();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const productJson = {
      ...formData,
      image: imageFile,
    };

    setProductData(productJson);
    console.log(productJson);

    navigate("/categoryList");
  };

  const toggleNewOption = (field) => {
    setShowNewOption((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Updated dropdown to include "Add new ..." as an option inside select
  const renderDropdownWithAddOption = (fieldName, placeholder, options) => {
    const isAddingNew = showNewOption[fieldName];

    const handleSelectChange = (e) => {
      const val = e.target.value;
      if (val === "__add_new__") {
        toggleNewOption(fieldName);
        setFormData((prev) => ({ ...prev, [fieldName]: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: val }));
      }
    };

    return (
      <div className="mb-3">
        {!isAddingNew ? (
          <>
            <select
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleSelectChange}
              className="border p-2 w-full"
              required
            >
              <option value="">Select {placeholder}</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
              <option
                value="__add_new__"
                className="bold "
              >
                Add new {placeholder}
              </option>
            </select>
          </>
        ) : (
          <>
            <input
              type="text"
              name={fieldName}
              value={formData[fieldName]}
              onChange={handleChange}
              placeholder={`Enter new ${placeholder}`}
              className="border p-2 w-full"
              required
            />
            <button
              type="button"
              className="text-sm text-gray-600 mt-1 underline"
              onClick={() => toggleNewOption(fieldName)}
            >
              Select existing {placeholder}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Upload Product
      </h2>

      {renderDropdownWithAddOption("title", "Product Title", pastData.title)}
      {renderDropdownWithAddOption(
        "sellingPrice",
        "Selling Price",
        pastData.sellingPrice
      )}
      {renderDropdownWithAddOption(
        "buyingPrice",
        "Buying Price",
        pastData.buyingPrice
      )}
      {renderDropdownWithAddOption("brand", "Brand", pastData.brands)}
      {renderDropdownWithAddOption(
        "machineName",
        "Machine Name",
        pastData.machineName
      )}
      {renderDropdownWithAddOption(
        "modelName",
        "Model Name",
        pastData.modelNames
      )}
      {renderDropdownWithAddOption("size", "Size", pastData.sizes)}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      {imagePreview && (
        <div className="relative border rounded-md p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Preview</p>
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="text-red-500 hover:text-red-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-auto rounded border shadow"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
      >
        Upload
      </button>
    </form>
  );
};

export default Product;
