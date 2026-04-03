import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, Heart, ArrowRight, Ruler, Globe, CheckCircle, Scissors, Truck } from 'lucide-react';
import { useProducts, Product } from '../context/ProductContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);
      }
    }
  }, [id, products]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  }

  // Filter out the current product from related products
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const displayPrice = product.price !== undefined && product.price !== null
    ? `${getCurrencySymbol(product.currency)}${product.price.toLocaleString()}` 
    : product.priceUSD;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="bg-background-light pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400">
        <Link to="/" className="hover:text-brand-pink">Home</Link> / 
        <Link to="/collections" className="hover:text-brand-pink mx-1">Collections</Link> / 
        <span className="text-stone-600 mx-1">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          {/* Product Images */}
          <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto md:w-20 flex-shrink-0 no-scrollbar">
              {productImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 md:w-full aspect-square bg-stone-100 rounded cursor-pointer overflow-hidden flex-shrink-0 transition-all ${selectedImage === img ? 'ring-2 ring-brand-pink' : 'hover:ring-1 hover:ring-brand-pink'}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${i}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-grow relative bg-stone-100 rounded-lg overflow-hidden aspect-[4/5]">
              <img 
                src={selectedImage || product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-brand-pink transition-colors">
                  <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-brand-pink transition-colors">
                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-2/5 pt-0 md:pt-4">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-deep-brown mb-3 md:mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <span className="text-xl md:text-2xl text-brand-pink font-medium">{displayPrice}</span>
              {product.tag && (
                <span className={`text-[8px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${product.tagColor ? product.tagColor.replace('bg-white', 'bg-brand-pink/10').replace('text-black', 'text-brand-pink') : 'bg-brand-pink/10 text-brand-pink'}`}>
                  {product.tag}
                </span>
              )}
            </div>

            <p className="text-stone-500 text-sm leading-relaxed mb-6 md:mb-8 font-light">
              {product.description || "Meticulously crafted for the modern visionary, this set blends traditional Nigerian silhouettes with world-class craftsmanship. Made from ultra-fine materials, it features hidden placket detailing and hand-finished embroidery."}
            </p>

            {/* Size Selector */}
            <div className="mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-deep-brown">Select Size</span>
                <button className="text-[10px] text-brand-pink uppercase tracking-widest font-bold hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 border text-xs font-medium transition-all ${
                      selectedSize === size 
                        ? 'border-brand-pink text-brand-pink bg-brand-pink/5' 
                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 md:mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-deep-brown mb-3 block">Quantity</span>
              <div className="flex items-center border border-stone-200 rounded w-max">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
                >
                  -
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-medium text-deep-brown border-x border-stone-200">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Button */}
            <Link 
              to={`/checkout/${product.id}`} 
              state={{ 
                size: selectedSize, 
                quantity: quantity,
                image: selectedImage || product.image
              }}
              className="w-full bg-brand-pink text-white py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-deep-brown transition-all flex items-center justify-center gap-2 mb-4 shadow-lg shadow-brand-pink/20"
            >
              Order Now <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest mb-8 md:mb-10">Global Delivery in 7-14 Business Days</p>

            {/* Accordions / Features */}
            <div className="border-t border-stone-200">
              <div className="py-4 border-b border-stone-200 flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-widest text-deep-brown group-hover:text-brand-pink transition-colors">Tailored Fit Guide</span>
                </div>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </div>
              <div className="py-4 border-b border-stone-200 flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-brand-pink" />
                  <span className="text-xs font-bold uppercase tracking-widest text-deep-brown group-hover:text-brand-pink transition-colors">Worldwide Shipping</span>
                </div>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 md:mt-10 pt-8 border-t border-stone-100">
              <div className="flex flex-col items-center text-center gap-2">
                <CheckCircle className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Authentic Wool</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Scissors className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Hand Crafted</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-stone-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-brand-pink font-bold uppercase tracking-widest text-xs mb-2 block">Curation</span>
              <h2 className="font-serif text-3xl md:text-4xl text-deep-brown">You May Also Like</h2>
            </div>
            <Link to="/collections" className="text-xs font-bold uppercase tracking-widest border-b border-deep-brown pb-1 hover:text-brand-pink hover:border-brand-pink transition-all">View Collection</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group cursor-pointer">
                <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-deep-brown mb-1">{relatedProduct.name}</h3>
                <p className="text-brand-pink text-sm font-medium">
                  {relatedProduct.price 
                    ? `${getCurrencySymbol(relatedProduct.currency)}${relatedProduct.price.toLocaleString()}` 
                    : relatedProduct.priceUSD}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
