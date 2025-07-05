import React from 'react';
import { X, Star, Calendar, Clock, Plus, Trash2, Play, Users, Award, Globe, DollarSign, Trophy, Film } from 'lucide-react';
import { MovieDetails as MovieDetailsType, Movie } from '../types/movie';
import { getImageUrl, getYear, formatRuntime } from '../services/omdb';
import { OMDbMovie } from '../services/omdb';

interface MovieDetailsProps {
  movie: MovieDetailsType & { omdbData?: OMDbMovie };
  isInWatchlist: boolean;
  onToggleWatchlist: (movie: Movie) => void;
  onClose: () => void;
  onActorClick: (personId: number) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onClose,
  onActorClick,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x450/111111/666666?text=No+Image';
  };

  const handleToggleWatchlist = () => {
    const movieData: Movie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
      backdrop_path: movie.backdrop_path,
    };
    onToggleWatchlist(movieData);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-br from-red-950/90 to-black/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-800/30">
            {/* Header with backdrop */}
            <div className="relative h-80 md:h-96">
              <img
                src={getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110 border border-red-800/30"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg shadow-red-500/25">
                  <Play className="w-10 h-10 text-white fill-current ml-1" />
                </button>
              </div>
            </div>

            <div className="p-8 md:p-12 -mt-40 relative z-10">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    onError={handleImageError}
                    className="w-64 h-96 object-cover rounded-xl shadow-2xl mx-auto lg:mx-0 border border-red-800/30"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                    {movie.title}
                  </h1>

                  {movie.tagline && (
                    <p className="text-red-400 text-xl italic mb-6 font-semibold">
                      "{movie.tagline}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 px-4 py-3 rounded-xl backdrop-blur-sm">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="font-black text-2xl text-white">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-gray-300 font-semibold">({movie.vote_count?.toLocaleString()} votes)</span>
                    </div>
                    
                    {/* OMDb Rating */}
                    {movie.omdbData?.imdbRating && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 px-4 py-3 rounded-xl backdrop-blur-sm">
                        <Trophy className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">IMDb: {movie.omdbData.imdbRating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 bg-red-900/30 px-4 py-3 rounded-xl backdrop-blur-sm border border-red-800/30">
                      <Calendar className="w-5 h-5 text-red-400" />
                      <span className="text-white font-semibold">{getYear(movie.release_date)}</span>
                    </div>

                    {movie.runtime && (
                      <div className="flex items-center gap-3 bg-red-900/30 px-4 py-3 rounded-xl backdrop-blur-sm border border-red-800/30">
                        <Clock className="w-5 h-5 text-red-400" />
                        <span className="text-white font-semibold">{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm font-semibold backdrop-blur-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 mb-10">
                    <button
                      onClick={handleToggleWatchlist}
                      className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-200 transform hover:scale-105 ${
                        isInWatchlist
                          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/25'
                          : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/25'
                      }`}
                    >
                      {isInWatchlist ? (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Remove from Watchlist
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add to Watchlist
                        </>
                      )}
                    </button>

                    <button className="px-8 py-4 bg-black/40 backdrop-blur-sm text-white rounded-xl font-bold flex items-center gap-3 hover:bg-black/60 transition-all duration-200 border border-red-800/30">
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </button>
                  </div>

                  {/* Overview */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.overview || movie.omdbData?.Plot || 'No overview available.'}
                    </p>
                  </div>

                  {/* OMDb Additional Info */}
                  {movie.omdbData && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-white mb-6">Additional Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {movie.omdbData.Director && (
                          <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-red-800/30">
                            <h4 className="font-bold text-white mb-2">Director</h4>
                            <p className="text-gray-300">{movie.omdbData.Director}</p>
                          </div>
                        )}
                        {movie.omdbData.Actors && (
                          <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-red-800/30">
                            <h4 className="font-bold text-white mb-2">Main Cast</h4>
                            <p className="text-gray-300">{movie.omdbData.Actors}</p>
                          </div>
                        )}
                        {movie.omdbData.Awards && movie.omdbData.Awards !== 'N/A' && (
                          <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-red-800/30">
                            <h4 className="font-bold text-white mb-2">Awards</h4>
                            <p className="text-gray-300">{movie.omdbData.Awards}</p>
                          </div>
                        )}
                        {movie.omdbData.BoxOffice && movie.omdbData.BoxOffice !== 'N/A' && (
                          <div className="bg-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-red-800/30">
                            <h4 className="font-bold text-white mb-2">Box Office</h4>
                            <p className="text-gray-300">{movie.omdbData.BoxOffice}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cast Section */}
                  {movie.credits?.cast && movie.credits.cast.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-white mb-6">Cast</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {movie.credits.cast.slice(0, 10).map((actor) => (
                          <div
                            key={actor.id}
                            className="flex-shrink-0 w-32 cursor-pointer group"
                            onClick={() => onActorClick(actor.id)}
                          >
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                              <img
                                src={getImageUrl(actor.profile_path)}
                                alt={actor.name}
                                onError={handleImageError}
                                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="p-3">
                                <h4 className="font-bold text-white text-sm line-clamp-2 mb-1">
                                  {actor.name}
                                </h4>
                                <p className="text-gray-400 text-xs line-clamp-2">
                                  {actor.character}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {movie.budget && movie.budget > 0 && (
                      <div className="bg-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-red-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-white">Budget</h4>
                        </div>
                        <p className="text-gray-300 text-lg font-semibold">
                          ${movie.budget.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {movie.revenue && movie.revenue > 0 && (
                      <div className="bg-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-red-800/30">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <h4 className="font-bold text-white">Revenue</h4>
                        </div>
                        <p className="text-gray-300 text-lg font-semibold">
                          ${movie.revenue.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {movie.production_companies && movie.production_companies.length > 0 && (
                        </p>
                      </div>
                    )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};