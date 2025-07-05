import React, { useState } from 'react';
import { Star, Plus, Check, Trash2, Calendar, Eye, Heart, Users } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onMovieClick: (movieId: number) => void;
  showRemoveButton?: boolean;
  onSocialAdd?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
  showRemoveButton = false,
  onSocialAdd,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x450/111111/666666?text=No+Image';
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="group relative">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 transform hover:scale-105">
        <div className="relative overflow-hidden">
          {/* Image placeholder to prevent layout shift */}
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-800 flex items-center justify-center">
            {!imageLoaded && !imageError && (
              <div className="animate-pulse bg-gray-700 w-full h-full flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            onError={handleImageError}
              onLoad={handleImageLoad}
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 cursor-pointer ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={() => onMovieClick(movie.id)}
              loading="lazy"
          />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 border border-red-800/30">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="text-white text-xs sm:text-sm font-bold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMovieClick(movie.id);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/80 backdrop-blur-sm text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-600/80 transition-all duration-200 transform hover:scale-110 border border-red-800/30"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
            
            {onSocialAdd && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSocialAdd(movie);
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:from-purple-700 hover:to-purple-600 transition-all duration-200 transform hover:scale-110 border border-purple-500/50"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie);
              }}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 border ${
                isInWatchlist
                  ? showRemoveButton
                    ? 'bg-red-600/90 text-white hover:bg-red-700/90 border-red-500/50'
                    : 'bg-green-600/90 text-white hover:bg-green-700/90 border-green-500/50'
                  : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 border-red-500/50'
              }`}
            >
              {isInWatchlist ? (
                showRemoveButton ? (
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                ) : (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                )
              ) : (
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <h3 
            className="font-bold text-base sm:text-lg md:text-xl text-white mb-2 sm:mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-red-400 transition-colors"
            onClick={() => onMovieClick(movie.id)}
          >
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              <span className="text-xs sm:text-sm font-medium">
                {getYear(movie.release_date)}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-red-900/30 px-2 sm:px-3 py-1 rounded-full border border-red-800/30">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm font-bold text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {movie.overview || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
};