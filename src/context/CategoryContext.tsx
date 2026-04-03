import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'men',
    name: 'Men',
    subcategories: [
      { id: 'agbada', name: 'Agbada' },
      { id: 'senator', name: 'Senator' }
    ]
  },
  {
    id: 'women',
    name: 'Women',
    subcategories: []
  },
  {
    id: 'kids',
    name: 'Kids',
    subcategories: []
  }
];

interface CategoryContextType {
  categories: Category[];
  saveCategories: (newCategories: Category[]) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'categories');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } else {
        // Seed default categories if document doesn't exist
        setDoc(docRef, { categories: DEFAULT_CATEGORIES }).catch(err => {
          console.error("Failed to seed categories:", err);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/categories');
    });

    return () => unsubscribe();
  }, []);

  const saveCategories = async (newCategories: Category[]) => {
    try {
      const docRef = doc(db, 'settings', 'categories');
      await setDoc(docRef, { categories: newCategories });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/categories');
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, saveCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
