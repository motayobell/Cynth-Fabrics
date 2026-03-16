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
    <div className="min-h-screen bg-deep-brown/95 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-deep-brown border border-gold rounded-lg p-8 relative shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gold text-3xl font-serif tracking-wider mb-2">CYNTH FABRICS</h1>
          <p className="text-gold/70 text-xs tracking-[0.2em] uppercase font-sans">Luxury Nigerian Native Wear</p>
        </div>

        {/* Title & Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-white text-2xl font-serif mb-1">Size Guide</h2>
            <p className="text-white/60 text-sm font-sans">Find your perfect fit for our premium native collections.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex bg-black/20 rounded p-1 border border-white/10">
            <button
              onClick={() => setUnit('inches')}
              className={`px-4 py-1 text-sm rounded transition-colors font-sans ${unit === 'inches' ? 'bg-gold text-deep-brown font-medium' : 'text-white/60 hover:text-white'}`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1 text-sm rounded transition-colors font-sans ${unit === 'cm' ? 'bg-gold text-deep-brown font-medium' : 'text-white/60 hover:text-white'}`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-gold text-xs uppercase tracking-wider font-medium font-sans">Size</th>
                <th className="py-4 text-gold text-xs uppercase tracking-wider font-medium font-sans">Chest ({unit === 'inches' ? 'IN' : 'CM'})</th>
                <th className="py-4 text-gold text-xs uppercase tracking-wider font-medium font-sans">Shoulder ({unit === 'inches' ? 'IN' : 'CM'})</th>
                <th className="py-4 text-gold text-xs uppercase tracking-wider font-medium font-sans">Length ({unit === 'inches' ? 'IN' : 'CM'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sizes.map((size, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white font-medium font-sans">{size.name}</td>
                  <td className="py-4 text-white/80 font-sans">{getValue(size.chest)}</td>
                  <td className="py-4 text-white/80 font-sans">{getValue(size.shoulder)}</td>
                  <td className="py-4 text-white/80 font-sans">{getValue(size.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure */}
        <div className="mb-12">
          <h3 className="text-gold text-sm uppercase tracking-wider font-medium mb-6 border-b border-white/10 pb-2 inline-block font-sans">
            How to Measure
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Diagram & Instructions */}
            <div className="flex gap-6">
              <div className="w-24 h-32 border border-white/10 relative flex-shrink-0 bg-black/20">
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
                <div className="mb-6">
                  <h4 className="text-gold text-xs font-bold mb-1 font-sans">1. SHOULDER</h4>
                  <p className="text-white/60 text-xs leading-relaxed font-sans">
                    Measure from the tip of one shoulder across the back to the tip of the other.
                  </p>
                </div>
                <div>
                  <h4 className="text-gold text-xs font-bold mb-1 font-sans">2. CHEST</h4>
                  <p className="text-white/60 text-xs leading-relaxed font-sans">
                    Wrap tape around the fullest part of your chest, keeping it level under arms.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Diagram & Instructions */}
            <div className="flex gap-6">
              <div className="w-24 h-32 border border-white/10 relative flex-shrink-0 bg-black/20">
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
                <div className="mb-6">
                  <h4 className="text-gold text-xs font-bold mb-1 font-sans">3. LENGTH</h4>
                  <p className="text-white/60 text-xs leading-relaxed font-sans">
                    Measure from the highest point of your shoulder down to your desired length.
                  </p>
                </div>
                <div>
                  <h4 className="text-gold text-xs font-bold mb-1 font-sans">NOTE</h4>
                  <p className="text-white/60 text-xs leading-relaxed italic font-sans">
                    For a more relaxed fit, we recommend adding 1-2 inches to your body measurements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white px-12 py-3 rounded-full text-sm font-bold tracking-wider transition-colors shadow-lg font-sans"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
