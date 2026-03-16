import React from 'react';
import { Globe, Gem, Layers } from 'lucide-react';

export function TrustBar() {
  return (
    <section className="py-16 bg-[#1a0c15] border-y border-brand-pink/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Item 1 */}
          <div className="space-y-3 flex flex-col items-center">
            <Globe className="text-brand-pink w-10 h-10 mb-2" strokeWidth={1.5} />
            <h3 className="uppercase tracking-widest text-sm font-bold text-stone-100">Worldwide Shipping</h3>
            <p className="text-stone-400 text-sm">Direct to your door, anywhere in the world.</p>
          </div>
          
          {/* Item 2 */}
          <div className="space-y-3 flex flex-col items-center">
            <Gem className="text-brand-pink w-10 h-10 mb-2" strokeWidth={1.5} />
            <h3 className="uppercase tracking-widest text-sm font-bold text-stone-100">Authentic Craftsmanship</h3>
            <p className="text-stone-400 text-sm">Hand-woven detailing by master Nigerian artisans.</p>
          </div>
          
          {/* Item 3 */}
          <div className="space-y-3 flex flex-col items-center">
            <Layers className="text-brand-pink w-10 h-10 mb-2" strokeWidth={1.5} />
            <h3 className="uppercase tracking-widest text-sm font-bold text-stone-100">Premium Fabrics</h3>
            <p className="text-stone-400 text-sm">Guaranteed luxury cottons and bespoke silks.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
