import React, { useState } from 'react';
import { Users, Filter, Search, Heart, Calendar, Star, Trash2, X, RotateCcw } from 'lucide-react';
import { SocialWatchlistItem, SocialCategory, Friend } from '../types/movie';
import { getImageUrl, getYear } from '../services/omdb';

interface SocialWatchlistViewProps {
  socialWatchlist: SocialWatchlistItem[];
  friends: Friend[];
  onMovieClick: (movieId: number) => void;
  onRemoveFromWatchlist: (movieId: number) => void;
}

const SOCIAL_CATEGORIES: SocialCategory[] = [
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'blue' },
  { id: 'friends', name: 'Friends', icon: '👥', color: 'green' },
  { id: 'spouse', name: 'Spouse', icon: '💕', color: 'pink' },
];

export const SocialWatchlistView: React.FC<SocialWatchlistViewProps> = ({
  socialWatchlist,
  friends,
  onMovieClick,
  onRemoveFromWatchlist,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFriend, setSelectedFriend] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = socialWatchlist.filter(movie => {
    const matchesCategory = selectedCategory === 'all' || movie.categories.includes(selectedCategory);
    const matchesFriend = selectedFriend === 'all' || movie.taggedFriends.includes(selectedFriend);
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesFriend && matchesSearch;
  });

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'from-blue-600/20 to-blue-500/20 border-blue-500/30 text-blue-300',
      green: 'from-green-600/20 to-green-500/20 border-green-500/30 text-green-300',
      pink: 'from-pink-600/20 to-pink-500/20 border-pink-500/30 text-pink-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getFriendName = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    return friend?.name || 'Unknown';
  };

  const getCategoryName = (categoryId: string) => {
    const category = SOCIAL_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = SOCIAL_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || '📁';
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedFriend('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedFriend !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Social Watchlist</h2>
        </div>
        <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
          Movies organized by categories and tagged friends
        </p>
      </div>

      {/* Filters */}
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-red-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 sm:gap-0">
          <h3 className="text-white font-semibold flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 sm:px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg sm:rounded-xl hover:bg-red-600/30 transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-red-950/30 border border-red-800/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm sm:text-base"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-red-950/30 border border-red-800/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm sm:text-base"
          >
            <option value="all">All Categories</option>
            {SOCIAL_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* Friend Filter */}
          <select
            value={selectedFriend}
            onChange={(e) => setSelectedFriend(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-red-950/30 border border-red-800/50 rounded-lg sm:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm sm:text-base"
          >
            <option value="all">All Friends</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name} ({friend.category})
              </option>
            ))}
          </select>
        </div>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-red-800/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-red-300 text-xs sm:text-sm font-medium">Active filters:</span>
              {searchQuery.trim() && (
                <span className="px-2 sm:px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-blue-100 transition-colors"
                  >
                    <X className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-2 sm:px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  Category: {getCategoryName(selectedCategory)}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-purple-100 transition-colors"
                  >
                    <X className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </span>
              )}
              {selectedFriend !== 'all' && (
                <span className="px-2 sm:px-3 py-1 bg-green-600/20 border border-green-500/30 text-green-300 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                  Friend: {getFriendName(selectedFriend)}
                  <button
                    onClick={() => setSelectedFriend('all')}
                    className="hover:text-green-100 transition-colors"
                  >
                    <X className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative bg-black/50 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 transform hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => onMovieClick(movie.id)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Categories */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1">
                  {movie.categories.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-black/80 backdrop-blur-sm rounded-full border border-red-800/30"
                    >
                      {getCategoryIcon(categoryId)}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 border border-red-800/30">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
                {/* Delete Button */}
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(movie.id);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-600/90 backdrop-blur-sm text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-700/90 transition-all duration-200 transform hover:scale-110 border border-red-500/50 shadow-lg shadow-red-500/25"
                    title="Remove from social watchlist"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>

              <div className="p-2 sm:p-3 md:p-4">
                <h3 
                  className="font-bold text-white mb-1 sm:mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-red-400 transition-colors text-sm sm:text-base"
                  onClick={() => onMovieClick(movie.id)}
                >
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                    <span className="text-xs sm:text-sm font-medium">
                      {getYear(movie.release_date)}
                    </span>
                  </div>
                </div>

                {/* Tagged Friends */}
                {movie.taggedFriends.length > 0 && (
                  <div className="mb-2 sm:mb-3">
                    <div className="flex flex-wrap gap-1">
                      {movie.taggedFriends.slice(0, 3).map((friendId) => (
                        <span
                          key={friendId}
                          className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-red-900/30 text-red-300 rounded-full border border-red-800/30"
                        >
                          {getFriendName(friendId)}
                        </span>
                      ))}
                      {movie.taggedFriends.length > 3 && (
                        <span className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-red-900/30 text-red-300 rounded-full border border-red-800/30">
                          +{movie.taggedFriends.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                  {movie.categories.map((categoryId) => {
                    const category = SOCIAL_CATEGORIES.find(c => c.id === categoryId);
                    return (
                      <span
                        key={categoryId}
                        className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full border ${
                          category ? getCategoryColor(category.color) : 'bg-gray-600/20 border-gray-500/30 text-gray-300'
                        }`}
                      >
                        {getCategoryName(categoryId)}
                      </span>
                    );
                  })}
                </div>

                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {movie.overview || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 md:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-red-800/30">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">No movies found</h3>
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto leading-relaxed px-4">
            Try adjusting your filters or add some movies to your social watchlist
          </p>
        </div>
      )}
    </div>
  );
};