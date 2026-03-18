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
  X,
  Upload
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { PRODUCT_CATEGORIES } from '../constants';
import { useProducts, Product } from '../context/ProductContext';

const compressImage = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      
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
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
      callback(dataUrl);
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(PRODUCT_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Agbada',
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          if (file.type.startsWith('image/')) {
            compressImage(file, (base64) => {
              resolve(base64);
            });
          } else {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
        });
      });

      Promise.all(uploadPromises).then(urls => {
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
    
    // Include the pending image URL if the user typed one but didn't click "Add"
    const finalImages = [...productForm.images];
    if (productForm.image && !finalImages.includes(productForm.image)) {
      finalImages.push(productForm.image);
    }

    // Use the first image from the array as the main image, or fallback to the single image field if array is empty
    const mainImage = finalImages.length > 0 ? finalImages[0] : 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=2787&auto=format&fit=crop';

    const existingProduct = editingId ? products.find(p => String(p.id) === String(editingId)) : null;

    const productData: Product = {
      ...(existingProduct || {}),
      id: editingId || Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
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
      } else {
        await addProduct(productData);
      }
      
      setIsModalOpen(false);
      setProductForm({ 
        name: '', 
        category: categories[0] || 'Agbada', 
        price: '0', 
        currency: 'USD',
        stock: '0', 
        image: '', 
        images: [],
        description: '' 
      });
    } catch (error) {
      console.error('Error saving product:', error);
      setSaveError('Failed to save product. Please try again.');
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
      category: product.category || 'Agbada',
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    // In a real app, use a custom modal. For this demo, we'll just delete it directly
    // since window.confirm is blocked in the iframe.
    setCategories(categories.filter(c => c !== category));
  };

  const openNewProductModal = () => {
    setEditingId(null);
    setProductForm({ 
      name: '', 
      category: categories[0] || 'Agbada', 
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

      <main className="md:ml-64 min-h-screen bg-gray-50 relative">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-xl font-serif text-gray-900">Products</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <button 
              onClick={openNewProductModal}
              className="bg-[#f20c92] hover:bg-[#d90a82] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Plus size={18} />
              New Product
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">Inventory</h1>
              <p className="text-gray-500 text-sm">Manage your product catalog and stock levels.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Filter size={18} />
                Manage Categories
              </button>
              <button 
                onClick={openNewProductModal}
                className="bg-[#f20c92] hover:bg-[#d90a82] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md md:hidden"
              >
                <Plus size={18} />
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Package size={24} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Total Products</p>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">{products.length}</h3>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <AlertCircle size={24} />
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Action Needed</span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Low Stock Items</p>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                {products.filter(p => (p.stock || 0) < 5 && (p.stock || 0) > 0).length}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                  <Filter size={24} />
                </div>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">Categories</p>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                {categories.length}
              </h3>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.category || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {product.price !== undefined && product.price !== null ? `${getCurrencySymbol(product.currency)}${product.price.toLocaleString()}` : (product.priceUSD || product.priceGBP || 'N/A')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.stock || 0} units</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status || 'In Stock')}`}>
                        {product.status || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleEditProduct(product, e)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteProduct(product.id, e)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <p>No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {saveError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                  {saveError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Name</label>
                <input 
                  type="text" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                  placeholder="e.g. Royal Agbada"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Price</label>
                  <div className="flex gap-2">
                    <select
                      value={productForm.currency}
                      onChange={(e) => setProductForm({...productForm, currency: e.target.value})}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none text-sm"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Stock</label>
                  <input 
                    type="number" 
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Product Images</label>
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
                        <span className="text-sm font-medium">Upload images (Front, Back, Side...)</span>
                      </div>
                    </label>
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400"
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
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {productForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {productForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center font-bold uppercase tracking-wider">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-400 min-h-[100px]"
                  placeholder="Enter product description..."
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className={`flex-1 py-3 bg-[#f20c92] text-white rounded-xl font-medium shadow-md transition-all w-full sm:w-auto ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d90a82]'}`}
                >
                  {isUploading ? 'Uploading...' : (editingId ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900">Manage Categories</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newCategory}
                  className="bg-[#f20c92] hover:bg-[#d90a82] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all"
                >
                  Add
                </button>
              </form>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Existing Categories</h4>
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                  <span className="text-gray-700 font-medium">{category}</span>
                  <button 
                    onClick={() => handleDeleteCategory(category)}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
