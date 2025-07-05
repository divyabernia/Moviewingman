import React, { useState } from 'react';
import { Users, Filter, Search, Heart, Calendar, Star } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white">Social Watchlist</h2>
        </div>
        <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
          Movies organized by categories and tagged friends
        </p>
      </div>

      {/* Filters */}
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-800/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-red-950/30 border border-red-800/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-red-950/30 border border-red-800/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
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
            className="px-4 py-3 bg-red-950/30 border border-red-800/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <option value="all">All Friends</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name} ({friend.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group relative bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 transform hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => onMovieClick(movie.id)}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Categories */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {movie.categories.map((categoryId) => (
                    <span
                      key={categoryId}
                      className="text-xs px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full border border-red-800/30"
                    >
                      {getCategoryIcon(categoryId)}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 border border-red-800/30">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 
                  className="font-bold text-white mb-2 line-clamp-2 leading-tight cursor-pointer hover:text-red-400 transition-colors"
                  onClick={() => onMovieClick(movie.id)}
                >
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium">
                      {getYear(movie.release_date)}
                    </span>
                  </div>
                </div>

                {/* Tagged Friends */}
                {movie.taggedFriends.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {movie.taggedFriends.slice(0, 3).map((friendId) => (
                        <span
                          key={friendId}
                          className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded-full border border-red-800/30"
                        >
                          {getFriendName(friendId)}
                        </span>
                      ))}
                      {movie.taggedFriends.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded-full border border-red-800/30">
                          +{movie.taggedFriends.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {movie.categories.map((categoryId) => {
                    const category = SOCIAL_CATEGORIES.find(c => c.id === categoryId);
                    return (
                      <span
                        key={categoryId}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          category ? getCategoryColor(category.color) : 'bg-gray-600/20 border-gray-500/30 text-gray-300'
                        }`}
                      >
                        {getCategoryName(categoryId)}
                      </span>
                    );
                  })}
                </div>

                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                  {movie.overview || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-800/30">
            <Users className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">No movies found</h3>
          <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
            Try adjusting your filters or add some movies to your social watchlist
          </p>
        </div>
      )}
    </div>
  );
};