import React from 'react';

export function Newsletter() {
  return (
    <section className="py-24 bg-[#FCE4EC] border-t border-brand-pink/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-6 text-deep-brown">Join the Heritage Circle</h2>
        <p className="text-stone-500 mb-10 max-w-xl mx-auto">
          Subscribe to receive exclusive access to our private collection drops, style guides, and cultural stories.
        </p>
        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow bg-white border border-stone-300 px-6 py-4 focus:ring-brand-pink focus:border-brand-pink outline-none transition-all"
          />
          <button 
            type="submit" 
            className="bg-[#D81B60] text-white px-12 py-4 font-bold uppercase tracking-widest hover:bg-deep-brown transition-all text-sm"
          >
            Join Now
          </button>
        </form>
      </div>
    </section>
  );
}
