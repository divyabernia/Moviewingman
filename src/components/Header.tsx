import React from 'react';
import { Home, TrendingUp, BookOpen, LogOut, Users, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'search' | 'watchlist' | 'trending' | 'social';
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'trending' | 'social') => void;
  watchlistCount: number;
  socialWatchlistCount: number;
  searchQuery: string;
  onQueryChange: (query: string) => void;
  onManualSearch: () => void;
  loading: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  watchlistCount,
  socialWatchlistCount,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-red-800/30 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => setCurrentView('home')}
          >
            <div className="relative h-8 sm:h-10 md:h-12 w-auto">
              {!logoLoaded && (
                <div className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 bg-gray-700 animate-pulse rounded" />
              )}
            <img 
              src="/WhatsApp Image 2025-07-05 at 16.59.28.jpeg" 
              alt="CineVault Logo" 
                className={`h-8 sm:h-10 md:h-12 w-auto group-hover:scale-105 transition-all brightness-150 contrast-125 saturate-110 ${
                  logoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setLogoLoaded(true)}
                loading="eager"
            />
            </div>
            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent hidden sm:block">
              CineVault
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm ${
                currentView === 'home'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => setCurrentView('trending')}
              className={`px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm ${
                currentView === 'trending'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setCurrentView('watchlist')}
              className={`px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm relative ${
                currentView === 'watchlist'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('social')}
              className={`px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm relative ${
                currentView === 'social'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Social</span>
              {socialWatchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {socialWatchlistCount > 99 ? '99+' : socialWatchlistCount}
                </span>
              )}
            </button>

            <div className="w-px h-6 bg-red-800/30 mx-2"></div>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm text-gray-300 hover:text-white hover:bg-red-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Quick action buttons for mobile */}
            <button
              onClick={() => setCurrentView('watchlist')}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                currentView === 'watchlist'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {watchlistCount > 9 ? '9+' : watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('social')}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                currentView === 'social'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <Users className="w-5 h-5" />
              {socialWatchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {socialWatchlistCount > 9 ? '9+' : socialWatchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/30 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-red-800/30 py-4">
            <div className="container mx-auto px-4 space-y-2">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm ${
                  currentView === 'home'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-red-900/30'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentView('trending');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm ${
                  currentView === 'trending'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-red-900/30'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('watchlist');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm relative ${
                  currentView === 'watchlist'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-red-900/30'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Watchlist ({watchlistCount})</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('social');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm relative ${
                  currentView === 'social'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-red-900/30'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Social ({socialWatchlistCount})</span>
              </button>

              <div className="w-full h-px bg-red-800/30 my-2"></div>

              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm text-gray-300 hover:text-white hover:bg-red-900/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};