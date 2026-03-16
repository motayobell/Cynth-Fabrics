import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { PRODUCT_CATEGORIES } from '../constants';

export default function Shop() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 pt-32">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-32">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8">Collections</h2>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="flex items-center justify-between group w-full text-left"
              >
                <span className={`text-lg font-light transition-colors ${!selectedCategory ? 'text-brand-pink font-medium' : 'group-hover:text-brand-pink'}`}>All Pieces</span>
                <span className="text-[10px] bg-brand-pink text-white px-2 py-0.5 rounded-full font-bold">{products.length}</span>
              </button>
            </li>
            <li className="h-px bg-stone-200 my-4"></li>
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category}>
                <button 
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center justify-between group w-full text-left"
                >
                  <span className={`text-lg font-light transition-colors ${selectedCategory === category ? 'text-brand-pink font-medium' : 'group-hover:text-brand-pink'}`}>{category}</span>
                  <ChevronRight className={`w-4 h-4 transition-colors ${selectedCategory === category ? 'text-brand-pink' : 'text-stone-300 group-hover:text-brand-pink'}`} />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-16 p-6 bg-stone-100 rounded-xl border border-stone-200">
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
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-4xl font-light tracking-tight text-deep-brown">
            The <span className="font-bold">{selectedCategory || 'Full'}</span> Collection
          </h1>
          <div className="flex gap-4">
            <button className="text-xs font-bold uppercase border-b-2 border-deep-brown pb-1">Sort by: Newest</button>
            <button className="text-xs font-bold uppercase border-b-2 border-transparent hover:border-stone-400 pb-1 text-stone-500">Filter</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden bg-stone-100 rounded-lg aspect-[3/4] mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {product.tag && (
                  <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full ${product.tagColor}`}>
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 px-1">
                <h3 className="text-lg font-medium tracking-tight text-deep-brown">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  {product.price !== undefined && product.price !== null ? (
                    <span className="text-brand-pink font-bold">
                      {getCurrencySymbol(product.currency)}{product.price.toLocaleString()}
                    </span>
                  ) : (
                    <>
                      <span className="text-brand-pink font-bold">{product.priceGBP}</span>
                      <span className="text-stone-400 text-sm">/</span>
                      <span className="text-stone-500 font-medium">{product.priceUSD}</span>
                    </>
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
