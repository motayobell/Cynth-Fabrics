import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black border-b border-brand-pink/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/collections" className="text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Collections</Link>
          <Link to="/" className="text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Home</Link>
        </div>

        {/* Mobile Menu Button (Visible on small screens) */}
        <div className="md:hidden">
          <button className="text-stone-300 hover:text-brand-pink">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2 group">
             {/* Image Logo */}
             <div className="h-14 w-auto transition-transform group-hover:scale-105 duration-300">
               <img 
                 src="https://lh3.googleusercontent.com/d/1b3Vq6YHV6GABHAnwCNW07JW1hrTNnlYZ" 
                 alt="Cynth Fabrics" 
                 className="w-full h-full object-contain"
                 referrerPolicy="no-referrer"
               />
             </div>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/story" className="hidden md:block text-xs uppercase tracking-widest text-stone-300 hover:text-brand-pink transition-colors font-medium">Our Story</Link>
          <Link to="/contact" className="hidden md:block text-xs uppercase tracking-widest text-brand-pink hover:text-white transition-colors font-bold">Contact</Link>
          <div className="flex items-center space-x-4">
            <button className="text-stone-300 hover:text-brand-pink transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-stone-300 hover:text-brand-pink transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
