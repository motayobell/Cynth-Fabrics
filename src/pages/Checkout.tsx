import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Ruler, ShoppingBag, ShieldCheck, MessageCircle, CreditCard, Wallet, Banknote, Globe, Mail, Share2, CheckCircle } from 'lucide-react';
import { useProducts, Product } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  { name: 'Nigeria', code: '+234' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'Canada', code: '+1' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'South Africa', code: '+27' },
  { name: 'Ghana', code: '+233' },
];

export default function Checkout() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addOrder } = useOrders();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    customizations: ''
  });

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Get selected options from navigation state
  const { size, quantity, image } = location.state || {};
  const orderQuantity = quantity || 1;

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [id, products]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = COUNTRIES.find(c => c.name === e.target.value);
    if (country) {
      setSelectedCountry(country);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const displayPrice = product.price 
      ? `${getCurrencySymbol(product.currency)}${product.price.toLocaleString()}` 
      : product.priceUSD;

    try {
      await addOrder({
        customerName: formData.fullName,
        contact: {
          email: formData.email,
          phone: `${selectedCountry.code} ${formData.phone}`
        },
        location: {
          country: selectedCountry.name,
          code: selectedCountry.code === '+234' ? 'NG' : 
                selectedCountry.code === '+44' ? 'UK' : 
                selectedCountry.code === '+1' ? 'US' : 'INT'
        },
        product: {
          name: product.name,
          image: image || product.image,
          price: displayPrice,
          quantity: orderQuantity
        },
        size: size || 'Standard',
        customizations: formData.customizations
      });

      navigate('/order-confirmation');
    } catch (error) {
      console.error("Failed to submit order:", error);
      showToast('Failed to submit order. Please try again.', 'error');
    }
  };

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-20">Loading...</div>;
  }

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case 'GBP': return '£';
      case 'NGN': return '₦';
      case 'EUR': return '€';
      default: return '$';
    }
  };

  const displayPrice = product.price 
    ? `${getCurrencySymbol(product.currency)}${product.price.toLocaleString()}` 
    : product.priceUSD;

  // Calculate total price if numeric price is available
  const totalPrice = product.price 
    ? `${getCurrencySymbol(product.currency)}${(product.price * orderQuantity).toLocaleString()}`
    : product.priceUSD; // Fallback for string prices

  return (
    <div className="bg-cream min-h-screen pt-20 md:pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        {/* Hero Title Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-3 md:mb-4 text-deep-brown">Order Request</h2>
          <p className="text-stone-500 text-base md:text-lg max-w-2xl font-sans">
            Luxury Nigerian Fashion — Finalize your bespoke custom order details below. Our artisans are ready to bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <User className="text-brand-pink w-5 h-5 md:w-6 md:h-6" />
                <h3 className="text-xl md:text-2xl font-serif font-bold text-deep-brown">Your Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold mb-1.5 md:mb-2 font-sans text-deep-brown">Full Name</label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all font-sans text-sm md:text-base" 
                    placeholder="e.g. Adewale Johnson" 
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold mb-1.5 md:mb-2 font-sans text-deep-brown">Email Address</label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all font-sans text-sm md:text-base" 
                    placeholder="email@example.com" 
                    type="email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold mb-1.5 md:mb-2 font-sans text-deep-brown">WhatsApp Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 md:px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-stone-500 text-xs md:text-sm font-sans min-w-[3.5rem] md:min-w-[4.5rem] justify-center">
                      {selectedCountry.code}
                    </span>
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-stone-200 rounded-r-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all font-sans text-sm md:text-base" 
                      placeholder="803 000 0000" 
                      type="tel"
                      required
                    />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold mb-1.5 md:mb-2 font-sans text-deep-brown">Country</label>
                  <select 
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all appearance-none font-sans text-sm md:text-base"
                    value={selectedCountry.name}
                    onChange={handleCountryChange}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Ruler className="text-brand-pink w-5 h-5 md:w-6 md:h-6" />
                <h3 className="text-xl md:text-2xl font-serif font-bold text-deep-brown">Customizations</h3>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold mb-1.5 md:mb-2 font-sans text-deep-brown">Custom Measurements or Message</label>
                <textarea 
                  name="customizations"
                  value={formData.customizations}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 md:py-4 focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none transition-all resize-none font-sans text-sm md:text-base" 
                  placeholder="Include your height, chest, waist, or specific design requests here..." 
                  rows={5}
                ></textarea>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-brand-pink/5 backdrop-blur-sm border border-brand-pink/10 p-6 md:p-8 rounded-2xl lg:sticky lg:top-32">
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 border-b border-brand-pink/10 pb-4 text-deep-brown">Order Summary</h3>
              
              <div className="flex gap-4 mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shrink-0 border border-brand-pink/10">
                  <img 
                    src={image || product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-serif font-bold text-base md:text-lg text-deep-brown leading-tight">{product.name}</h4>
                  <p className="text-stone-500 text-xs md:text-sm font-sans mt-1 line-clamp-2">{product.description || "Hand-embroidered Swiss Lace"}</p>
                  <p className="text-brand-pink font-bold mt-1 font-sans text-sm md:text-base">{displayPrice}</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 font-sans">
                {size && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-stone-500">Size</span>
                    <span className="font-semibold text-deep-brown">{size}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-stone-500">Quantity</span>
                  <span className="font-semibold text-deep-brown">{orderQuantity}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-semibold text-deep-brown">{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className="text-gold font-medium">Calculated later</span>
                </div>
                <div className="pt-4 border-t border-brand-pink/10 flex justify-between items-end">
                  <span className="font-bold text-base md:text-lg text-deep-brown">Total</span>
                  <div className="text-right">
                    <p className="text-xl md:text-2xl font-black text-brand-pink">{totalPrice}</p>
                    <p className="text-[10px] md:text-xs text-stone-500">Excluding delivery</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-pink/10 border border-brand-pink/20 rounded-xl p-4 mb-6 md:mb-8 flex gap-3">
                <ShieldCheck className="text-brand-pink w-5 h-5 md:w-6 md:h-6 shrink-0" />
                <div>
                  <p className="text-xs md:text-sm font-bold text-brand-pink font-sans">Manual Availability Check</p>
                  <p className="text-[10px] md:text-xs text-stone-500 mt-1 font-sans">Our fabrics are exclusive. We manually verify stock before taking payment.</p>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="block w-full text-center bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-4 md:py-5 rounded-xl text-base md:text-lg uppercase tracking-wider shadow-lg shadow-brand-pink/20 transition-all active:scale-[0.98] font-sans"
              >
                Request Order
              </button>

              <div className="mt-6 flex gap-3 items-start">
                <MessageCircle className="text-gold w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <p className="text-xs md:text-sm font-medium text-gold/90 italic leading-relaxed font-sans">
                  Our team will contact you via WhatsApp within 24 hours to confirm availability and payment details.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 md:gap-6 grayscale opacity-50">
              <Banknote className="w-6 h-6 md:w-8 md:h-8 text-deep-brown" />
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-deep-brown" />
              <Wallet className="w-6 h-6 md:w-8 md:h-8 text-deep-brown" />
            </div>
          </div>
        </div>
      </main>

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
            {toast.type === 'success' ? <CheckCircle size={18} /> : <ShieldCheck size={18} />}
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
