import React, { useState } from 'react';
import { X, Users, Heart, UserPlus, Check, Plus } from 'lucide-react';
import { Movie, SocialCategory, Friend } from '../types/movie';

interface SocialWatchlistModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  onAddToWatchlist: (movie: Movie, categories: string[], taggedFriends: string[]) => void;
  friends: Friend[];
  onAddFriend: (friend: Omit<Friend, 'id'>) => void;
}

const SOCIAL_CATEGORIES: SocialCategory[] = [
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'blue' },
  { id: 'friends', name: 'Friends', icon: '👥', color: 'green' },
  { id: 'spouse', name: 'Spouse', icon: '💕', color: 'pink' },
];

export const SocialWatchlistModal: React.FC<SocialWatchlistModalProps> = ({
  movie,
  isOpen,
  onClose,
  onAddToWatchlist,
  friends,
  onAddFriend,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendCategory, setNewFriendCategory] = useState<'Family' | 'Friends' | 'Spouse'>('Friends');

  if (!isOpen) return null;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      onAddFriend({
        name: newFriendName.trim(),
        category: newFriendCategory,
      });
      setNewFriendName('');
      setShowAddFriend(false);
    }
  };

  const handleAddToWatchlist = () => {
    onAddToWatchlist(movie, selectedCategories, selectedFriends);
    onClose();
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'from-blue-600/20 to-blue-500/20 border-blue-500/30 text-blue-300',
      green: 'from-green-600/20 to-green-500/20 border-green-500/30 text-green-300',
      pink: 'from-pink-600/20 to-pink-500/20 border-pink-500/30 text-pink-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getFriendsByCategory = (category: 'Family' | 'Friends' | 'Spouse') => {
    return friends.filter(friend => friend.category === category);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-red-950/90 to-black/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-red-800/30">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add to Social Watchlist</h2>
                <p className="text-red-100 text-sm">Choose categories and tag friends</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Movie Info */}
          <div className="flex items-center gap-4 p-4 bg-red-900/20 rounded-xl border border-red-800/30">
            <img
              src={movie.poster_path || 'https://via.placeholder.com/80x120/111111/666666?text=No+Image'}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-bold text-white text-lg">{movie.title}</h3>
              <p className="text-gray-300 text-sm">{movie.release_date}</p>
              <div className="flex items-center gap-2 mt-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-400" />
              Select Categories
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {SOCIAL_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    selectedCategories.includes(category.id)
                      ? `bg-gradient-to-r ${getCategoryColor(category.color)} border-opacity-50`
                      : 'bg-red-900/20 border-red-800/30 text-gray-300 hover:bg-red-800/30'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold">{category.name}</div>
                  {selectedCategories.includes(category.id) && (
                    <Check className="w-4 h-4 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Friends */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-400" />
                Tag Friends
              </h3>
              <button
                onClick={() => setShowAddFriend(true)}
                className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-600/30 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Friend
              </button>
            </div>

            {/* Add Friend Form */}
            {showAddFriend && (
              <div className="mb-4 p-4 bg-red-900/20 rounded-xl border border-red-800/30">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Friend's name"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    className="w-full px-3 py-2 bg-red-950/30 border border-red-800/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <select
                    value={newFriendCategory}
                    onChange={(e) => setNewFriendCategory(e.target.value as 'Family' | 'Friends' | 'Spouse')}
                    className="w-full px-3 py-2 bg-red-950/30 border border-red-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    <option value="Friends">Friends</option>
                    <option value="Family">Family</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddFriend}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddFriend(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Friends by Category */}
            {SOCIAL_CATEGORIES.map((category) => {
              const categoryFriends = getFriendsByCategory(category.name);
              if (categoryFriends.length === 0) return null;

              return (
                <div key={category.id} className="mb-4">
                  <h4 className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categoryFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => handleFriendToggle(friend.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                          selectedFriends.includes(friend.id)
                            ? `bg-gradient-to-r ${getCategoryColor(category.color)} border-opacity-50`
                            : 'bg-red-900/20 border-red-800/30 text-gray-300 hover:bg-red-800/30'
                        }`}
                      >
                        <div className="font-semibold">{friend.name}</div>
                        {selectedFriends.includes(friend.id) && (
                          <Check className="w-4 h-4 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {friends.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No friends added yet. Add some friends to tag them!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-red-800/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToWatchlist}
            disabled={selectedCategories.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};