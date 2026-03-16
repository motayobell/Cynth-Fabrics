import React from 'react';
import { Sparkles, Scissors, Globe, Heart, Quote, MapPin } from 'lucide-react';

export default function OurStory() {
  return (
    <div className="bg-cream min-h-screen">
      
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Master tailors at work" 
            className="w-full h-full object-cover scale-105 brightness-75" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdEpS500GCpu7k5CJkkqzugQ5o-nLBDfi4kWCrUDJPDAUBUNRoudD3BsaGIvCINmPwbZ4CNewkVCh7N-oY9NNVIgxxRKVlWags2dGh1-NUcoMMd6Gu10T_xY1zLKCiNJGrKWrP_tHCWq4VMn3aATINfdF03y_Q0zR74DY8Y3P4ooS6uSOH9LfFHY_0zm08NhAwCMrBdO5pOY_yTl22KAFGHEl0-WGZPzhtkoz_naQ_yezmPhOfic8vYeIuDjUC-X97yiEdLB7JU1E"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl pt-20">
          <span className="text-white/90 uppercase tracking-[0.6em] text-sm mb-6 block font-extrabold drop-shadow-md">Established in the Heart of Lagos</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-tight text-white drop-shadow-lg">
            The Soul of <br/><span className="italic text-gold">Nigerian Craft</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Honoring the master tailors who stitch our history into every garment, bridging the gap between ancestral heritage and the global diaspora.
          </p>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-white/80 mb-4 font-bold">Scroll to Explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-pink to-transparent"></div>
        </div>
      </header>

      {/* Master Tailors Section */}
      <section className="py-32 px-6 md:px-24 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="inline-block px-6 py-2 border-2 border-brand-pink rounded-full">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-pink font-black">Heritage & Innovation</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight text-deep-brown">Master Tailors: <br/>The Keepers of Art</h2>
            <p className="text-deep-brown/80 leading-relaxed text-xl font-medium">
              At Cynth Fabrics, we don't just source material; we preserve legacy. Our master tailors in Nigeria are artisans whose techniques have been passed down through centuries. Each stitch is a testament to the resilience and vibrancy of Nigerian culture.
            </p>
            <p className="text-stone-600 leading-relaxed text-lg">
              From the intricate hand-weaving of Aso Oke to the precision of modern couture silhouettes, we celebrate the hands that bring our vision to life. This is luxury defined by lineage.
            </p>
            <div className="pt-8 space-y-6">
              <div className="flex items-center space-x-6 border-b border-deep-brown/10 pb-6 group cursor-pointer">
                <span className="text-brand-pink font-serif text-4xl italic group-hover:scale-110 transition-transform">01</span>
                <span className="uppercase tracking-[0.2em] text-md font-bold text-deep-brown">Ancestral Weaving Techniques</span>
              </div>
              <div className="flex items-center space-x-6 border-b border-deep-brown/10 pb-6 group cursor-pointer">
                <span className="text-brand-pink font-serif text-4xl italic group-hover:scale-110 transition-transform">02</span>
                <span className="uppercase tracking-[0.2em] text-md font-bold text-deep-brown">Master Tailor Collaboration</span>
              </div>
              <div className="flex items-center space-x-6 group cursor-pointer">
                <span className="text-brand-pink font-serif text-4xl italic group-hover:scale-110 transition-transform">03</span>
                <span className="uppercase tracking-[0.2em] text-md font-bold text-deep-brown">Diaspora Identity Silhouettes</span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -top-8 -left-8 w-full h-full border-2 border-gold/30 rounded-xl transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
            <img 
              alt="Intricate fabric detail" 
              className="relative z-10 rounded-xl shadow-2xl border border-white/50 w-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNZq8uO4AjadlkM3P9OrlylVcPtGgBhzOAFFk6uaopmZ0ujREvl8vviU7Cjo4r44J5OYL18KFXJA3agJdcnBedPTw8WEM1S3PIWdBumqgL17f0pHyE7vFIP0US-rMmoL32eouNv5DSSgsnNYjKy1_-twBRFbhog1_IAPRNdKGwA1L3P-OZVISsDQUcu3olbp2HvHxgiMcH1jb90YxXbq23EO-WArMHg1HT4TYgpLJWVUjgkFDqJwh6jStVeJ63KfpEqKbkOYDowW0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-pink text-white p-8 rounded-lg z-20 hidden md:block shadow-xl">
              <p className="text-xs uppercase tracking-widest font-black mb-2">Signature Quality</p>
              <p className="font-serif text-2xl italic">Gold-Threaded <br/>Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink rounded-full blur-[150px]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-8 text-center relative z-10">
          <Quote className="w-20 h-20 text-brand-pink mx-auto mb-12 opacity-20" />
          <h3 className="text-4xl md:text-6xl font-serif italic leading-[1.3] text-deep-brown mb-16 font-medium">
            "We are not merely creating garments; we are stitching together the fragmented stories of home for a global generation. Cynth Fabrics is where heritage meets the horizon."
          </h3>
          <div className="h-[3px] w-32 bg-gold mx-auto mb-8"></div>
          <p className="uppercase tracking-[0.4em] text-brand-pink font-black text-lg">Cynthia Abiodun</p>
          <p className="text-stone-500 text-xs uppercase tracking-widest mt-2 font-bold">Founder & Creative Director</p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-cream overflow-hidden">
        <div className="container mx-auto px-6 md:px-24">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-brand-pink font-black tracking-[0.4em] text-sm uppercase mb-6 block">The Narrative</span>
              <h2 className="text-6xl md:text-8xl font-serif text-deep-brown">The Diaspora <br/><span className="italic text-gold">Odyssey</span></h2>
            </div>
            <div className="text-deep-brown/80 max-w-md pb-4 italic text-lg font-medium border-l-4 border-gold pl-6">
              Our journey mirrors your own. From the bustling energy of Lagos markets to the refined luxury of the world's fashion capitals.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8 border border-deep-brown/5 shadow-lg">
                <img 
                  alt="Lagos market inspiration" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdLwujNqyDuqlxstsaptVSnqMv48BPvPX1gcRvjy7_V03XwsnDZc1WOSsyYNWZRIK4m9JYkpGt-3VK4OzYu_KqSeaih-GivoKLFhRoyWDzOvEnzMQMESiyF2-k1U3guWn0sKq-syRD6cvJR-gTc5eV_1BaN0nCEpaa_SWZvw98wCnWq3IbK5dQlYLSCLeR2Gyh-EqDDHxIwRD-fXugFIgfgJzzQZ0wDfFX0FdJRmNFGr37aGgO60LvogzNT76NHs_glObA27NDGck"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-2xl font-serif mb-4 text-deep-brown font-bold">Origins: Lagos</h4>
              <p className="text-stone-600 leading-relaxed">The heartbeat. Inspired by the master artisans of Balogun, where color and texture tell stories of royalty and pride.</p>
            </div>
            <div className="group md:mt-20">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8 border border-deep-brown/5 shadow-lg">
                <img 
                  alt="London studio" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHPt6j3zgrV7Vf4DYlTwSeWKA_ZELacoQkbZLtDyUhM_MSVLBNvwOtKHS3xZWNf5o0tVC8B4XmD30F1f_qCzbIr9nm3j7-w-zQXFQBEyXewLung33U2dsksz1t6glUAkfvVwYojhHTgSGy3nt0WklHtFlslesCJciOB-GXwszvuGHKpJZj4U4kUB6iUuZyvZTuMwTjj3F7pW8ZI6uawKYsoAv8saeEsgAckL1Nni3HP5e3QLIxQEqQ7NsaRv00pd0VlUenW8AaScE"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-2xl font-serif mb-4 text-deep-brown font-bold">Craft: The Atelier</h4>
              <p className="text-stone-600 leading-relaxed">Where heritage is honed. Applying the rigor of high-fashion tailoring to traditional West African textiles.</p>
            </div>
            <div className="group md:mt-40">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl mb-8 border border-deep-brown/5 shadow-lg">
                <img 
                  alt="Paris runway" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNcM1UGVQ8dCijn9yEFMh3pOjvOedPf0Y4xcIlVs4PGfs370pokxR8W59c8En4p6tR208JqwIG8i3HTiJNQf4RWJ6L_pUxzQEqbXM5M6bp68T2WH_aD1Yi0ewez-FOXKsPN4tggnN5DALwgahsZAw3T0S9_oodrcVQDxaRkxFFyLES1qWHWzAJZzVDsAywrxHq87R8eVSxG0Cap4H4SaBb80VrLHtOpI4GTrrQdf54RkJvLlNt6N93YTlaTGx5HgkhqxgdRhx4a9I"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-2xl font-serif mb-4 text-deep-brown font-bold">Vision: Global Impact</h4>
              <p className="text-stone-600 leading-relaxed">Demanding a permanent seat for Nigerian excellence in the global luxury landscape.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-32 px-6 md:px-24 bg-white border-y border-deep-brown/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-cream p-10 rounded-2xl border-2 border-deep-brown/5 hover:border-brand-pink transition-all duration-500 group shadow-sm">
                <div className="text-brand-pink mb-4 text-4xl font-serif font-bold group-hover:scale-110 transition-transform">100%</div>
                <p className="text-xs uppercase tracking-widest font-black text-deep-brown">Artisanal Fibers</p>
              </div>
              <div className="bg-cream p-10 rounded-2xl border-2 border-deep-brown/5 hover:border-brand-pink transition-all duration-500 group shadow-sm">
                <div className="text-brand-pink mb-4 text-4xl font-serif font-bold group-hover:scale-110 transition-transform">36hr</div>
                <p className="text-xs uppercase tracking-widest font-black text-deep-brown">Master Finishing</p>
              </div>
              <div className="bg-cream p-10 rounded-2xl border-2 border-deep-brown/5 hover:border-brand-pink transition-all duration-500 group shadow-sm">
                <div className="text-brand-pink mb-4 text-4xl font-serif font-bold group-hover:scale-110 transition-transform">Gold</div>
                <p className="text-xs uppercase tracking-widest font-black text-deep-brown">Standard Quality</p>
              </div>
              <div className="bg-cream p-10 rounded-2xl border-2 border-deep-brown/5 hover:border-brand-pink transition-all duration-500 group shadow-sm">
                <div className="text-brand-pink mb-4 text-4xl font-serif font-bold group-hover:scale-110 transition-transform">Ethic</div>
                <p className="text-xs uppercase tracking-widest font-black text-deep-brown">Fair Artisan Trade</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <h2 className="text-5xl md:text-7xl font-serif leading-tight text-deep-brown">The Cynth <br/>Guarantee</h2>
            <p className="text-deep-brown/80 leading-relaxed text-xl font-medium">
              True luxury is found in the details that honor the maker. We refuse to compromise on the dignity of our master tailors or the integrity of our ancestral fabrics.
            </p>
            <p className="text-stone-600 text-lg">
              Every purchase supports the training of new apprentices in Lagos, ensuring the art of Nigerian tailoring thrives for generations to come.
            </p>
            <a href="/shop" className="inline-block bg-brand-pink text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-brand-pink/40">
              Experience the Craft
            </a>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-32 px-6 md:px-24 text-center bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-serif mb-6 text-deep-brown">Global Presence</h2>
            <p className="text-brand-pink tracking-[0.5em] uppercase text-sm font-black">Lagos • London • New York</p>
          </div>
          <div className="w-full h-[500px] rounded-3xl overflow-hidden border-2 border-deep-brown/5 relative bg-white shadow-2xl">
            <img 
              alt="World map" 
              className="w-full h-full object-cover opacity-10 grayscale invert" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmyyNW1NA1gMeAV9GvhCSsok2F8vDYPiAKDWg3bd4OpupjvKZaCGNGUUxn0Or495vaI4SZBFg79vqY8dr7LnZWRdg9Aw2m3jwK-EhyYY2YdsYxkNjSkeARcnFNEVaWZ0wBpppvSwNlBiwFtsgjejHo8_zEMvQXGnHu7H3PdkW-3jdxlgd-4otpkDh1jyD8jMcVGfU65tmWPg9_m3DZpuJAw7w5LR4C-TGQjrIbxGuLdo2JXHdoIf3UGxQZfJansJFSmxPZt0f3KJE"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-brand-pink/10 p-12 rounded-full animate-pulse">
                <div className="w-6 h-6 bg-brand-pink rounded-full shadow-[0_0_20px_#f20c92]"></div>
              </div>
            </div>
            <div className="absolute bottom-10 left-10 text-left bg-white/90 backdrop-blur-md p-8 rounded-2xl border border-deep-brown/5 shadow-lg max-w-xs">
              <h5 className="font-serif text-3xl mb-2 text-deep-brown">Lagos flagship Atelier</h5>
              <p className="text-sm text-stone-500 uppercase tracking-widest mb-6 font-bold">Victoria Island, Nigeria</p>
              <a className="text-brand-pink font-black uppercase text-xs tracking-widest border-b-2 border-brand-pink pb-1 hover:text-deep-brown hover:border-deep-brown transition-colors" href="/contact">Book a Consultation</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
