import React from 'react';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
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
  const handleVoiceTranscription = (transcription: string) => {
    if (transcription.trim()) {
      onQueryChange(transcription);
      // Trigger search immediately after voice input
      setTimeout(() => {
        onManualSearch();
      }, 100);
    }
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
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search for movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full pl-10 sm:pl-14 pr-24 sm:pr-32 py-3 sm:py-4 md:py-5 bg-red-950/30 border border-red-800/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-base sm:text-lg"
              />
              <div className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2">
                <VoiceSearchButton onTranscription={handleVoiceTranscription} />
              </div>
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
          </form>
        </div>

        {searchQuery && (
          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg sm:rounded-xl backdrop-blur-sm">
            <p className="text-red-300 text-base sm:text-lg font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-red-400 border-t-transparent"></div>
                  Searching for "{searchQuery}"...
                </span>
              ) : (
                `Found ${searchResults.length} results for "${searchQuery}"`
              )}
            </p>
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
        <MovieGrid
          movies={searchResults}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          onMovieClick={onMovieClick}
          onSocialAdd={onSocialAdd}
        />
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
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
            {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'].map((genre) => (
              <button
                key={genre}
                onClick={() => onQueryChange(genre)}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-sm hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};