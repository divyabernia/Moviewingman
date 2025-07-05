import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types/movie';
import { Film, Search, Heart } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  watchlist: Movie[];
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  showRemoveButton?: boolean;
  onSocialAdd?: (movie: Movie) => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  watchlist,
  onToggleWatchlist,
  onMovieClick,
  showRemoveButton = false,
  onSocialAdd,
}) => {
  const isInWatchlist = (movie: Movie) => 
    watchlist.some(w => w.id === movie.id);

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-red-800/30">
          {showRemoveButton ? (
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
          ) : (
            <Search className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">
          {showRemoveButton ? "Your watchlist is empty" : "No movies found"}
        </h3>
        <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
          {showRemoveButton 
            ? "Start building your collection by searching for movies and adding them to your watchlist!"
            : "Try adjusting your search terms or explore our trending movies instead."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isInWatchlist={isInWatchlist(movie)}
          onToggleWatchlist={onToggleWatchlist}
          onMovieClick={onMovieClick}
          showRemoveButton={showRemoveButton}
          onSocialAdd={onSocialAdd}
        />
      ))}
    </div>
  );
};