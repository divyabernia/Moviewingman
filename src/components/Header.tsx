import React from 'react';
import { Home, TrendingUp, BookOpen, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'search' | 'watchlist' | 'trending';
  setCurrentView: (view: 'home' | 'search' | 'watchlist' | 'trending') => void;
  watchlistCount: number;
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
  onLogout,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-red-800/30 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <img 
              src="/WhatsApp Image 2025-07-05 at 16.59.28.jpeg" 
              alt="CineVault Logo" 
              className="h-12 w-auto group-hover:scale-105 transition-transform brightness-150 contrast-125 saturate-110"
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm ${
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
              className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm ${
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
              className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm relative ${
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

            <div className="w-px h-6 bg-red-800/30 mx-2"></div>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold text-sm text-gray-300 hover:text-white hover:bg-red-900/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};