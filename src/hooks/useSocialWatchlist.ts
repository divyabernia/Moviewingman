import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Movie, SocialWatchlistItem, Friend } from '../types/movie';

export const useSocialWatchlist = () => {
  const [socialWatchlist, setSocialWatchlist] = useLocalStorage<SocialWatchlistItem[]>('social-watchlist', []);
  const [friends, setFriends] = useLocalStorage<Friend[]>('friends-list', []);

  const addToSocialWatchlist = useCallback((
    movie: Movie, 
    categories: string[], 
    taggedFriends: string[]
  ) => {
    const socialItem: SocialWatchlistItem = {
      ...movie,
      categories,
      taggedFriends,
      dateAdded: new Date().toISOString(),
    };

    setSocialWatchlist(prev => {
      const exists = prev.find(item => item.id === movie.id);
      if (exists) {
        // Update existing item
        return prev.map(item => 
          item.id === movie.id 
            ? { ...item, categories, taggedFriends }
            : item
        );
      } else {
        // Add new item
        return [...prev, socialItem];
      }
    });
  }, [setSocialWatchlist]);

  const removeFromSocialWatchlist = useCallback((movieId: number) => {
    setSocialWatchlist(prev => prev.filter(item => item.id !== movieId));
  }, [setSocialWatchlist]);

  const addFriend = useCallback((friend: Omit<Friend, 'id'>) => {
    const newFriend: Friend = {
      ...friend,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setFriends(prev => [...prev, newFriend]);
  }, [setFriends]);

  const removeFriend = useCallback((friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    // Also remove friend tags from watchlist items
    setSocialWatchlist(prev => 
      prev.map(item => ({
        ...item,
        taggedFriends: item.taggedFriends.filter(id => id !== friendId)
      }))
    );
  }, [setFriends, setSocialWatchlist]);

  const isInSocialWatchlist = useCallback((movieId: number) => {
    return socialWatchlist.some(item => item.id === movieId);
  }, [socialWatchlist]);

  return {
    socialWatchlist,
    friends,
    addToSocialWatchlist,
    removeFromSocialWatchlist,
    addFriend,
    removeFriend,
    isInSocialWatchlist,
  };
};