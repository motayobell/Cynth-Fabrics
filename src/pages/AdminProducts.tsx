import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Trash2, 
  Edit2, 
  Package, 
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  X,
  Upload
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useProducts, Product } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { api } from '../services/api';
import CategoryManagerModal from '../components/CategoryManagerModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const [productForm, setProductForm] = useState({
    name: '',
    category: categories[0]?.name || 'Men',
    subcategory: '',
    price: '0',
    currency: 'USD',
    stock: '0',
    image: '',
    images: [] as string[],
    description: ''
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-emerald-100 text-emerald-700';
      case 'Low Stock': return 'bg-amber-100 text-amber-700';
      case 'Out of Stock': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        if (file.size > 500 * 1024 * 1024) {
           setSaveError(`File ${file.name} is too large. Please select a file under 500MB.`);
           throw new Error('File too large');
        }
        
        let fileToUpload: File | Blob = file;
        
        if (file.type.startsWith('image/')) {
          try {
            const base64Str = await compressImage(file);
            const res = await fetch(base64Str);
            fileToUpload = await res.blob();
          } catch (err) {
            console.error('Compression failed, uploading original', err);
          }
        }

        try {
          const url = await api.uploadMedia(fileToUpload as File);
          return url;
        } catch (error: any) {
          console.error("Upload error:", error);
          setSaveError(error.message || "Failed to upload file");
          throw error;
        }
      });

      Promise.allSettled(uploadPromises).then(results => {
        const urls = results
          .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
          .map(result => result.value);
          
        setProductForm(prev => ({ 
          ...prev, 
          images: [...prev.images, ...urls] 
        }));
        setIsUploading(false);
      });
    }
  };

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name.trim()) {
      setSaveError('Product name is required.');
      return;
    }
    
    const stockNum = productForm.stock === '' ? 0 : parseInt(productForm.stock, 10);
    const priceNum = productForm.price === '' ? 0 : parseFloat(productForm.price);
    
    const finalImages = [...productForm.images];
    if (productForm.image && !finalImages.includes(productForm.image)) {
      finalImages.push(productForm.image);
    }

    const mainImage = finalImages.length > 0 ? finalImages[0] : 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=2787&auto=format&fit=crop';

    const existingProduct = editingId ? products.find(p => String(p.id) === String(editingId)) : null;

    const productData: Product = {
      ...(existingProduct || {}),
      id: editingId || Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
      subcategory: productForm.subcategory,
      price: priceNum,
      currency: productForm.currency,
      stock: stockNum,
      status: stockNum === 0 ? 'Out of Stock' : stockNum < 5 ? 'Low Stock' : 'In Stock',
      image: mainImage,
      images: finalImages.length > 0 ? finalImages : [mainImage],
      description: productForm.description
    };

    try {
      setSaveError(null);
      
      if (editingId) {
        await updateProduct(editingId, productData);
        setEditingId(null);
        showToast('Product updated successfully');
      } else {
        await addProduct(productData);
        showToast('Product added successfully');
      }
      
      setIsModalOpen(false);
      setProductForm({ 
        name: '', 
        category: categories[0]?.name || 'Men', 
        subcategory: '',
        price: '0', 
        currency: 'USD',
        stock: '0', 
        image: '', 
        images: [],
        description: '' 
      });
    } catch (error: any) {
      console.error('Error saving product:', error);
      setSaveError(`Failed to save product: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  const handleEditProduct = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Determine price and currency from product data
    let price = product.price?.toString() || '';
    let currency = product.currency || 'USD';

    // Handle legacy data if needed (though context might have normalized it, let's be safe)
    if (product.price === undefined && product.priceUSD) {
       price = product.priceUSD.replace(/[^0-9.]/g, '');
       currency = 'USD';
    } else if (product.price === undefined && product.priceGBP) {
       price = product.priceGBP.replace(/[^0-9.]/g, '');
       currency = 'GBP';
    }

    setProductForm({
      name: product.name,
      category: product.category || categories[0]?.name || 'Men',
      subcategory: product.subcategory || '',
      price: price || '0',
      currency: currency,
      stock: product.stock?.toString() || '0',
      image: '', // Keep this empty so the URL input is clear for new additions
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      description: product.description || ''
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string | number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // In a real app, use a custom modal. For this demo, we'll just delete it directly
    // since window.confirm is blocked in the iframe.
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openNewProductModal = () => {
    setEditingId(null);
      setProductForm({ 
        name: '', 
        category: categories[0]?.name || 'Men', 
        subcategory: '',
        price: '0', 
        currency: 'USD',
        stock: '0', 
        image: '', 
        images: [],
        description: '' 
      });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary selection:text-white">
      <AdminSidebar />

      <main className="md:ml-64 min-h-screen bg-gray-50 relative pb-20 md:pb-0 pt-16 md:pt-0">
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-16 md:top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-lg md:text-xl font-serif text-gray-900">Products</h2>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-primary transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>
            <button 
              onClick={openNewProductModal}
              className="bg-[#f20c92] hover:bg-[#d90a82] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Plus size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">New Product</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-1 md:mb-2 text-gray-900">Inventory</h1>
              <p className="text-gray-500 text-xs md:text-sm">Manage your product catalog and stock levels.</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button 
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Filter size={16} className="md:w-[18px] md:h-[18px]" />
                Categories
              </button>
              <div className="relative flex-1 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-primary shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg md:rounded-xl text-primary">
                  <Package size={20} className="md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">+12%</span>
              </div>
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider font-medium">Total Products</p>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mt-1">{products.length}</h3>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-amber-50 rounded-lg md:rounded-xl text-amber-600">
                  <AlertCircle size={20} className="md:w-6 md:h-6" />
                </div>
              </div>
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider font-medium">Low Stock</p>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mt-1">
                {products.filter(p => (p.stock || 0) < 5 && (p.stock || 0) > 0).length}
              </h3>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm col-span-2 md:col-span-1">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 md:p-3 bg-purple-50 rounded-lg md:rounded-xl text-purple-600">
                  <Filter size={20} className="md:w-6 md:h-6" />
                </div>
              </div>
              <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider font-medium">Categories</p>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mt-1">
                {categories.length}
              </h3>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px] md:min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] md:text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Product</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Category</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Price</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Stock</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm md:text-base truncate">{product.name}</p>
                            <p className="text-[10px] md:text-xs text-gray-500">ID: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm text-gray-600">{product.category || 'Uncategorized'}</span>
                          {product.subcategory && (
                            <span className="text-[10px] md:text-xs text-gray-400 mt-0.5">{product.subcategory}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-xs md:text-sm font-medium text-gray-900">
                          {product.price !== undefined && product.price !== null ? `${getCurrencySymbol(product.currency)}${product.price.toLocaleString()}` : (product.priceUSD || product.priceGBP || 'N/A')}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-xs md:text-sm text-gray-600">{product.stock || 0} units</span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${getStatusColor(product.status || 'In Stock')}`}>
                          {product.status || 'In Stock'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <button 
                            onClick={(e) => handleEditProduct(product, e)}
                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors active:scale-95"
                            title="Edit Product"
                          >
                            <Edit2 size={14} className="md:w-4 md:h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToDelete(product.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 md:p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors active:scale-95"
                            title="Delete Product"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <p className="text-sm">No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-gray-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 md:p-6 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mt-auto sm:mt-0">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {saveError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100">
                  {saveError}
                </div>
              )}
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Name</label>
                <input 
                  type="text" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                  placeholder="e.g. Royal Agbada"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      setProductForm({
                        ...productForm, 
                        category: newCategory,
                        subcategory: '' // Reset subcategory when category changes
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Subcategory</label>
                  <select 
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="">None</option>
                    {categories.find(c => c.name === productForm.category)?.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Price</label>
                  <div className="flex gap-2">
                    <select
                      value={productForm.currency}
                      onChange={(e) => setProductForm({...productForm, currency: e.target.value})}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-2.5 md:py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <input 
                      type="number" 
                      step="any"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
                  <input 
                    type="number" 
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Images</label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-primary">
                        <Upload size={20} />
                        <span className="text-xs md:text-sm font-medium">Upload images</span>
                      </div>
                    </label>
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                      placeholder="Or enter image URL..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (productForm.image) {
                          setProductForm(prev => ({
                            ...prev,
                            images: [...prev.images, prev.image],
                            image: ''
                          }));
                        }
                      }}
                      disabled={!productForm.image}
                      className="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs md:text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {productForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2 md:gap-3">
                    {productForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] md:text-[10px] py-1 text-center font-bold uppercase tracking-wider">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400 min-h-[80px] md:min-h-[100px]"
                  placeholder="Enter product description..."
                />
              </div>
              
              <div className="pt-2 md:pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 md:py-3 border border-gray-200 rounded-xl font-medium text-sm md:text-base text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className={`flex-1 py-2.5 md:py-3 bg-[#f20c92] text-white rounded-xl font-medium text-sm md:text-base shadow-md transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d90a82]'}`}
                >
                  {isUploading ? 'Uploading...' : (editingId ? 'Save' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      <CategoryManagerModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={async () => {
          if (productToDelete) {
            try {
              await deleteProduct(productToDelete);
              showToast('Product deleted successfully.', 'success');
            } catch (error) {
              console.error('Error deleting product:', error);
              showToast('Failed to delete product.', 'error');
            }
          }
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                : 'bg-red-500/90 border-red-400 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
