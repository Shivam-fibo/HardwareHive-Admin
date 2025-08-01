import React, { useEffect, useState, useContext } from 'react';
import CategoryCard from './CategoryCard';
import { ProductContext } from '../../context/ProductContext';
// Category mapping to backend routes
const categoryRoutes = {
    'Machinery': 'machinery',
    'Brands': 'brands',
    'Spare-Parts': 'spare-parts',
    'Accessories': 'accessiers',
};

const categories = Object.keys(categoryRoutes);

const CategoryList = () => {
    const { productData } = useContext(ProductContext);
    console.log(productData)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);


    const handleCategoryClick = async (category) => {
        const isSameCategory = selectedCategory === category;
        const newCategory = isSameCategory ? null : category;
        setSelectedCategory(newCategory);

        if (isSameCategory) {
            setItems([]);
            return;
        }

        const slug = categoryRoutes[category];
        try {
            const res = await fetch(`https://hardware-hive-backend.vercel.app/api/category/user/${slug}/past-data`);
            const data = await res.json();
            const categoryItems = Array.isArray(data.response) ? data.response : [];
            setItems(categoryItems);
        } catch (error) {
            console.error(`Error fetching ${category}:`, error);
            setItems([]);
        }
    };

    const handleCardSelect = (id) => {
        setSelectedItems((prev) => {
            const exists = prev.find((item) => item.id === id);
            if (exists) {
                return prev.filter((item) => item.id !== id);
            } else {
                return [...prev, { id, categoryType: selectedCategory }];
            }
        });
    };


   const handleFinalSubmit = async () => {
    const formData = new FormData();

    // Append the image file
    formData.append("image", productData.image);

    // Append the rest of product data (as stringified JSON)
    const { image, ...restProductData } = productData;
    formData.append("productData", JSON.stringify(restProductData));

    // Append the selectedCategories
    formData.append("selectedCategories", JSON.stringify(selectedItems));

    try {
        const res = await fetch("https://hardware-hive-backend.vercel.app/api/product/uploadProduct", {
            method: "POST",
            body: formData, // no need for Content-Type
        });

        const data = await res.json();
        console.log("Success:", data);
    } catch (err) {
        console.error("Error submitting:", err);
    }
};



    return (
        <div className="flex px-4 mt-6 gap-6">
            {/* Sidebar Category Filter */}
            <aside className="w-1/5 space-y-4">
                <div className="bg-[#12578c] text-white p-4 rounded-xl border border-[#003865]">
                    <h2 className="text-sm font-bold mb-3">Categories</h2>
                    {categories.map((category, index) => (
                        <label key={index} className="flex items-center justify-between mb-2 text-sm font-semibold cursor-pointer">
                            {category}
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-2 accent-amber-50 border-amber-50"
                                onClick={() => handleCategoryClick(category)}
                                checked={selectedCategory === category}
                                readOnly
                            />
                        </label>
                    ))}
                </div>
            </aside>

            {/* Right Content Area */}
            <section className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((item) => (

                        <CategoryCard
                            key={item._id}
                            category={item.productName}
                            image={item.image}
                            modelNum={item.subcategory}
                            model={item.modelName}
                            size={item.size}
                            brand={item.brand}
                            onSelect={() => handleCardSelect(item._id)}
                            isSelected={selectedItems.some(i => i.id === item._id)}
                        />



                    ))}
                </div>
                {selectedItems.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={handleFinalSubmit}
                            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
                        >
                            Enter
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryList;
