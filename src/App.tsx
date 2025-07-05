import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchSection } from './components/SearchSection';
import { WatchlistSection } from './components/WatchlistSection';
import { MovieDetails } from './components/MovieDetails';
import { TrendingSection } from './components/TrendingSection';
import { ActorProfile } from './components/ActorProfile';
import { LoginScreen } from './components/LoginScreen';
import { useLocalStorage } from './hooks/useLocalStorage';
import { searchMovies, getTrendingMovies, getMovieDetails, getPersonDetails } from './services/omdb';
import { Movie, MovieDetails as MovieDetailsType, Person } from './types/movie';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'watchlist' | 'trending'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('movie-watchlist', []);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsType | null>(null);
  const [selectedActor, setSelectedActor] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('user-logged-in', false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrendingMovies = useCallback(async () => {
    try {
      setLoading(true);
      const trending = await getTrendingMovies();
      setTrendingMovies(trending);
    } catch (err) {
      console.error('Failed to load trending movies:', err);
      setError('Failed to load trending movies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadTrendingMovies();
      
      // Listen for hero search events
      const handleHeroSearch = (event: CustomEvent) => {
        const query = event.detail;
        setSearchQuery(query);
        setCurrentView('search');
      };
      
      window.addEventListener('heroSearch', handleHeroSearch as EventListener);
      
      return () => {
        window.removeEventListener('heroSearch', handleHeroSearch as EventListener);
      };
    }
  }, [loadTrendingMovies, isLoggedIn]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleToggleWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      const isInWatchlist = prev.some(w => w.id === movie.id);
      
      if (isInWatchlist) {
        return prev.filter(w => w.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleMovieClick = async (movieId: number) => {
    try {
      const details = await getMovieDetails(movieId);
      setSelectedMovie(details);
    } catch (err) {
      console.error('Failed to load movie details:', err);
    }
  };

  const handleActorClick = async (personId: number) => {
    try {
      const details = await getPersonDetails(personId);
      setSelectedActor(details);
    } catch (err) {
      console.error('Failed to load actor details:', err);
    }
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('search');
    }
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  const handleCloseActor = () => {
    setSelectedActor(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-950 to-black text-white">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        watchlistCount={watchlist.length}
        searchQuery={searchQuery}
        onQueryChange={handleQueryChange}
        loading={loading}
        onLogout={() => setIsLoggedIn(false)}
      />

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isInWatchlist={watchlist.some(w => w.id === selectedMovie.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onClose={handleCloseDetails}
          onActorClick={handleActorClick}
        />
      )}

      {selectedActor && (
        <ActorProfile
          person={selectedActor}
          onClose={handleCloseActor}
          onMovieClick={handleMovieClick}
        />
      )}

      <main className="pt-16">
        {currentView === 'home' && (
          <>
            <Hero 
              trendingMovies={trendingMovies.slice(0, 5)}
              onMovieClick={handleMovieClick}
            />
            <TrendingSection
              movies={trendingMovies}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
            />
          </>
        )}

        {currentView === 'search' && (
          <div className="container mx-auto px-4 py-8">
            <SearchSection
              searchQuery={searchQuery}
              searchResults={searchResults}
              watchlist={watchlist}
              loading={loading}
              error={error}
              onQueryChange={handleQueryChange}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}

        {currentView === 'watchlist' && (
          <div className="container mx-auto px-4 py-8">
            <WatchlistSection
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
            />
          </div>
        )}

        {currentView === 'trending' && (
          <div className="container mx-auto px-4 py-8">
            <TrendingSection
              movies={trendingMovies}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
              showTitle={true}
            />
          </div>
        )}
      </main>

      <footer className="bg-black/50 backdrop-blur-sm border-t border-red-800/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 CineVault. Powered by The Movie Database (TMDb).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;