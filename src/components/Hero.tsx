import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Calendar, Search, Sparkles, Brain, Zap, X, TrendingUp, Clock, Filter } from 'lucide-react';
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
  onSetShowSearchResults: (value: boolean) => void;
  onSocialAdd: (movie: Movie) => void;
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
  showSearchResults,
  onSetShowSearchResults,
  onSocialAdd,
  onShowAISommelier,
  onShowMovieDNA,
  onShowSmartRecommendations,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [stableResults, setStableResults] = useState<Movie[]>([]);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState<string>('');

  // Stabilize search results to prevent flickering
  useEffect(() => {
    if (!loading && searchResults.length > 0 && searchQuery.trim()) {
      setStableResults(searchResults);
      setLastSuccessfulQuery(searchQuery);
    }
  }, [searchResults, loading, searchQuery]);

  // Use stable results when loading to prevent flickering
  const displayResults = loading && stableResults.length > 0 && 
    searchQuery.includes(lastSuccessfulQuery) ? stableResults : searchResults;

  // Popular search suggestions
  const popularSuggestions = [
    'Marvel movies', 'Christopher Nolan', 'Action thriller', 'Romantic comedy',
    'Horror 2024', 'Best drama', 'Sci-fi adventure', 'Tom Hanks',
    'Disney animated', 'Crime thriller', 'Fantasy epic', 'Comedy 2023'
  ];

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movie-search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Generate search suggestions based on input
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = popularSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const fromHistory = searchHistory.filter(search =>
        search.toLowerCase().includes(searchQuery.toLowerCase()) &&
        search.toLowerCase() !== searchQuery.toLowerCase()
      );
      setSearchSuggestions([...new Set([...fromHistory.slice(0, 3), ...filtered.slice(0, 5)])]);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, searchHistory]);

  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [trendingMovies.length]);

  // Preload all background images
  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const preloadImages = async () => {
      const loadPromises = trendingMovies.map((movie, index) => {
        return new Promise<number>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(index);
          img.onerror = () => resolve(index);
          img.src = getImageUrl(movie.backdrop_path);
        });
      });

      const loadedIndices = await Promise.all(loadPromises);
      setPreloadedImages(new Set(loadedIndices));
    };

    preloadImages();
  }, [trendingMovies]);

  // Update background loaded state when current index changes
  useEffect(() => {
    if (preloadedImages.has(currentIndex)) {
      setBackgroundLoaded(true);
    } else {
      setBackgroundLoaded(false);
    }
  }, [currentIndex, preloadedImages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(s => s !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('movie-search-history', JSON.stringify(newHistory));
      setShowSuggestions(false);
      
      // Trigger search by calling the parent's search handler
      onMovieClick && window.dispatchEvent(new CustomEvent('heroSearch', { detail: searchQuery }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    // Trigger search immediately
    window.dispatchEvent(new CustomEvent('heroSearch', { detail: suggestion }));
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
      <div className="relative min-h-[50vh] sm:min-h-[60vh] bg-gradient-to-br from-red-900 via-black to-red-950 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-4xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-red-800/30">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Welcome to CineVault</h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-6 sm:mb-8">
            Your ultimate movie watchlist and discovery platform
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="relative flex items-center">
                <div className="absolute left-4 sm:left-6 z-10">
                  <Search className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies, actors, genres, or directors..."
                  value={searchQuery}
                  onChange={(e) => {
                    onQueryChange(e.target.value);
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 0) setShowSuggestions(true);
                  }}
                  className="w-full pl-12 sm:pl-16 pr-20 sm:pr-24 py-3 sm:py-4 md:py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-base sm:text-lg"
                />
                <div className="absolute right-14 sm:right-16 z-10">
                  <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-red-500/25"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-red-800/50 rounded-xl shadow-2xl z-20 max-h-80 overflow-y-auto">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 font-semibold text-sm">Search Suggestions</span>
                      </div>
                      <div className="space-y-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-2 text-white hover:bg-red-900/30 rounded-lg transition-colors duration-200 flex items-center gap-3 group"
                          >
                            <div className="w-6 h-6 bg-red-900/30 rounded-full flex items-center justify-center group-hover:bg-red-600/30 transition-colors">
                              {searchHistory.includes(suggestion) ? (
                                <Clock className="w-3 h-3 text-red-400" />
                              ) : (
                                <TrendingUp className="w-3 h-3 text-red-400" />
                              )}
                            </div>
                            <span className="flex-1">{suggestion}</span>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {searchHistory.includes(suggestion) ? 'Recent' : 'Popular'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
            
            {/* Quick Search Categories */}
            {!searchQuery && !showSearchResults && (
              <div className="mt-4 sm:mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-semibold text-sm">Quick Search</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSuggestions.slice(0, 8).map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(category)}
                      className="px-3 py-1.5 bg-red-900/20 border border-red-800/30 text-red-300 rounded-full text-xs sm:text-sm hover:bg-red-900/40 hover:border-red-700/50 transition-all duration-200 transform hover:scale-105"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = trendingMovies[currentIndex];

  return (
    <div className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] overflow-hidden">
      {/* Background skeleton */}
      {!backgroundLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-950 to-black skeleton" />
      )}
      
      <div 
        className={`absolute inset-0 bg-cover bg-center scale-105 transition-opacity duration-700 ${
          backgroundLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl">
            {/* Search Bar */}
            <div className="mb-6 sm:mb-8">
              <form onSubmit={handleSearch} className="max-w-2xl relative">
                <div className="relative">
                  <div className="relative flex items-center">
                  <div className="absolute left-4 sm:left-6 z-10">
                    <Search className="text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search movies, actors, genres, or directors..."
                    value={searchQuery}
                    onChange={(e) => {
                      onQueryChange(e.target.value);
                    }}
                    onFocus={() => {
                      if (searchQuery.length > 0) setShowSuggestions(true);
                    }}
                    className="w-full pl-12 sm:pl-16 pr-20 sm:pr-24 py-3 sm:py-4 md:py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-base sm:text-lg"
                  />
                  <div className="absolute right-14 sm:right-16 z-10">
                    <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                  </div>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="absolute right-2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-red-500/25"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                  
                  {/* Search Suggestions for main hero */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-red-800/50 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto">
                      <div className="p-4">
                        <div className="space-y-1">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-3 py-2 text-white hover:bg-red-900/30 rounded-lg transition-colors duration-200 flex items-center gap-3"
                            >
                              <Search className="w-4 h-4 text-red-400" />
                              <span>{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="mb-4 sm:mb-6">
              <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full text-red-300 text-xs sm:text-sm font-semibold backdrop-blur-sm">
                #1 Trending This Week
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 text-white leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 text-gray-300">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-red-800/30">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-base sm:text-lg text-white">{currentMovie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-red-800/30">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                <span className="font-semibold text-white">{getYear(currentMovie.release_date)}</span>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 md:mb-10 leading-relaxed line-clamp-3 max-w-2xl">
              {currentMovie.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={() => onMovieClick(currentMovie.id)}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105"
              >
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                More Details
              </button>
              <button className="bg-black/40 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-black/60 transition-all duration-200 border border-red-800/30">
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                Watch Trailer
              </button>
            </div>

            {/* Quick AI Features */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={onShowMovieDNA}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-600/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
              >
                <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Movie DNA</span>
                <span className="sm:hidden">DNA</span>
              </button>
              <button
                onClick={onShowSmartRecommendations}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg sm:rounded-xl hover:bg-green-600/30 transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Smart Picks</span>
                <span className="sm:hidden">Picks</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Search Results */}
      {showSearchResults && searchQuery.trim() && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-40 overflow-y-auto" onClick={() => setShowSuggestions(false)}>
          {/* Close Button */}
          <button
            onClick={() => onQueryChange('')}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110 border border-red-800/30 z-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="container mx-auto px-4 py-6 sm:py-8 pt-20 sm:pt-24">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {loading ? 'Searching...' : 'Search Results'}
                </h3>
              </div>
              
              <div className="inline-block px-4 py-2 bg-red-900/20 border border-red-800/30 rounded-xl backdrop-blur-sm mb-4">
                <span className="text-red-300 font-semibold">"{searchQuery}"</span>
              </div>
              
              {loading && (
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Finding the perfect movies for you</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
                  <p className="text-red-300 text-lg font-semibold">{error}</p>
                </div>
              )}
              
              {!loading && !error && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center">
                      <span className="text-green-400 font-bold text-sm">{displayResults.length}</span>
                    </div>
                    <span>movies found</span>
                  </div>
                  {displayResults.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>
                        Avg rating: {(displayResults.reduce((sum, m) => sum + m.vote_average, 0) / displayResults.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    onQueryChange('');
                    onSetShowSearchResults(false);
                  }}
                  className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Search
                </button>
                {displayResults.length > 0 && (
                  <button
                    onClick={() => {
                      // Add all results to watchlist
                      displayResults.forEach(movie => {
                        if (!watchlist.some(w => w.id === movie.id)) {
                          onToggleWatchlist(movie);
                        }
                      });
                    }}
                    className="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-600/30 transition-all duration-200 text-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Add All to Watchlist
                  </button>
                )}
              </div>
            </div>
            
            {!loading && !error && displayResults.length > 0 && (
              <div>
                {/* Search Results Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{displayResults.length}</div>
                    <div className="text-red-300 text-sm">Total Results</div>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                      {displayResults.filter(m => m.vote_average >= 8).length}
                    </div>
                    <div className="text-yellow-300 text-sm">Highly Rated</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                      {displayResults.filter(m => new Date(m.release_date).getFullYear() >= 2020).length}
                    </div>
                    <div className="text-green-300 text-sm">Recent (2020+)</div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">
                      {displayResults.filter(m => watchlist.some(w => w.id === m.id)).length}
                    </div>
                    <div className="text-blue-300 text-sm">In Watchlist</div>
                  </div>
                </div>
                
                <MovieGrid
                  movies={displayResults}
                  watchlist={watchlist}
                  onToggleWatchlist={onToggleWatchlist}
                  onMovieClick={onMovieClick}
                  onSocialAdd={onSocialAdd}
                />
              </div>
            )}
            
            {!loading && !error && displayResults.length === 0 && searchQuery.trim() && (
              <div className="text-center py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No Results Found</h3>
                <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
                  We couldn't find any movies matching "{searchQuery}". Try different keywords or explore our suggestions below.
                </p>
                
                {/* Alternative suggestions */}
                <div className="max-w-2xl mx-auto">
                  <h4 className="text-lg font-semibold text-white mb-4">Try searching for:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSuggestions.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 bg-red-900/20 border border-red-800/30 text-red-300 rounded-lg hover:bg-red-900/40 transition-all duration-200 text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Carousel Indicators */}
      {!showSearchResults && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        {trendingMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-red-600 to-red-500 w-6 sm:w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      )}
    </div>
  );
};