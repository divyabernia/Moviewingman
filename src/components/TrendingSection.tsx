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
    <section className="py-16 bg-gradient-to-b from-transparent to-red-950/30">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-black text-white">Trending Now</h2>
            </div>
            <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
              Discover what's hot and popular this week across the globe
            </p>
          </div>
        )}

        {!showTitle && (
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Trending This Week</h2>
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