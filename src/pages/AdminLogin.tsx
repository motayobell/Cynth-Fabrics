import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Palette } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    // Simulate login
    const user = {
      name: 'Admin User',
      email: email,
      role: 'Super Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans bg-[#0a0508] text-white relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#f20da6]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-32 h-32 mb-4">
            {/* Logo */}
            <img 
              src="https://lh3.googleusercontent.com/d/1b3Vq6YHV6GABHAnwCNW07JW1hrTNnlYZ" 
              alt="Cynth Fabrics Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(242,13,166,0.4)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-[0.2em] uppercase text-center">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#FBF5B7] to-[#D4AF37] bg-clip-text text-transparent">
              Cynth Fabrics
            </span>
          </h1>
          <p className="text-[#D4AF37]/60 text-xs tracking-widest mt-2 uppercase font-medium">
            Luxury Nigerian Fashion Admin
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a0d16]/80 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-[#D4AF37]/30 relative overflow-hidden group">
          {/* Subtle interior border accent */}
          <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">Admin Access</h2>
            <p className="text-white/40 text-sm">Secure login to your brand dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#D4AF37]/80 uppercase tracking-wider ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/40 w-5 h-5" />
                <input
                  className="w-full bg-[#0a0508]/50 border border-[#D4AF37]/20 rounded-lg py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#f20da6] focus:ring-1 focus:ring-[#f20da6] transition-all duration-300"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@cynthfabrics.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-semibold text-[#D4AF37]/80 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/40 w-5 h-5" />
                <input
                  className="w-full bg-[#0a0508]/50 border border-[#D4AF37]/20 rounded-lg py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#f20da6] focus:ring-1 focus:ring-[#f20da6] transition-all duration-300"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full bg-[#f20da6] hover:bg-[#f20da6]/90 text-white font-bold py-4 rounded-lg shadow-[0_4px_20px_rgba(242,13,166,0.3)] transition-all duration-300 transform active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Login to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-8 text-center">
            <a href="#" className="text-xs font-medium text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors duration-200 decoration-[#D4AF37]/20 underline underline-offset-4">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
            © 2024 Cynth Fabrics. Secure Admin Access.
          </p>
          <div className="flex justify-center gap-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF2-QkvwhogCDqbpseA9NKVUmoFCF7WJ_YXcsCBDC8ss8R5d9N13cTIXvNB6hN3qBhjFoqINOlq4-g5cEt773y3mmUNbPgWirh-1W-Ffk9WuiG2gtpaSeA7Mc0CBzXfS7mu5xuidclOsVlWh44816IkxsSPjGv9_Awwo2kbmzLlv6fZsiDhTg24o-MXGGxj5yxZ1KpS2en-3h0uIOHXM7cCx0yBTS1N7UwiAu6quE_eYDCf5i6Q_JPE9L-cKFWlAESmj58S8tCScs"
              alt="Fabric Texture"
              className="w-8 h-8 rounded-full object-cover grayscale opacity-20 hover:opacity-50 transition-opacity cursor-help"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQsk99olg1rSUQkjjXMnXjlZ0s36plNggmYaXGdA1yIDKhstdRuNNBJAhwBvsKjKrTifDigQuncXoioknW18RF1N544wJTkEU3isQUHPIJwNIMVYsxdSRjF9V51WeRbAGM_of8QRrp1A0BKxNdZ-N3OJPMiCivEQB0ExWOLVp0Oh2_ElvKsoMnupYuj5r8sV_omBDMYwKsHR7l30vQM_RKCXGrVfFSCE1DJH-QW4IP0iYMtJ5xfIa9Yyfgv_4peq3SIqZhBJstsz4"
              alt="Workshop"
              className="w-8 h-8 rounded-full object-cover grayscale opacity-20 hover:opacity-50 transition-opacity cursor-help"
            />
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#1a0d16]/40 border border-[#D4AF37]/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
        <ShieldCheck className="text-[#D4AF37] w-4 h-4" />
        <span className="text-[10px] text-white/50 font-medium uppercase tracking-tighter">Encrypted Session</span>
      </div>
    </div>
  );
}
