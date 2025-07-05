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
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white">Search Results</h2>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={(e) => { e.preventDefault(); onManualSearch(); }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for movies, actors, directors..."
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full pl-14 pr-32 py-5 bg-red-950/30 border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 text-lg"
              />
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <VoiceSearchButton onTranscription={handleVoiceTranscription} />
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim() || loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>

        {searchQuery && (
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <p className="text-red-300 text-lg font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
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
        <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-8 mb-12 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h3 className="text-xl font-bold text-red-300">Search Error</h3>
          </div>
          <p className="text-red-300 text-lg font-semibold">
            {error}
          </p>
          <button
            onClick={() => onQueryChange(searchQuery)}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Searching for movies...</p>
          </div>
        </div>
      )}

      {!loading && searchQuery && !error && (
        <MovieGrid
          movies={searchResults}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          onMovieClick={onMovieClick}
        />
      )}

      {!searchQuery && !loading && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
            <Sparkles className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Discover Amazing Movies</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
            Use the search bar above to find your next favorite movie, discover new releases, or explore by actor and director
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'].map((genre) => (
              <button
                key={genre}
                onClick={() => onQueryChange(genre)}
                className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm font-semibold backdrop-blur-sm hover:from-red-600/30 hover:to-red-500/30 transition-all duration-200"
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