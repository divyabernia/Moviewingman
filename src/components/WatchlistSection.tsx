import React from 'react';
import { BookOpen, Star, Heart, Trophy, Brain, Zap, Dna } from 'lucide-react';
import { MovieGrid } from './MovieGrid';
import { Movie } from '../types/movie';

interface WatchlistSectionProps {
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  onShowMovieDNA: () => void;
  onShowSmartRecommendations: () => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlist,
  onToggleWatchlist,
  onMovieClick,
  onShowMovieDNA,
  onShowSmartRecommendations,
}) => {
  const averageRating = watchlist.length > 0 
    ? (watchlist.reduce((sum, movie) => sum + movie.vote_average, 0) / watchlist.length).toFixed(1)
    : '0.0';

  const totalRuntime = watchlist.length * 120; // Estimate 2 hours per movie
  const hoursToWatch = Math.floor(totalRuntime / 60);

  return (
    <section>
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">My Watchlist</h2>
        </div>
        
        {watchlist.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">{watchlist.length}</div>
              <div className="text-red-300 font-semibold text-sm sm:text-base">Movies Saved</div>
            </div>
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                <span className="text-2xl sm:text-3xl font-black text-white">{averageRating}</span>
              </div>
              <div className="text-red-300 font-semibold text-sm sm:text-base">Avg Rating</div>
            </div>
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">{hoursToWatch}h</div>
              <div className="text-red-300 font-semibold text-sm sm:text-base">Watch Time</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
            Build your personal collection of must-watch movies and never forget what to watch next
          </p>
        )}

        {/* AI Features */}
        {watchlist.length > 0 && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={onShowMovieDNA}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 rounded-lg sm:rounded-xl hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105 text-sm sm:text-base"
            >
              <Dna className="w-4 h-4 sm:w-5 sm:h-5" />
              Analyze Movie DNA
            </button>
            <button
              onClick={onShowSmartRecommendations}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 rounded-lg sm:rounded-xl hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105 text-sm sm:text-base"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
              Get AI Recommendations
            </button>
          </div>
        )}
      </div>

      <MovieGrid
        movies={watchlist}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
        onMovieClick={onMovieClick}
        showRemoveButton={true}
      />
    </section>
  );
};