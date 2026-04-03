import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

export default function Shop() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 md:gap-12 pt-24 md:pt-32">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="md:sticky md:top-32">
          <h2 className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8">Collections</h2>
          
          {/* Mobile Categories (Horizontal Scroll) */}
          <div className="md:hidden flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4">
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              className={`flex-shrink-0 px-6 py-2 rounded-full border text-sm font-medium transition-all ${!selectedCategory ? 'bg-brand-pink border-brand-pink text-white' : 'border-stone-200 text-stone-600'}`}
            >
              All Pieces
            </button>
            {categories.map((category) => (
              <button 
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedSubcategory(null);
                }}
                className={`flex-shrink-0 px-6 py-2 rounded-full border text-sm font-medium transition-all ${selectedCategory === category.name ? 'bg-brand-pink border-brand-pink text-white' : 'border-stone-200 text-stone-600'}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Desktop Categories (Vertical List) */}
          <ul className="hidden md:block space-y-4">
            <li>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                className="flex items-center justify-between group w-full text-left"
              >
                <span className={`text-lg font-light transition-colors ${!selectedCategory ? 'text-brand-pink font-medium' : 'group-hover:text-brand-pink'}`}>All Pieces</span>
                <span className="text-[10px] bg-brand-pink text-white px-2 py-0.5 rounded-full font-bold">{products.length}</span>
              </button>
            </li>
            <li className="h-px bg-stone-200 my-4"></li>
            {categories.map((category) => (
              <li key={category.id} className="space-y-2">
                <button 
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setSelectedSubcategory(null);
                  }}
                  className="flex items-center justify-between group w-full text-left"
                >
                  <span className={`text-lg font-light transition-colors ${selectedCategory === category.name ? 'text-brand-pink font-medium' : 'group-hover:text-brand-pink'}`}>{category.name}</span>
                  <ChevronRight className={`w-4 h-4 transition-colors ${selectedCategory === category.name ? 'text-brand-pink' : 'text-stone-300 group-hover:text-brand-pink'}`} />
                </button>
                {selectedCategory === category.name && category.subcategories.length > 0 && (
                  <ul className="pl-4 space-y-2 mt-2 border-l-2 border-stone-100">
                    {category.subcategories.map(sub => (
                      <li key={sub.id}>
                        <button
                          onClick={() => setSelectedSubcategory(sub.name)}
                          className={`text-sm font-light transition-colors w-full text-left ${selectedSubcategory === sub.name ? 'text-brand-pink font-medium' : 'text-stone-500 hover:text-brand-pink'}`}
                        >
                          {sub.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Subcategories for Mobile (Visible when category selected) */}
          {selectedCategory && categories.find(c => c.name === selectedCategory)?.subcategories.length! > 0 && (
            <div className="md:hidden flex overflow-x-auto pb-4 gap-3 mt-2 no-scrollbar -mx-4 px-4">
              {categories.find(c => c.name === selectedCategory)?.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.name)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${selectedSubcategory === sub.name ? 'bg-stone-800 border-stone-800 text-white' : 'border-stone-200 text-stone-500'}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          <div className="hidden md:block mt-16 p-6 bg-stone-100 rounded-xl border border-stone-200">
            <p className="text-xs leading-relaxed text-stone-500 italic">
              "Crafting identity for the global Nigerian. Every stitch tells a story of heritage and prestige."
            </p>
            <div className="mt-4 flex gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-pink"></div>
              <div className="w-1 h-1 rounded-full bg-brand-pink/40"></div>
              <div className="w-1 h-1 rounded-full bg-brand-pink/40"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <section className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 md:mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-deep-brown">
            The <span className="font-bold">{selectedSubcategory || selectedCategory || 'Full'}</span> Collection
          </h1>
          <div className="flex gap-4">
            <button className="text-[10px] md:text-xs font-bold uppercase border-b-2 border-deep-brown pb-1">Sort by: Newest</button>
            <button className="text-[10px] md:text-xs font-bold uppercase border-b-2 border-transparent hover:border-stone-400 pb-1 text-stone-500">Filter</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-12 gap-x-4 md:gap-x-8">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-stone-100 rounded-lg aspect-[3/4] mb-4 md:mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {product.tag && (
                  <span className={`absolute top-2 left-2 md:top-4 md:left-4 text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 uppercase tracking-widest rounded-full ${product.tagColor}`}>
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 md:gap-1 px-1">
                <h3 className="text-sm md:text-lg font-medium tracking-tight text-deep-brown line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 md:gap-3 mt-0.5 md:mt-1">
                  {product.price !== undefined && product.price !== null ? (
                    <span className="text-brand-pink font-bold text-sm md:text-base">
                      {getCurrencySymbol(product.currency)}{product.price.toLocaleString()}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-brand-pink font-bold text-sm md:text-base">{product.priceGBP}</span>
                      <span className="text-stone-400 text-[10px] md:text-sm">/</span>
                      <span className="text-stone-500 font-medium text-xs md:text-sm">{product.priceUSD}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-500">
              <p>No products found in this collection.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 hover:border-brand-pink transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-pink text-white font-bold">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">2</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">3</button>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full border border-stone-200 hover:border-brand-pink transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
