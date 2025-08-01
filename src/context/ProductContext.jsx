import React, { createContext, useState } from "react";

// 1. Create the context
export const ProductContext = createContext();

// 2. Create the provider component
export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null); 

  return (
    <ProductContext.Provider value={{ productData, setProductData }}>
      {children}
    </ProductContext.Provider>
  );
};
