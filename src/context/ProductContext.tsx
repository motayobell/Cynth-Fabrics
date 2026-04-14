import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { api } from '../services/api';

export interface Product {
  id: string | number;
  name: string;
  category?: string;
  subcategory?: string;
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
  createdAt?: any;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string | number, product: Product) => Promise<void>;
  deleteProduct: (id: string | number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Seed initial data if empty
        await seedInitialData();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const seedInitialData = async () => {
    try {
      for (const product of INITIAL_PRODUCTS) {
        await api.createProduct(product);
      }
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error seeding products:", error);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      await api.createProduct(product);
      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string | number, updatedProduct: Product) => {
    try {
      await api.updateProduct(String(id), updatedProduct);
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await api.deleteProduct(String(id));
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
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
