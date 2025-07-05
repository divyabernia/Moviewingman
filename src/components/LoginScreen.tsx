import React, { useState } from 'react';
import { Heart, Play, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, just proceed to app
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="relative h-12 sm:h-16 md:h-20 w-auto">
              {!logoLoaded && (
                <div className="h-12 sm:h-16 md:h-20 w-12 sm:w-16 md:w-20 bg-gray-700 skeleton rounded" />
              )}
              <img 
                src="/WhatsApp Image 2025-07-05 at 16.59.28.jpeg" 
                alt="CineVault Logo" 
                className={`h-12 sm:h-16 md:h-20 w-auto brightness-150 contrast-125 saturate-110 transition-opacity duration-300 ${
                  logoLoaded ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={() => setLogoLoaded(true)}
                loading="eager"
                style={{ display: logoLoaded ? 'block' : 'none' }}
              />
            </div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
              CineVault
            </span>
          </div>
          <p className="text-gray-300 mt-2">Your ultimate movie watchlist</p>
        </div>

        {/* Login Form */}
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-red-800/30 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-red-950/30 border border-red-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-red-950/30 border border-red-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-red-800/30">
            <button
              onClick={onLogin}
              className="w-full bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-200 border border-red-800/30"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Discover, track, and organize your favorite movies
          </p>
        </div>
      </div>
    </div>
  );
};