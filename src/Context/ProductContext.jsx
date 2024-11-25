import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [productsTable, setProductsTable] = useState([]);
  const [sendProducts, setSendProducts] = useState([]);

  // Función para agregar un producto a la lista
  const addProduct = (newProduct) => {
    setSendProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const addProductTable = (product) => {
    setProductsTable((prevProducts) => [...prevProducts, product]);
  };

  const clearProducts = () => {
    setSendProducts([]);
    setProductsTable([]);
  };

  return (
    <ProductContext.Provider
      value={{
        sendProducts,
        addProduct,
        productsTable,
        addProductTable,
        clearProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
