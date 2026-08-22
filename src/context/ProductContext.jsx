import React, { createContext, useContext, useState } from "react";

// 1. Create context
const ProductContext = createContext();

// 2. Provider
export const ProductProvider = ({ children }) => {
  const [view, setView] = useState("add"); // default view

  return (
    <ProductContext.Provider value={{ view, setView }}>
      {children}
    </ProductContext.Provider>
  );
};

// 3. Custom hook (recommended)
export const useProductView = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductView must be used within ProductViewProvider");
  }
  return context;
};
