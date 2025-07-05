import React from 'react';
import { Home, TrendingUp, BookOpen, LogOut, Users } from 'lucide-react';

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
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-red-800/30 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <img 
              src="/WhatsApp Image 2025-07-05 at 16.59.28.jpeg" 
              alt="CineVault Logo" 
              className="h-8 sm:h-10 md:h-12 w-auto group-hover:scale-105 transition-transform brightness-150 contrast-125 saturate-110"
            />
            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent hidden sm:block">
              CineVault
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-2 sm:px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
                currentView === 'home'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <button
              onClick={() => setCurrentView('trending')}
              className={`px-2 sm:px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm ${
                currentView === 'trending'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Trending</span>
            </button>

            <button
              onClick={() => setCurrentView('watchlist')}
              className={`px-2 sm:px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm relative ${
                currentView === 'watchlist'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('social')}
              className={`px-2 sm:px-4 md:px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm relative ${
                currentView === 'social'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-red-900/30'
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Social</span>
              {socialWatchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg">
                  {socialWatchlistCount > 99 ? '99+' : socialWatchlistCount}
                </span>
              )}
            </button>

            <div className="w-px h-4 sm:h-6 bg-red-800/30 mx-1 sm:mx-2"></div>

            <button
              onClick={onLogout}
              className="px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-red-900/30"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};