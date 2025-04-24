import React, { useEffect, useState } from "react";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subheading: "",
    category: "",
    productInfo: "",
    price: "",
    buyingPrice: "",
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://hardware-hive.vercel.app/api/admin/getAllProducts");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const startEditing = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setEditProductId(productId);
      setFormData({
        title: product.title,
        subheading: product.subheading,
        category: product.category,
        productInfo: product.productInfo,
        buyingPrice: product.buyingPrice,
        price: product.price,
        image: null,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("subheading", formData.subheading);
    form.append("category", formData.category);
    form.append("productInfo", formData.productInfo);
    form.append("price", formData.price);
    form.append("buyingPrice", formData.buyingPrice);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const res = await fetch(`https://hardware-hive.vercel.app/api/admin/products/${editProductId}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Failed to update product");
      const updated = await res.json();
      alert("Product updated!");

      setProducts((prev) =>
        prev.map((p) => (p._id === editProductId ? updated.product : p))
      );
      setEditProductId(null);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update");
    }
  };


const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
  
    try {
      const res = await fetch(`https://hardware-hive.vercel.app/api/admin/products/${productId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete product");
  
      const result = await res.json();
      alert("Product deleted successfully!");
  
      // Remove deleted product from state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Product Management</h2>

      <ul className="space-y-4 mb-8">
        {products.map((prod) => (
          <li
            key={prod._id}
            className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 hover:shadow-lg transition"
          >
            <div>
              <p className="text-lg font-medium">{prod.title}</p>
              <p className="text-sm text-gray-500">₹{prod.price}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => startEditing(prod._id)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editProductId && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Edit Product</h3>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="subheading"
              value={formData.subheading}
              onChange={handleChange}
              placeholder="Subheading"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-2 rounded"
            />
            <textarea
              name="productInfo"
              value={formData.productInfo}
              onChange={handleChange}
              placeholder="Product Info"
              rows="4"
              className="border p-2 rounded"
            />
            <input
            type="number"
            name="buyingPrice"
            value={formData.buyingPrice}
            onChange={handleChange}
            placeholder="Buying Price"
            className="border p-2 rounded"
          />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditProductId(null)}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
