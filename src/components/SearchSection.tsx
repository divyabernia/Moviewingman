import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, Filter, SortAsc, SortDesc, Calendar, Star, TrendingUp, Clock } from 'lucide-react';
import { VoiceSearchButton } from './VoiceSearchButton';
import { MovieGrid } from './MovieGrid';
import { Movie } from '../types/movie';

interface SearchSectionProps {
  searchQuery: string;
  searchResults: Movie[];
  watchlist: Movie[];
  loading: boolean;
  error: string | null;
  onQueryChange: (query: string) => void;
  onManualSearch: () => void;
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  onSocialAdd?: (movie: Movie) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  searchResults,
  watchlist,
  loading,
  error,
  onQueryChange,
  onManualSearch,
  onToggleWatchlist,
  onMovieClick,
  onSocialAdd,
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'year' | 'popularity'>('relevance');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'classic' | 'highly_rated'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular search suggestions
  const popularSuggestions = [
    'Marvel movies', 'Christopher Nolan', 'Action thriller', 'Romantic comedy',
    'Horror 2024', 'Best drama', 'Sci-fi adventure', 'Tom Hanks',
    'Disney animated', 'Crime thriller', 'Fantasy epic', 'Comedy 2023'
  ];

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = popularSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Filter and sort movies
  const processedResults = React.useMemo(() => {
    let filtered = [...searchResults];

    // Apply filters
    switch (filterBy) {
      case 'recent':
        filtered = filtered.filter(movie => new Date(movie.release_date).getFullYear() >= 2020);
        break;
      case 'classic':
        filtered = filtered.filter(movie => new Date(movie.release_date).getFullYear() < 2000);
        break;
      case 'highly_rated':
        filtered = filtered.filter(movie => movie.vote_average >= 7.5);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => sortOrder === 'desc' ? b.vote_average - a.vote_average : a.vote_average - b.vote_average);
        break;
      case 'year':
        filtered.sort((a, b) => {
          const yearA = new Date(a.release_date).getFullYear();
          const yearB = new Date(b.release_date).getFullYear();
          return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => sortOrder === 'desc' ? (b.vote_count || 0) - (a.vote_count || 0) : (a.vote_count || 0) - (b.vote_count || 0));
        break;
    }

    return filtered;
  }, [searchResults, sortBy, filterBy, sortOrder]);
  const handleVoiceTranscription = (transcription: string) => {
    if (transcription.trim()) {
      onQueryChange(transcription);
      // Trigger search immediately after voice input
      setTimeout(() => {
        onManualSearch();
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    setShowSuggestions(false);
    setTimeout(() => onManualSearch(), 100);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <section>
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Search Results</h2>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          <form onSubmit={(e) => { e.preventDefault(); onManualSearch(); }}>
            <div className="relative mb-4">
              <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
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
                className="w-full pl-10 sm:pl-14 pr-32 sm:pr-40 py-3 sm:py-4 md:py-5 bg-red-950/30 border border-red-800/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-base sm:text-lg"
              />
              <div className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2">
                <VoiceSearchButton onTranscription={handleVoiceTranscription} />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-20 sm:right-24 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  showFilters ? 'bg-red-600/80 text-white' : 'bg-red-600/20 text-red-400 hover:bg-red-600/40'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!searchQuery.trim() || loading}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
              
              {/* Search Suggestions */}
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
            
            {/* Filters and Sorting */}
            {showFilters && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-red-300 text-sm font-semibold mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-red-950/50 border border-red-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="year">Release Year</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                  
                  {/* Filter By */}
                  <div>
                    <label className="block text-red-300 text-sm font-semibold mb-2">Filter By</label>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-red-950/50 border border-red-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                    >
                      <option value="all">All Movies</option>
                      <option value="recent">Recent (2020+)</option>
                      <option value="classic">Classic (Pre-2000)</option>
                      <option value="highly_rated">Highly Rated (7.5+)</option>
                    </select>
                  </div>
                  
                  {/* Sort Order */}
                  <div>
                    <label className="block text-red-300 text-sm font-semibold mb-2">Order</label>
                    <button
                      onClick={toggleSortOrder}
                      className="w-full px-3 py-2 bg-red-950/50 border border-red-800/50 rounded-lg text-white hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                      {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {searchQuery && (
          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-red-300 text-base sm:text-lg font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-red-400 border-t-transparent"></div>
                  Searching for "{searchQuery}"...
                </span>
              ) : (
                `Found ${processedResults.length} of ${searchResults.length} results for "${searchQuery}"`
              )}
              </p>
              {!loading && processedResults.length !== searchResults.length && (
                <span className="text-xs text-red-400 bg-red-900/30 px-2 py-1 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 sm:p-8 mb-8 sm:mb-12 text-center backdrop-blur-sm mx-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            <h3 className="text-lg sm:text-xl font-bold text-red-300">Search Error</h3>
          </div>
          <p className="text-red-300 text-base sm:text-lg font-semibold">
            {error}
          </p>
          <button
            onClick={() => onQueryChange(searchQuery)}
            className="mt-4 px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300 text-base sm:text-lg">Searching for movies...</p>
          </div>
        </div>
      )}

      {!loading && searchQuery && !error && (
        <div>
          {/* Results Summary */}
          {processedResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{processedResults.length}</div>
                <div className="text-red-300 text-sm">Results</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {processedResults.length > 0 ? (processedResults.reduce((sum, m) => sum + m.vote_average, 0) / processedResults.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-yellow-300 text-sm">Avg Rating</div>
              </div>
              <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {processedResults.filter(m => new Date(m.release_date).getFullYear() >= 2020).length}
                </div>
                <div className="text-green-300 text-sm">Recent</div>
              </div>
              <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {processedResults.filter(m => watchlist.some(w => w.id === m.id)).length}
                </div>
                <div className="text-blue-300 text-sm">In Watchlist</div>
              </div>
            </div>
          )}
          
          <MovieGrid
            movies={processedResults}
            watchlist={watchlist}
            onToggleWatchlist={onToggleWatchlist}
            onMovieClick={onMovieClick}
            onSocialAdd={onSocialAdd}
          />
        </div>
      )}

      {!searchQuery && !loading && (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-red-800/30">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">Discover Amazing Movies</h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
            Use the search bar above to find your next favorite movie, discover new releases, or explore by actor and director
          </p>
          <div className="mt-6 sm:mt-8">
            <h4 className="text-lg font-semibold text-white mb-4">Popular Searches</h4>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            {popularSuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-sm hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200 transform hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};