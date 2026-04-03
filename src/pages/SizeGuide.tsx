import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const SizeGuide = () => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const sizes = [
    { name: 'Small (S)', chest: '36 - 38', shoulder: '17.5', length: '32' },
    { name: 'Medium (M)', chest: '39 - 41', shoulder: '18.5', length: '33' },
    { name: 'Large (L)', chest: '42 - 44', shoulder: '19.5', length: '34' },
    { name: 'X-Large (XL)', chest: '45 - 47', shoulder: '20.5', length: '35' },
    { name: 'XX-Large (XXL)', chest: '48 - 50', shoulder: '21.5', length: '36' },
  ];

  const convertToCm = (val: string) => {
    if (val.includes('-')) {
      const [min, max] = val.split('-').map(v => parseFloat(v.trim()));
      return `${(min * 2.54).toFixed(1)} - ${(max * 2.54).toFixed(1)}`;
    }
    return (parseFloat(val) * 2.54).toFixed(1);
  };

  const getValue = (val: string) => {
    return unit === 'inches' ? val : convertToCm(val);
  };

  return (
    <div className="min-h-screen bg-deep-brown/95 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-deep-brown border border-gold rounded-xl p-6 md:p-12 relative shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-gold text-2xl md:text-4xl font-serif tracking-wider mb-2">CYNTH FABRICS</h1>
          <p className="text-gold/70 text-[10px] md:text-xs tracking-[0.2em] uppercase font-sans">Luxury Nigerian Native Wear</p>
        </div>

        {/* Title & Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8 border-b border-white/10 pb-8 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl font-serif mb-2">Size Guide</h2>
            <p className="text-white/60 text-xs md:text-sm font-sans max-w-xs md:max-w-none">Find your perfect fit for our premium native collections.</p>
          </div>
          
          <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setUnit('inches')}
              className={`flex-1 md:flex-none px-6 py-2 text-xs md:text-sm rounded-md transition-all font-sans tracking-widest ${unit === 'inches' ? 'bg-gold text-deep-brown font-bold shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`flex-1 md:flex-none px-6 py-2 text-xs md:text-sm rounded-md transition-all font-sans tracking-widest ${unit === 'cm' ? 'bg-gold text-deep-brown font-bold shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-10 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-gold text-[10px] md:text-xs uppercase tracking-wider font-bold font-sans">Size</th>
                <th className="py-4 text-gold text-[10px] md:text-xs uppercase tracking-wider font-bold font-sans">Chest ({unit === 'inches' ? 'IN' : 'CM'})</th>
                <th className="py-4 text-gold text-[10px] md:text-xs uppercase tracking-wider font-bold font-sans">Shoulder ({unit === 'inches' ? 'IN' : 'CM'})</th>
                <th className="py-4 text-gold text-[10px] md:text-xs uppercase tracking-wider font-bold font-sans">Length ({unit === 'inches' ? 'IN' : 'CM'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sizes.map((size, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white font-bold font-sans text-sm md:text-base">{size.name}</td>
                  <td className="py-4 text-white/80 font-sans text-sm md:text-base">{getValue(size.chest)}</td>
                  <td className="py-4 text-white/80 font-sans text-sm md:text-base">{getValue(size.shoulder)}</td>
                  <td className="py-4 text-white/80 font-sans text-sm md:text-base">{getValue(size.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure */}
        <div className="mb-10">
          <h3 className="text-gold text-[10px] md:text-xs uppercase tracking-widest font-bold mb-8 border-b border-white/10 pb-2 inline-block font-sans">
            How to Measure
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {/* Left Column - Diagram & Instructions */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-20 h-28 md:w-24 md:h-32 border border-white/10 relative flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
                {/* Simplified SVG representation of torso for Shoulder/Chest */}
                <svg viewBox="0 0 100 130" className="w-full h-full stroke-gold fill-none" strokeWidth="1">
                  <path d="M20,30 L80,30" className="opacity-50" /> {/* Shoulder line */}
                  <path d="M25,50 L75,50" className="opacity-50" /> {/* Chest line */}
                  <path d="M30,20 Q50,30 70,20 L80,30 L80,80 L70,120 L30,120 L20,80 L20,30 Z" className="opacity-30" />
                  
                  {/* Highlight lines */}
                  <line x1="20" y1="25" x2="80" y2="25" stroke="var(--color-gold)" strokeWidth="2" />
                  <line x1="15" y1="25" x2="15" y2="55" stroke="var(--color-gold)" strokeWidth="1" strokeDasharray="2,2" />
                </svg>
              </div>
              <div>
                <div className="mb-5">
                  <h4 className="text-gold text-[10px] md:text-xs font-black mb-1 font-sans uppercase tracking-widest">1. SHOULDER</h4>
                  <p className="text-white/60 text-[10px] md:text-xs leading-relaxed font-sans">
                    Measure from the tip of one shoulder across the back to the tip of the other.
                  </p>
                </div>
                <div>
                  <h4 className="text-gold text-[10px] md:text-xs font-black mb-1 font-sans uppercase tracking-widest">2. CHEST</h4>
                  <p className="text-white/60 text-[10px] md:text-xs leading-relaxed font-sans">
                    Wrap tape around the fullest part of your chest, keeping it level under arms.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Diagram & Instructions */}
            <div className="flex gap-5 md:gap-6">
              <div className="w-20 h-28 md:w-24 md:h-32 border border-white/10 relative flex-shrink-0 bg-black/20 rounded-lg overflow-hidden">
                {/* Simplified SVG representation of torso for Length */}
                <svg viewBox="0 0 100 130" className="w-full h-full stroke-gold fill-none" strokeWidth="1">
                  <path d="M30,20 Q50,30 70,20 L80,30 L80,80 L70,120 L30,120 L20,80 L20,30 Z" className="opacity-30" />
                  
                  {/* Highlight lines */}
                  <line x1="50" y1="20" x2="50" y2="120" stroke="var(--color-gold)" strokeWidth="2" />
                  <line x1="40" y1="20" x2="60" y2="20" stroke="var(--color-gold)" strokeWidth="1" />
                  <line x1="40" y1="120" x2="60" y2="120" stroke="var(--color-gold)" strokeWidth="1" />
                </svg>
              </div>
              <div>
                <div className="mb-5">
                  <h4 className="text-gold text-[10px] md:text-xs font-black mb-1 font-sans uppercase tracking-widest">3. LENGTH</h4>
                  <p className="text-white/60 text-[10px] md:text-xs leading-relaxed font-sans">
                    Measure from the highest point of your shoulder down to your desired length.
                  </p>
                </div>
                <div>
                  <h4 className="text-gold text-[10px] md:text-xs font-black mb-1 font-sans uppercase tracking-widest">NOTE</h4>
                  <p className="text-white/60 text-[10px] md:text-xs leading-relaxed italic font-sans">
                    For a more relaxed fit, we recommend adding 1-2 inches to your body measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full md:w-auto bg-brand-pink hover:bg-brand-pink/90 text-white px-12 py-4 rounded-full text-xs md:text-sm font-black tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95 font-sans uppercase"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
