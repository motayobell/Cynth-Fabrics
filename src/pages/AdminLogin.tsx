import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Palette, Home } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore, if not, create them (or you can restrict to only existing admins)
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        name: user.displayName || 'Admin User',
        email: user.email,
        role: 'Super Admin',
        avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'Admin'}&background=random`
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...userData,
          id: user.uid,
          status: 'Active',
          lastLogin: new Date().toISOString()
        });
      }

      localStorage.setItem('currentUser', JSON.stringify(userData));
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Default admin credentials fallback for testing if needed
    if (email === 'admin@cynthfabrics.com' && password === 'admin123') {
      const user = {
        name: 'Admin User',
        email: email,
        role: 'Super Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please use Google Sign-In or default credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Home Button */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-[#f20da6] transition-colors font-medium z-20 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        <Home size={18} />
        Home
      </Link>

      {/* Background Subtle Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#f20da6]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
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
            <span className="bg-gradient-to-r from-[#B89000] via-[#D4AF37] to-[#B89000] bg-clip-text text-transparent">
              Cynth Fabrics
            </span>
          </h1>
          <p className="text-[#B89000]/80 text-xs tracking-widest mt-2 uppercase font-medium">
            Luxury Nigerian Fashion Admin
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl border border-gray-200 relative overflow-hidden group">
          {/* Subtle interior border accent */}
          <div className="absolute inset-0 border border-gray-100 rounded-xl pointer-events-none"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Admin Access</h2>
            <p className="text-gray-500 text-sm">Secure login to your brand dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or use email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f20da6] focus:ring-1 focus:ring-[#f20da6] transition-all duration-300 shadow-sm"
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
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f20da6] focus:ring-1 focus:ring-[#f20da6] transition-all duration-300 shadow-sm"
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
                disabled={isLoading}
                className="w-full bg-[#f20da6] hover:bg-[#f20da6]/90 text-white font-bold py-4 rounded-lg shadow-[0_4px_20px_rgba(242,13,166,0.3)] transition-all duration-300 transform active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                Login to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-8 text-center">
            <a href="#" className="text-xs font-medium text-gray-500 hover:text-[#f20da6] transition-colors duration-200 decoration-gray-300 underline underline-offset-4">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Cynth Fabrics. Secure Admin Access.
          </p>
          <div className="flex justify-center gap-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF2-QkvwhogCDqbpseA9NKVUmoFCF7WJ_YXcsCBDC8ss8R5d9N13cTIXvNB6hN3qBhjFoqINOlq4-g5cEt773y3mmUNbPgWirh-1W-Ffk9WuiG2gtpaSeA7Mc0CBzXfS7mu5xuidclOsVlWh44816IkxsSPjGv9_Awwo2kbmzLlv6fZsiDhTg24o-MXGGxj5yxZ1KpS2en-3h0uIOHXM7cCx0yBTS1N7UwiAu6quE_eYDCf5i6Q_JPE9L-cKFWlAESmj58S8tCScs"
              alt="Fabric Texture"
              className="w-8 h-8 rounded-full object-cover grayscale opacity-40 hover:opacity-80 transition-opacity cursor-help"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQsk99olg1rSUQkjjXMnXjlZ0s36plNggmYaXGdA1yIDKhstdRuNNBJAhwBvsKjKrTifDigQuncXoioknW18RF1N544wJTkEU3isQUHPIJwNIMVYsxdSRjF9V51WeRbAGM_of8QRrp1A0BKxNdZ-N3OJPMiCivEQB0ExWOLVp0Oh2_ElvKsoMnupYuj5r8sV_omBDMYwKsHR7l30vQM_RKCXGrVfFSCE1DJH-QW4IP0iYMtJ5xfIa9Yyfgv_4peq3SIqZhBJstsz4"
              alt="Workshop"
              className="w-8 h-8 rounded-full object-cover grayscale opacity-40 hover:opacity-80 transition-opacity cursor-help"
            />
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-white/60 border border-gray-200 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
        <ShieldCheck className="text-green-600 w-4 h-4" />
        <span className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter">Encrypted Session</span>
      </div>
    </div>
  );
}
