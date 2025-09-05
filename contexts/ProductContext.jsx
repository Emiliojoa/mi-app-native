import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

const PRODUCTS_STORAGE_KEY = '@products';

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos desde AsyncStorage
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (updatedProducts) => {
    try {
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error guardando productos:', error);
      setError('Error al guardar productos');
      throw error;
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProducts = [...products, newProduct];
      await saveProducts(updatedProducts);
      return newProduct;
    } catch (error) {
      setError('Error al agregar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedProducts = products.map(product =>
        product.id === productId
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      );

      await saveProducts(updatedProducts);
      return updatedProducts.find(p => p.id === productId);
    } catch (error) {
      setError('Error al actualizar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const updatedProducts = products.filter(product => product.id !== productId);
      await saveProducts(updatedProducts);
    } catch (error) {
      setError('Error al eliminar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProductByCode = (code) => {
    return products.find(product => product.code === code);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByCode,
    clearError,
    loadProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
