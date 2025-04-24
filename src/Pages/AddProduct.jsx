import { useState } from "react";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productInfo, setProductInfo] =  useState("")
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subheading", subheading);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("productInfo", productInfo)
    formData.append("price", price);
    formData.append("image", image);
    formData.append("buyingPrice", buyingPrice);


    try {
      const response = await fetch("https://hardware-hive.vercel.app/api/admin/uploadProduct", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Product uploaded successfully!");
        setTitle("");
        setSubheading("");
        setCategory("");
        setSubCategory("");
        setProductInfo("");
        setPrice("");
        setImage(null);
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
        {message && <p className="text-green-400 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
         <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          required
        >
          <option value="">Select Category</option>
          <option value="Machinery">Machinery</option>
          <option value="Spare Parts">Spare Parts</option>
          <option value="Brands">Brands</option>
          <option value="Accessories">Accessories</option>
        </select>

          <input
           type="text"
           placeholder="SubCategory"
           value={subCategory}
           onChange={(e) => setSubCategory(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
           
           />
          <input
          type="text"
          placeholder="Information about product"
          value={productInfo}
          onChange={(e) =>setProductInfo(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
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
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
