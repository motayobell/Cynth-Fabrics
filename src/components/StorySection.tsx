import React from 'react';
import { Link } from 'react-router-dom';

export function StorySection() {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-6 -left-6 w-full h-full border-t-2 border-l-2 border-brand-pink z-0"></div>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeBhEn-EOzB9gmZQPNqkQVzZ-xNnW6TAb2s989SZBLmldrHJ2Al1OPQx7yVcUOyxWuimxTuX9zgTmQ25ZLSjZ_bYo29APMCNb84aAQ1jX_dFYTwZkWmZ9e42fFAfQgD_uftCqmQKpsLnacIpxyUUXikUv21Zu_1fl0J4hDsNRudMwZfbEX0SaervB1rT33TRCNbx-e_LMLIU_GyMcMr9ZH5dPT_lyXchylZneklp6Lt0ZyWoW2UkBSAYpRVKeRCg_RBE5quvdo6Ww" 
              alt="Sustainable Materials" 
              className="rounded-sm shadow-xl relative z-10 w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-brand-pink z-20"></div>
          </div>

          {/* Text Side */}
          <div className="lg:w-1/2 space-y-8">
            <span className="text-brand-pink font-bold uppercase tracking-[0.4em] text-xs">Our Heritage</span>
            <h2 className="font-serif text-4xl md:text-5xl text-deep-brown leading-tight">Tradition Reimagined for the Modern World</h2>
            <p className="text-stone-600 text-lg leading-relaxed font-light">
              Founded in the heart of Lagos and refined for the global stage, Cynth Fabrics is more than a fashion label. We are a bridge between generations. Each piece we create is a love letter to Nigerian craftsmanship, utilizing techniques passed down through centuries to dress the visionaries of today.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed font-light">
              We source only the finest fabrics—from authentic Aso-Oke to premium Italian silks—ensuring that when you wear Cynth Fabrics, you carry the weight of tradition with the comfort of modern luxury.
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center space-x-4 group">
                <span className="w-12 h-[1px] bg-brand-pink group-hover:w-20 transition-all duration-300"></span>
                <span className="uppercase tracking-widest text-sm font-bold text-brand-pink">Discover Our Process</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
