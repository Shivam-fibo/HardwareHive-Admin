import React, { useState, useEffect } from "react";

const MachineryForm = () => {
  const [formData, setFormData] = useState({
    subcategory: "",
    brand: "",
    productName: "",
    modelName: "",
    size: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pastData, setPastData] = useState({
    subcategories: [],
    brands: [],
    productNames: [],
    modelNames: [],
    sizes: [],
  });
  const [showNewOption, setShowNewOption] = useState({
    subcategory: false,
    brand: false,
    productName: false,
    modelName: false,
    size: false,
  });

  useEffect(() => {
    // Fetch past data when component mounts
    const fetchPastData = async () => {
      try {
        const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/machinery/past-data");
        const data = await response.json();
        if (response.ok) {
          setPastData(data);
        }
      } catch (error) {
        console.error("Error fetching past machinery data:", error);
      }
    };
    fetchPastData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("subcategory", formData.subcategory);
    data.append("brand", formData.brand);
    data.append("productName", formData.productName);
    data.append("modelName", formData.modelName);
    data.append("size", formData.size);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/machinery", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Machinery uploaded successfully!");
        setFormData({
          subcategory: "",
          brand: "",
          productName: "",
          modelName: "",
          size: "",
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Refresh past data after successful submission
        const pastResponse = await fetch("https://hardware-hive-backend.vercel.app/api/category/machinery/past-data");
        const pastData = await pastResponse.json();
        if (pastResponse.ok) {
          setPastData(pastData);
        }
      } else {
        alert("Error uploading machinery: " + result.message);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  const toggleNewOption = (field) => {
    setShowNewOption(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

 const renderDropdownWithAddOption = (fieldName, placeholder, options) => {
  return (
    <div className="mb-3">
      {!showNewOption[fieldName] ? (
        <>
          <select
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleChange}
            className="border p-2 w-full"
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
            onClick={() => toggleNewOption(fieldName)}
          >
            Add new {placeholder}
          </button>
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
    <form onSubmit={handleSubmit} className="flex flex-col p-4 w-1/4 border-r space-y-3">
      <h2 className="text-xl font-bold text-center">Machinery</h2>
      
      {renderDropdownWithAddOption("subcategory", "subcategory", pastData.subcategories)}
      
      {renderDropdownWithAddOption("brand", "brand", pastData.brands)}
      
      {renderDropdownWithAddOption("productName", "product name", pastData.productNames)}
      
      {renderDropdownWithAddOption("modelName", "model name", pastData.modelNames)}
      
      {renderDropdownWithAddOption("size", "size", pastData.sizes)}
      
      <input type="file" onChange={handleImageChange} className="border p-2" required />
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
    <img
      src={imagePreview}
      alt="preview"
      className="w-32 h-auto rounded shadow-md border"
    />
  </div>
)}

      <button type="submit" className="bg-black text-white py-2">
        Upload
      </button>
    </form>
  );
};

export default MachineryForm;