import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Calendar, Search, Sparkles, Brain, Zap } from 'lucide-react';
import { VoiceSearchButton } from './VoiceSearchButton';
import { MovieGrid } from './MovieGrid';
import { Movie } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface HeroProps {
  trendingMovies: Movie[];
  onMovieClick: (movieId: number) => void;
  searchQuery: string;
  searchResults: Movie[];
  watchlist: Movie[];
  loading: boolean;
  error: string | null;
  onQueryChange: (query: string) => void;
  onToggleWatchlist: (movie: Movie) => void;
  showSearchResults: boolean;
  onShowAISommelier: () => void;
  onShowMovieDNA: () => void;
  onShowSmartRecommendations: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  trendingMovies, 
  onMovieClick,
  searchQuery,
  searchResults,
  watchlist,
  loading,
  error,
  onQueryChange,
  onToggleWatchlist,
  showSearchResults
  onShowAISommelier,
  onShowMovieDNA,
  onShowSmartRecommendations,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [trendingMovies.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Trigger search by calling the parent's search handler
      onMovieClick && window.dispatchEvent(new CustomEvent('heroSearch', { detail: searchQuery }));
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    if (transcription.trim()) {
      // Set the search query via parent and trigger search
      onQueryChange(transcription);
      window.dispatchEvent(new CustomEvent('heroSearch', { detail: transcription }));
    }
  };

  if (trendingMovies.length === 0) {
    return (
      <div className="relative h-[60vh] bg-gradient-to-br from-red-900 via-black to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
            <Search className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Welcome to CineVault</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed mb-8">
            Your ultimate movie watchlist and discovery platform
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for movies, actors, directors..."
                  value={searchQuery}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = trendingMovies[currentIndex];

  return (
    <div className="relative h-[85vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Search Bar */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="max-w-2xl relative">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search for movies, actors, directors..."
                    value={searchQuery}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="w-full pl-16 pr-32 py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-lg"
                  />
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                    <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                  </div>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm font-semibold backdrop-blur-sm">
                #1 Trending This Week
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-8 text-gray-300">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-red-800/30">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-lg text-white">{currentMovie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-red-800/30">
                <Calendar className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-white">{getYear(currentMovie.release_date)}</span>
              </div>
            </div>

            <p className="text-xl text-gray-200 mb-10 leading-relaxed line-clamp-3 max-w-2xl">
              {currentMovie.overview}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => onMovieClick(currentMovie.id)}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105"
              >
                <Info className="w-6 h-6" />
                More Details
              </button>
              <button className="bg-black/40 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-black/60 transition-all duration-200 border border-red-800/30">
                <Play className="w-6 h-6" />
                Watch Trailer
              </button>
              <button
                onClick={onShowAISommelier}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105"
              >
                <Sparkles className="w-6 h-6" />
                AI Sommelier
              </button>
            </div>

            {/* Quick AI Features */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={onShowMovieDNA}
                className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-all duration-200 flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Movie DNA
              </button>
              <button
                onClick={onShowSmartRecommendations}
                className="px-6 py-3 bg-green-600/20 border border-green-500/30 text-green-300 rounded-xl hover:bg-green-600/30 transition-all duration-200 flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Smart Picks
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Search Results */}
      {showSearchResults && searchQuery.trim() && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 pt-24">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                {loading ? 'Searching...' : `Search Results for "${searchQuery}"`}
              </h3>
              
              {loading && (
                <div className="flex justify-center mb-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
                  <p className="text-red-300 text-lg font-semibold">{error}</p>
                </div>
              )}
              
              {!loading && !error && (
                <p className="text-gray-300 text-lg">
                  Found {searchResults.length} results
                </p>
              )}
              
              <button
                onClick={() => onQueryChange('')}
                className="mt-4 px-6 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-600/30 transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
            
            {!loading && !error && searchResults.length > 0 && (
              <MovieGrid
                movies={searchResults}
                watchlist={watchlist}
                onToggleWatchlist={onToggleWatchlist}
                onMovieClick={onMovieClick}
              />
            )}
            
            {!loading && !error && searchResults.length === 0 && searchQuery.trim() && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
                  <Search className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Results Found</h3>
                <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                  Try adjusting your search terms or explore our trending movies instead
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Carousel Indicators */}
      {!showSearchResults && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {trendingMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-red-600 to-red-500 w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      )}
    </div>
  );
};