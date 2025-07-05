import React, { useState } from 'react';
import { X, Calendar, MapPin, Star, Film } from 'lucide-react';
import { Person } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface ActorProfileProps {
  person: Person;
  onClose: () => void;
  onMovieClick: (movieId: number) => void;
}

export const ActorProfile: React.FC<ActorProfileProps> = ({
  person,
  onClose,
  onMovieClick,
}) => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>('');

  React.useEffect(() => {
    const url = getImageUrl(person.profile_path);
    setProfileUrl(url);
    
    const img = new Image();
    img.onload = () => setProfileLoaded(true);
    img.onerror = () => setProfileLoaded(true);
    img.src = url;
  }, [person.profile_path]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/300x450/111111/666666?text=No+Image';
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-br from-red-950/90 to-black/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-800/30">
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-xl flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110 border border-red-800/30 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-red-500/30 shadow-2xl mx-auto">
                    {!profileLoaded && (
                      <div className="w-full h-full bg-gray-700 skeleton" />
                    )}
                    <img
                      src={profileUrl}
                      alt={person.name}
                      onError={handleImageError}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        profileLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                      }`}
                      style={{ display: profileLoaded ? 'block' : 'none' }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                    {person.name}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8">
                    {person.birthday && (
                      <div className="flex items-center gap-3 bg-red-900/30 px-4 py-3 rounded-xl backdrop-blur-sm border border-red-800/30">
                        <Calendar className="w-5 h-5 text-red-400" />
                        <span className="text-white font-semibold">
                          Born {new Date(person.birthday).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {person.place_of_birth && (
                      <div className="flex items-center gap-3 bg-red-900/30 px-4 py-3 rounded-xl backdrop-blur-sm border border-red-800/30">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <span className="text-white font-semibold">
                          {person.place_of_birth}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 px-4 py-3 rounded-xl backdrop-blur-sm">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">
                        {person.popularity?.toFixed(1)} popularity
                      </span>
                    </div>
                  </div>

                  {/* Department */}
                  {person.known_for_department && (
                    <div className="mb-8">
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-lg font-semibold backdrop-blur-sm">
                        {person.known_for_department}
                      </span>
                    </div>
                  )}

                  {/* Biography */}
                  {person.biography && (
                    <div className="mb-10">
                      <h3 className="text-2xl font-bold text-white mb-4">Biography</h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {person.biography}
                      </p>
                    </div>
                  )}

                  {/* Known For Movies */}
                  {person.movie_credits?.cast && person.movie_credits.cast.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Film className="w-6 h-6 text-red-400" />
                        Known For
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {person.movie_credits.cast.slice(0, 8).map((movie) => (
                          <div
                            key={movie.id}
                            className="group cursor-pointer"
                            onClick={() => onMovieClick(movie.id)}
                          >
                            <div className="bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 transform hover:scale-105">
                              <img
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                onError={handleImageError}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="p-4">
                                <h4 className="font-bold text-white text-sm line-clamp-2 mb-2">
                                  {movie.title}
                                </h4>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-300">
                                    {getYear(movie.release_date)}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-white font-semibold">
                                      {movie.vote_average.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};