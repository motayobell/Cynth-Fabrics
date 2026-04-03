import React from 'react';
import { ArrowRight, Send, Instagram, MapPin, Mail, Phone, Sparkles } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-16 md:pt-20 min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Content */}
      <div className="w-full lg:w-1/2 bg-stone-50 p-6 md:p-16 lg:p-24 relative overflow-hidden flex flex-col justify-center">
        {/* Background Watermark (simulated with text/opacity) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <span className="text-7xl md:text-9xl font-serif font-black whitespace-nowrap">Natural Safe Work</span>
        </div>

        <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
          <h4 className="text-brand-pink tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase mb-4 md:mb-6">Connect with Oma</h4>
          
          <h1 className="text-4xl md:text-7xl font-serif font-black text-deep-brown mb-6 md:mb-8 leading-tight">
            Get in <span className="text-brand-pink">Touch</span>
          </h1>
          
          <p className="text-stone-500 text-base md:text-lg mb-8 md:mb-12 font-sans leading-relaxed max-w-md">
            Bridging heritage and contemporary luxury. Whether it's a sizing query or a custom commission, our artisans are here to assist you.
          </p>

          {/* Bespoke Card */}
          <div className="bg-brand-pink/5 border border-brand-pink/10 p-6 md:p-8 rounded-2xl mb-12 md:mb-16 relative overflow-hidden group hover:border-brand-pink/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-brand-pink/10 rounded-lg text-brand-pink shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-deep-brown mb-2">Bespoke Tailoring</h3>
                <p className="text-stone-500 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                  Experience the ultimate in Nigerian craftsmanship. We offer worldwide virtual consultations for custom bridal and gala wear.
                </p>
                <a href="/" className="inline-flex items-center text-[10px] font-bold text-brand-pink uppercase tracking-widest hover:gap-3 transition-all gap-2">
                  Start a Commission <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12">
            <div>
              <h5 className="text-brand-pink text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">WhatsApp</h5>
              <p className="text-deep-brown font-serif text-base md:text-lg">+234 800 OMA HERITAGE</p>
            </div>
            <div>
              <h5 className="text-brand-pink text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Email</h5>
              <p className="text-deep-brown font-serif text-base md:text-lg break-all">concierge@omaheritage.com</p>
            </div>
            <div>
              <h5 className="text-brand-pink text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Instagram</h5>
              <p className="text-deep-brown font-serif text-base md:text-lg">@omaheritage_official</p>
            </div>
            <div>
              <h5 className="text-brand-pink text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2">Studio</h5>
              <p className="text-deep-brown font-serif text-base md:text-lg">Lagos & London</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-[#FDF2F8] p-6 md:p-16 lg:p-24 flex flex-col justify-center">
        <div className="max-w-lg w-full mx-auto">
          <form className="space-y-8 md:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 md:mb-2 group-focus-within:text-brand-pink transition-colors">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Chidi Okafor"
                  className="w-full bg-transparent border-b border-stone-300 py-2 md:py-3 text-deep-brown placeholder-stone-300 focus:outline-none focus:border-brand-pink transition-colors font-serif text-lg md:text-xl"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 md:mb-2 group-focus-within:text-brand-pink transition-colors">Email Address</label>
                <input 
                  type="email" 
                  placeholder="chidi@example.com"
                  className="w-full bg-transparent border-b border-stone-300 py-2 md:py-3 text-deep-brown placeholder-stone-300 focus:outline-none focus:border-brand-pink transition-colors font-serif text-lg md:text-xl"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 md:mb-2 group-focus-within:text-brand-pink transition-colors">Inquiry Type</label>
              <div className="relative">
                <select className="w-full bg-transparent border-b border-stone-300 py-2 md:py-3 text-deep-brown focus:outline-none focus:border-brand-pink transition-colors font-serif text-lg md:text-xl appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Order Status</option>
                  <option>Bespoke Commission</option>
                  <option>Press & Media</option>
                  <option>Wholesale</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1 md:mb-2 group-focus-within:text-brand-pink transition-colors">Your Message</label>
              <textarea 
                rows={4}
                placeholder="How can we help you create your heritage story?"
                className="w-full bg-transparent border-b border-stone-300 py-2 md:py-3 text-deep-brown placeholder-stone-300 focus:outline-none focus:border-brand-pink transition-colors font-serif text-lg md:text-xl resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full sm:w-auto bg-brand-pink text-white px-8 py-4 rounded-none uppercase tracking-widest text-[10px] md:text-xs font-bold hover:bg-deep-brown transition-colors flex items-center justify-center gap-3 group">
              Send Message
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Partner Logos (Faint) */}
          <div className="mt-16 md:mt-24 flex justify-center sm:justify-start gap-8 opacity-10 grayscale">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
