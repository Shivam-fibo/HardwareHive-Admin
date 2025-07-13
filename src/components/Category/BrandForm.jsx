import React, { useState } from "react";

const BrandForm = () => {
  const [formData, setFormData] = useState({
    subcategory: "",
    brand: "",
    productName: "",
    modelName: "",
    size: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      const response = await fetch("https://hardware-hive-backend.vercel.app/api/category/brands", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Brand uploaded successfully!");
        setFormData({
          subcategory: "",
          brand: "",
          productName: "",
          modelName: "",
          size: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        alert("Error uploading brand: " + result.message);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 w-1/4 border-r space-y-3">
      <h2 className="text-xl font-bold text-center">brand</h2>
      <input
        type="text"
        name="subcategory"
        placeholder="subcategory"
        className="border p-2"
        value={formData.subcategory}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="brand"
        placeholder="brand"
        className="border p-2"
        value={formData.brand}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="productName"
        placeholder="product name"
        className="border p-2"
        value={formData.productName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="modelName"
        placeholder="modle name"
        className="border p-2"
        value={formData.modelName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="size"
        placeholder="size"
        className="border p-2"
        value={formData.size}
        onChange={handleChange}
        required
      />
      <input type="file" onChange={handleImageChange} className="border p-2" />
      {imagePreview && <img src={imagePreview} alt="preview" className="w-24 border" />}
      <button type="submit" className="bg-black text-white py-2">
        upload
      </button>
    </form>
  );
};

export default BrandForm;
