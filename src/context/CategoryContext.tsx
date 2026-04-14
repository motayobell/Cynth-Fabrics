import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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

  const fetchCategories = async () => {
    try {
      const data = await api.getSettings('categories');
      if (data && data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        // Seed default categories if not found
        await api.updateSettings('categories', { categories: DEFAULT_CATEGORIES });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategories = async (newCategories: Category[]) => {
    try {
      await api.updateSettings('categories', { categories: newCategories });
      setCategories(newCategories);
    } catch (error) {
      console.error("Error saving categories:", error);
      throw error;
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
