import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

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

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if empty
        seedInitialData();
      } else {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      }
    }, (error) => {
      // Fallback to local data if offline or permission denied
      if (products.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      }
    });

    return () => unsubscribe();
  }, []);

  const seedInitialData = async () => {
    try {
      for (const product of INITIAL_PRODUCTS) {
        const docRef = doc(collection(db, 'products'), String(product.id));
        await setDoc(docRef, {
          ...product,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      // If seeding fails (e.g., due to permissions), fallback to local data
      if (products.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      }
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const docRef = doc(collection(db, 'products'), String(product.id));
      await setDoc(docRef, {
        ...product,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string | number, updatedProduct: Product) => {
    try {
      const docRef = doc(db, 'products', String(id));
      await updateDoc(docRef, {
        ...updatedProduct
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      const docRef = doc(db, 'products', String(id));
      await deleteDoc(docRef);
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
