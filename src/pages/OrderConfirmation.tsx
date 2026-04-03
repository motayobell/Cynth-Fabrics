import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  return (
    <div className="bg-[#f8f5f8] text-slate-800 font-sans min-h-screen flex flex-col">
      <header className="w-full py-4 md:py-6 px-6 md:px-8 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="text-lg md:text-xl font-serif italic font-bold tracking-widest bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] bg-clip-text text-transparent">
            CYNTH
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="mb-8 md:mb-12 max-w-[200px] md:max-w-md animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <img 
            alt="Cynth Fabrics Logo" 
            className="w-full h-auto drop-shadow-2xl" 
            src="https://lh3.googleusercontent.com/d/1b3Vq6YHV6GABHAnwCNW07JW1hrTNnlYZ"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h1 className="text-4xl md:text-7xl font-serif italic font-bold bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] bg-clip-text text-transparent">
              Thank You
            </h1>
            <div className="h-0.5 w-16 md:w-24 bg-[#D4AF37] mx-auto opacity-50"></div>
          </div>

          <div className="space-y-4 md:space-y-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-lg md:text-2xl font-light text-slate-600">
              Your enquiry has been received.
            </p>
            
            <div className="bg-white/50 p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
              <div className="flex flex-col items-center space-y-3 md:space-y-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/10 text-green-500 mb-1 md:mb-2">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <p className="text-base md:text-xl font-normal text-slate-800 max-w-md leading-relaxed">
                  A dedicated styling representative will contact you via <span className="font-bold">WhatsApp</span> shortly to finalize your custom order details.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Link 
              to="/"
              className="inline-flex items-center justify-center w-full md:w-auto px-10 py-4 bg-[#f20df2] text-white font-semibold rounded-md shadow-lg shadow-[#f20df2]/20 hover:bg-[#f20df2]/90 hover:-translate-y-0.5 transition-all duration-300 text-base md:text-lg uppercase tracking-widest"
            >
              Return to Home
            </Link>
            <p className="mt-6 md:mt-8 text-[10px] md:text-sm text-slate-400 font-medium uppercase tracking-widest">
              ORDER REFERENCE: #CF-2941-2024
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 md:py-12 px-6 md:px-8 border-t border-slate-200 flex flex-col items-center space-y-6 opacity-60">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs md:text-sm font-medium tracking-wide text-slate-600">
          <Link to="/shop" className="hover:text-[#f20df2] transition-colors">OUR FABRICS</Link>
          <Link to="/collections" className="hover:text-[#f20df2] transition-colors">COLLECTIONS</Link>
          <Link to="/contact" className="hover:text-[#f20df2] transition-colors">CONTACT</Link>
        </div>
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 text-center">
          © {new Date().getFullYear()} CYNTH FABRICS. EXQUISITE NIGERIAN FASHION.
        </p>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
