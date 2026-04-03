import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-cream pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center sm:text-left">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center sm:items-start">
            <Link to="/" className="flex items-center gap-2 mb-6">
               <img 
                 src="/logo.png" 
                 alt="Cynth Fabrics" 
                 className="h-12 md:h-16 w-auto object-contain"
               />
            </Link>
            <p className="text-cream/80 text-sm leading-relaxed max-w-xs">
              Premium Nigerian native wears tailored for excellence. Crafted at home, worn across the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-6">Explore</h3>
            <ul className="space-y-3 md:space-y-4 text-sm">
              <li><Link to="/shop" className="hover:text-gold transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-serif text-lg text-gold mb-6">Customer Care</h3>
            <ul className="space-y-3 md:space-y-4 text-sm">
              <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-serif text-lg text-gold mb-6">Connect</h3>
            <ul className="space-y-3 md:space-y-4 text-sm">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3">
                <span className="text-cream/60">Email:</span>
                <a href="mailto:hello@cynthfabrics.com" className="hover:text-gold transition-colors">hello@cynthfabrics.com</a>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3">
                <span className="text-cream/60">Social:</span>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-gold transition-colors">Instagram</a>
                  <a href="#" className="hover:text-gold transition-colors">Twitter</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-cream/60 relative">
          <p>&copy; {new Date().getFullYear()} Cynth Fabrics. All rights reserved.</p>
          <Link 
            to="/admin/login" 
            className="absolute right-0 bottom-0 p-2 opacity-0 hover:opacity-30 transition-opacity text-white"
            title="Admin Login"
          >
            <Lock size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
