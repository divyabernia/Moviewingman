import React from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import { MovieGrid } from './MovieGrid';
import { Movie } from '../types/movie';

interface TrendingSectionProps {
  movies: Movie[];
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  showTitle?: boolean;
  onSocialAdd?: (movie: Movie) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onMovieClick,
  showTitle = false,
  onSocialAdd,
}) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-transparent to-red-950/30">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Trending Now</h2>
            </div>
            <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
              Discover what's hot and popular this week across the globe
            </p>
          </div>
        )}

        {!showTitle && (
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending This Week</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
          </div>
        )}

        <MovieGrid
          movies={movies}
          watchlist={watchlist}
          onToggleWatchlist={onToggleWatchlist}
          onMovieClick={onMovieClick}
          onSocialAdd={onSocialAdd}
        />
      </div>
    </section>
  );
};