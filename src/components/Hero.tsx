import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Calendar, Search } from 'lucide-react';
import { VoiceSearchButton } from './VoiceSearchButton';
import { Movie } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface HeroProps {
  trendingMovies: Movie[];
  onMovieClick: (movieId: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ trendingMovies, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [trendingMovies.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Trigger search by dispatching custom event
      const searchEvent = new CustomEvent('heroSearch', { detail: searchQuery });
      window.dispatchEvent(searchEvent);
      setSearchQuery(''); // Clear the search input after submitting
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    // Auto-trigger search after voice input
    const searchEvent = new CustomEvent('heroSearch', { detail: transcription });
    window.dispatchEvent(searchEvent);
  };

  if (trendingMovies.length === 0) {
    return (
      <div className="relative h-[60vh] bg-gradient-to-br from-red-900 via-black to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
            <Search className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Welcome to CineVault</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed mb-8">
            Your ultimate movie watchlist and discovery platform
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for movies, actors, directors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = trendingMovies[currentIndex];

  return (
    <div className="relative h-[85vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Search Bar */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search for movies, actors, directors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-black/40 backdrop-blur-sm border border-red-800/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-white placeholder-gray-400 transition-all duration-200 text-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <VoiceSearchButton onTranscription={handleVoiceTranscription} />
                  </div>
                </div>
              </form>
            </div>

            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm font-semibold backdrop-blur-sm">
                #1 Trending This Week
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 text-white leading-tight">
              {currentMovie.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-8 text-gray-300">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-red-800/30">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold text-lg text-white">{currentMovie.vote_average.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-red-800/30">
                <Calendar className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-white">{getYear(currentMovie.release_date)}</span>
              </div>
            </div>

            <p className="text-xl text-gray-200 mb-10 leading-relaxed line-clamp-3 max-w-2xl">
              {currentMovie.overview}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => onMovieClick(currentMovie.id)}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:scale-105"
              >
                <Info className="w-6 h-6" />
                More Details
              </button>
              <button className="bg-black/40 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-black/60 transition-all duration-200 border border-red-800/30">
                <Play className="w-6 h-6" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {trendingMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-red-600 to-red-500 w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};