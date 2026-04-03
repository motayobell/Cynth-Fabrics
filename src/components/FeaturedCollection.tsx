import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export function FeaturedCollection() {
  const { products } = useProducts();
  
  // Use the first 4 products for the featured collection
  // Since new products are added to the top, this will show the latest products
  const featuredProducts = products.slice(0, 4);

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-brand-pink font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2 block">Curated Excellence</span>
            <h2 className="font-serif text-3xl md:text-5xl text-deep-brown">Featured Collection</h2>
          </div>
          <Link to="/shop" className="mt-4 md:mt-0 inline-flex items-center justify-center text-brand-pink uppercase tracking-widest font-bold border-b-2 border-brand-pink pb-1 hover:text-deep-brown hover:border-deep-brown transition-all text-xs md:text-sm">
            View All Collections <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featuredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 rounded mb-3 md:mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-deep-brown/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-6">
                  <button className="w-full bg-white text-black py-2 md:py-3 rounded font-bold uppercase tracking-widest text-[10px] md:text-xs shadow-xl hover:bg-brand-pink hover:text-white transition-colors">
                    Quick Shop
                  </button>
                </div>
              </div>
              <h4 className="font-serif text-base md:text-xl mb-0.5 md:mb-1 text-deep-brown truncate">{product.name}</h4>
              <p className="text-stone-500 text-xs md:text-sm font-medium">
                {product.price !== undefined && product.price !== null ? (
                  <span>{getCurrencySymbol(product.currency)}{product.price.toLocaleString()}</span>
                ) : (
                  product.priceUSD
                )}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
