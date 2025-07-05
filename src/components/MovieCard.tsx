import React from 'react';
import { Star, Plus, Check, Trash2, Calendar, Eye, Heart } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  showRemoveButton?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
  showRemoveButton = false,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x450/111111/666666?text=No+Image';
  };

  return (
    <div className="group relative">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 transform hover:scale-105">
        <div className="relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            onError={handleImageError}
            className="w-full h-80 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            onClick={() => onMovieClick(movie.id)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 border border-red-800/30">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-bold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMovieClick(movie.id);
              }}
              className="w-12 h-12 bg-black/80 backdrop-blur-sm text-white rounded-xl flex items-center justify-center hover:bg-red-600/80 transition-all duration-200 transform hover:scale-110 border border-red-800/30"
            >
              <Eye className="w-5 h-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie);
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 border ${
                isInWatchlist
                  ? showRemoveButton
                    ? 'bg-red-600/90 text-white hover:bg-red-700/90 border-red-500/50'
                    : 'bg-green-600/90 text-white hover:bg-green-700/90 border-green-500/50'
                  : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 border-red-500/50'
              }`}
            >
              {isInWatchlist ? (
                showRemoveButton ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <Check className="w-5 h-5" />
                )
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="p-6">
          <h3 
            className="font-bold text-xl text-white mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-red-400 transition-colors"
            onClick={() => onMovieClick(movie.id)}
          >
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">
                {getYear(movie.release_date)}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-red-900/30 px-3 py-1 rounded-full border border-red-800/30">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {movie.overview || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};