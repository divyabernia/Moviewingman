import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Brain, Zap, RefreshCw, X } from 'lucide-react';
import { aiSommelier, MovieRecommendation } from '../services/openai';
import { Movie } from '../types/movie';
import { searchMovies } from '../services/omdb';

interface SmartRecommendationsProps {
  watchlist: Movie[];
  onMovieClick: (movieId: number) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onClose: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  watchlist,
  onMovieClick,
  onToggleWatchlist,
  onClose,
}) => {
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('general');
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  const moods = [
    { id: 'general', label: 'Surprise Me', icon: Sparkles, color: 'purple' },
    { id: 'happy', label: 'Feel Good', icon: Heart, color: 'pink' },
    { id: 'thoughtful', label: 'Deep Thinking', icon: Brain, color: 'blue' },
    { id: 'exciting', label: 'Adrenaline Rush', icon: Zap, color: 'orange' },
    { id: 'nostalgic', label: 'Classic Vibes', icon: TrendingUp, color: 'green' },
  ];

  useEffect(() => {
    loadRecommendations();
  }, [selectedMood, watchlist]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const result = await aiSommelier.getRecommendations(
        watchlist,
        selectedMood,
        `Looking for ${selectedMood} movies`
      );
      setRecommendations(result.recommendations);
      
      // Try to find actual movie data for recommendations
      const moviePromises = result.recommendations.map(async (rec) => {
        try {
          const searchResults = await searchMovies(rec.title);
          return searchResults[0] || null;
        } catch {
          return null;
        }
      });
      
      const movies = await Promise.all(moviePromises);
      setRecommendedMovies(movies.filter(Boolean));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInWatchlist = (movie: Movie) => 
    watchlist.some(w => w.id === movie.id);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-gradient-to-br from-purple-950/90 to-pink-950/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-purple-800/30">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white">Smart Recommendations</h1>
                    <p className="text-purple-100">AI-powered suggestions based on your taste</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={loadRecommendations}
                    disabled={loading}
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <RefreshCw className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Mood Selector */}
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">What's your mood?</h3>
                <div className="flex flex-wrap gap-3">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                          selectedMood === mood.id
                            ? 'bg-white/20 text-white'
                            : 'text-purple-200 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {mood.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Brain className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Analyzing Your Preferences</h3>
                  <p className="text-gray-300">Finding the perfect movies for you...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* AI Recommendations */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <Brain className="w-6 h-6 text-purple-400" />
                      AI Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="bg-purple-900/30 border border-purple-800/30 rounded-xl p-6 hover:bg-purple-800/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                          onClick={() => {
                            // Try to find and click the movie
                            const movie = recommendedMovies.find(m => 
                              m.title.toLowerCase().includes(rec.title.toLowerCase()) ||
                              rec.title.toLowerCase().includes(m.title.toLowerCase())
                            );
                            if (movie) {
                              onMovieClick(movie.id);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-white text-lg">{rec.title}</h4>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-pink-400" />
                              <span className="text-sm text-purple-200">{rec.confidence}%</span>
                            </div>
                          </div>
                          
                          <p className="text-purple-200 text-sm mb-4 leading-relaxed">{rec.reason}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-700/50 text-purple-200 text-xs rounded-full">
                              {rec.mood}
                            </span>
                            {rec.genre.map((g, i) => (
                              <span key={i} className="px-3 py-1 bg-pink-700/50 text-pink-200 text-xs rounded-full">
                                {g}
                              </span>
                            ))}
                          </div>

                          <div className="w-full bg-purple-900/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${rec.confidence}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Movie Cards */}
                  {recommendedMovies.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        Recommended Movies
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recommendedMovies.map((movie) => (
                          <div
                            key={movie.id}
                            className="group relative bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-800/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:scale-105"
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={movie.poster_path || 'https://via.placeholder.com/300x450/111111/666666?text=No+Image'}
                                alt={movie.title}
                                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                                onClick={() => onMovieClick(movie.id)}
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              
                              {/* Action Buttons */}
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleWatchlist(movie);
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 border ${
                                    isInWatchlist(movie)
                                      ? 'bg-green-600/90 text-white hover:bg-green-700/90 border-green-500/50'
                                      : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 border-purple-500/50'
                                  }`}
                                >
                                  <Heart className={`w-5 h-5 ${isInWatchlist(movie) ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>

                            <div className="p-4">
                              <h4 
                                className="font-bold text-white mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-purple-400 transition-colors"
                                onClick={() => onMovieClick(movie.id)}
                              >
                                {movie.title}
                              </h4>
                              
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-gray-300 text-sm">
                                  {movie.release_date}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-4 h-4 text-yellow-400" />
                                  <span className="text-sm font-bold text-white">
                                    {movie.vote_average.toFixed(1)}
                                  </span>
                                </div>
                              </div>

                              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                                {movie.overview || 'No description available.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};