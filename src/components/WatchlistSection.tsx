import React from 'react';
import { BookOpen, Star, Heart, Trophy } from 'lucide-react';
import { MovieGrid } from './MovieGrid';
import { Movie } from '../types/movie';

interface WatchlistSectionProps {
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  watchlist,
  onToggleWatchlist,
  onMovieClick,
}) => {
  const averageRating = watchlist.length > 0 
    ? (watchlist.reduce((sum, movie) => sum + movie.vote_average, 0) / watchlist.length).toFixed(1)
    : '0.0';

  const totalRuntime = watchlist.length * 120; // Estimate 2 hours per movie
  const hoursToWatch = Math.floor(totalRuntime / 60);

  return (
    <section>
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white">My Watchlist</h2>
        </div>
        
        {watchlist.length > 0 ? (
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-black text-white mb-2">{watchlist.length}</div>
              <div className="text-red-300 font-semibold">Movies Saved</div>
            </div>
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-3xl font-black text-white">{averageRating}</span>
              </div>
              <div className="text-red-300 font-semibold">Avg Rating</div>
            </div>
            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-black text-white mb-2">{hoursToWatch}h</div>
              <div className="text-red-300 font-semibold">Watch Time</div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
            Build your personal collection of must-watch movies and never forget what to watch next
          </p>
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