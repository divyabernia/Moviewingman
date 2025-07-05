import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchSection } from './components/SearchSection';
import { WatchlistSection } from './components/WatchlistSection';
import { MovieDetails } from './components/MovieDetails';
import { TrendingSection } from './components/TrendingSection';
import { ActorProfile } from './components/ActorProfile';
import { LoginScreen } from './components/LoginScreen';
import { AISommelier } from './components/AISommelier';
import { MovieDNA } from './components/MovieDNA';
import { SmartRecommendations } from './components/SmartRecommendations';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSocialWatchlist } from './hooks/useSocialWatchlist';
import { SocialWatchlistModal } from './components/SocialWatchlistModal';
import { SocialWatchlistView } from './components/SocialWatchlistView';
import { searchMovies, getTrendingMovies, getMovieDetails, getPersonDetails } from './services/omdb';
import { Movie, MovieDetails as MovieDetailsType, Person } from './types/movie';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'watchlist' | 'trending' | 'social'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>('movie-watchlist', []);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsType | null>(null);
  const [selectedActor, setSelectedActor] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('user-logged-in', false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAISommelier, setShowAISommelier] = useState(false);
  const [showMovieDNA, setShowMovieDNA] = useState(false);
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedMovieForSocial, setSelectedMovieForSocial] = useState<Movie | null>(null);

  // Social watchlist hook
  const {
    socialWatchlist,
    friends,
    addToSocialWatchlist,
    removeFromSocialWatchlist,
    addFriend,
    isInSocialWatchlist,
  } = useSocialWatchlist();

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
    if (loading) return; // Prevent multiple simultaneous calls
    
    try {
      setLoading(true);
      setError(null);
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
        if (query && query.trim()) {
          setSearchQuery(query);
          setCurrentView('search');
          // Trigger search immediately
          handleSearch(query);
        }
      };
      
      window.addEventListener('heroSearch', handleHeroSearch as EventListener);
      
      return () => {
        window.removeEventListener('heroSearch', handleHeroSearch as EventListener);
      };
    }
  }, [loadTrendingMovies, isLoggedIn, handleSearch]);


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
    
    // Clear results if query is empty
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
      // Dynamic search with debouncing
      const timeoutId = setTimeout(() => {
        handleSearch(query);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
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

  const handleMovieRecommendation = async (title: string) => {
    try {
      const results = await searchMovies(title);
      if (results.length > 0) {
        handleMovieClick(results[0].id);
      }
    } catch (error) {
      console.error('Error finding recommended movie:', error);
    }
  };

  const handleSocialAdd = (movie: Movie) => {
    setSelectedMovieForSocial(movie);
    setShowSocialModal(true);
  };

  const handleSocialWatchlistAdd = (movie: Movie, categories: string[], taggedFriends: string[]) => {
    addToSocialWatchlist(movie, categories, taggedFriends);
    setShowSocialModal(false);
    setSelectedMovieForSocial(null);
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
        socialWatchlistCount={socialWatchlist.length}
        searchQuery={searchQuery}
        onQueryChange={handleQueryChange}
        onManualSearch={handleManualSearch}
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

      {showAISommelier && (
        <AISommelier
          watchlist={watchlist}
          onMovieRecommendation={handleMovieRecommendation}
          onClose={() => setShowAISommelier(false)}
        />
      )}

      {showMovieDNA && (
        <MovieDNA
          watchlist={watchlist}
          onClose={() => setShowMovieDNA(false)}
        />
      )}

      {showSmartRecommendations && (
        <SmartRecommendations
          watchlist={watchlist}
          onMovieClick={handleMovieClick}
          onToggleWatchlist={handleToggleWatchlist}
          onClose={() => setShowSmartRecommendations(false)}
        />
      )}

      {showSocialModal && selectedMovieForSocial && (
        <SocialWatchlistModal
          movie={selectedMovieForSocial}
          isOpen={showSocialModal}
          onClose={() => {
            setShowSocialModal(false);
            setSelectedMovieForSocial(null);
          }}
          onAddToWatchlist={handleSocialWatchlistAdd}
          friends={friends}
          onAddFriend={addFriend}
        />
      )}

      <main className="pt-16">
        {currentView === 'home' && (
          <>
            <Hero 
              trendingMovies={trendingMovies.slice(0, 5)}
              onMovieClick={handleMovieClick}
              searchQuery={searchQuery}
              searchResults={searchResults}
              watchlist={watchlist}
              loading={loading}
              error={error}
              onQueryChange={handleQueryChange}
              onToggleWatchlist={handleToggleWatchlist}
              showSearchResults={showSearchResults}
              onSetShowSearchResults={setShowSearchResults}
              onSocialAdd={handleSocialAdd}
              onShowAISommelier={() => setShowAISommelier(true)}
              onShowMovieDNA={() => setShowMovieDNA(true)}
              onShowSmartRecommendations={() => setShowSmartRecommendations(true)}
            />
            <TrendingSection
              movies={trendingMovies}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
              onSocialAdd={handleSocialAdd}
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
              onManualSearch={handleManualSearch}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
              onSocialAdd={handleSocialAdd}
            />
          </div>
        )}

        {currentView === 'watchlist' && (
          <div className="container mx-auto px-4 py-8">
            <WatchlistSection
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={handleMovieClick}
              onShowMovieDNA={() => setShowMovieDNA(true)}
              onShowSmartRecommendations={() => setShowSmartRecommendations(true)}
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
              onSocialAdd={handleSocialAdd}
            />
          </div>
        )}

        {currentView === 'social' && (
          <div className="container mx-auto px-4 py-8">
            <SocialWatchlistView
              socialWatchlist={socialWatchlist}
              friends={friends}
              onMovieClick={handleMovieClick}
              onRemoveFromWatchlist={removeFromSocialWatchlist}
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