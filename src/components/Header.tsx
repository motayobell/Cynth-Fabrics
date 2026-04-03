import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Our Story', path: '/story' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black border-b border-brand-pink/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        {/* Left Navigation (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/collections" className="text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Collections</Link>
          <Link to="/" className="text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Home</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-stone-300 hover:text-brand-pink p-2"
          >
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="h-10 md:h-14 w-auto transition-transform group-hover:scale-105 duration-300">
               <img 
                 src="/logo.png" 
                 alt="Cynth Fabrics" 
                 className="w-full h-full object-contain"
               />
             </div>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link to="/story" className="hidden md:block text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Our Story</Link>
          <Link to="/contact" className="hidden md:block text-xs uppercase tracking-widest text-brand-pink hover:text-white transition-colors font-bold">Contact</Link>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="text-stone-300 hover:text-brand-pink transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-stone-300 hover:text-brand-pink transition-colors relative p-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-brand-pink text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-black z-50 md:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <img src="/logo.png" alt="Cynth Fabrics" className="h-10 w-auto object-contain" />
                <button onClick={toggleMenu} className="text-stone-300 hover:text-brand-pink">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMenu}
                    className="text-lg uppercase tracking-[0.2em] text-stone-300 hover:text-brand-pink transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-brand-pink/20">
                <p className="text-stone-500 text-xs uppercase tracking-widest mb-4">Follow Us</p>
                <div className="flex space-x-6">
                  <a href="#" className="text-stone-300 hover:text-brand-pink transition-colors text-sm">Instagram</a>
                  <a href="#" className="text-stone-300 hover:text-brand-pink transition-colors text-sm">Facebook</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
