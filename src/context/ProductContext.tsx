import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

export interface Product {
  id: string | number;
  name: string;
  category?: string;
  price?: number;
  currency?: string;
  stock?: number;
  status?: string;
  image: string;
  images?: string[];
  description?: string;
  priceGBP?: string;
  priceUSD?: string;
  tag?: string | null;
  tagColor?: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string | number, product: Product) => void;
  deleteProduct: (id: string | number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Seed with initial data
      // We need to normalize the initial data to match our extended interface if needed
      // But for now, the interface covers both structures
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('products', JSON.stringify(newProducts));
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
      throw error;
    }
  };

  const addProduct = (product: Product) => {
    // Add to the TOP of the list (LIFO)
    const newProducts = [product, ...products];
    saveProducts(newProducts);
  };

  const updateProduct = (id: string | number, updatedProduct: Product) => {
    const newProducts = products.map(p => String(p.id) === String(id) ? updatedProduct : p);
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string | number) => {
    const newProducts = products.filter(p => String(p.id) !== String(id));
    saveProducts(newProducts);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
