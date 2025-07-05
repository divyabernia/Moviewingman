import { useState, useCallback } from 'react';
import { Movie } from '../types/movie';

interface SearchCache {
  [query: string]: {
    results: Movie[];
    timestamp: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSearchCache() {
  const [cache, setCache] = useState<SearchCache>({});

  const getCachedResults = useCallback((query: string): Movie[] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    const cached = cache[normalizedQuery];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.results;
    }
    
    return null;
  }, [cache]);

  const setCachedResults = useCallback((query: string, results: Movie[]) => {
    const normalizedQuery = query.toLowerCase().trim();
    setCache(prev => ({
      ...prev,
      [normalizedQuery]: {
        results,
        timestamp: Date.now()
      }
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return {
    getCachedResults,
    setCachedResults,
    clearCache
  };
}