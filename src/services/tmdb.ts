import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Check if API credentials are available
const hasValidCredentials = () => {
  return TMDB_READ_ACCESS_TOKEN && TMDB_READ_ACCESS_TOKEN !== 'your_tmdb_read_access_token_here';
};

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDbPerson {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  known_for_department: string;
}

export interface TMDbPersonCredits {
  cast: Array<{
    id: number;
    title: string;
    character: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  }>;
  crew: Array<{
    id: number;
    title: string;
    job: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  }>;
}

// Convert TMDb movie to our Movie interface
export const convertTMDbToMovie = (tmdbMovie: TMDbMovie): any => {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    poster_path: tmdbMovie.poster_path,
    backdrop_path: tmdbMovie.backdrop_path,
    release_date: tmdbMovie.release_date,
    vote_average: Number(tmdbMovie.vote_average.toFixed(1)),
    vote_count: tmdbMovie.vote_count,
    overview: tmdbMovie.overview,
    imdb_id: null, // TMDb doesn't provide IMDb ID in trending endpoint
  };
};

export const getTrendingMoviesTMDb = async (): Promise<any[]> => {
  if (!hasValidCredentials()) {
    console.warn('TMDb API credentials not configured, returning mock data');
    return getMockTrendingMovies();
  }

  try {
    console.log('Fetching trending movies from TMDb...');
    const response = await tmdbApi.get('/trending/movie/week');
    
    console.log('TMDb trending response:', response.data);
    
    if (response.data.results) {
      return response.data.results.map((movie: TMDbMovie) => convertTMDbToMovie(movie));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching trending movies from TMDb:', error);
    console.warn('Falling back to mock trending movies');
    return getMockTrendingMovies();
  }
};

export const searchMoviesTMDb = async (query: string, signal?: AbortSignal): Promise<any[]> => {
  if (!query.trim()) return [];
  
  if (!hasValidCredentials()) {
    console.warn('TMDb API credentials not configured, returning mock search results');
    return getMockSearchResults(query);
  }
  
  try {
    console.log('Searching TMDb for:', query);
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query.trim(),
        page: 1,
        include_adult: false,
      },
      signal,
    });
    
    console.log('TMDb search response:', response.data);
    
    if (response.data.results) {
      return response.data.results.map((movie: TMDbMovie) => convertTMDbToMovie(movie));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching movies on TMDb:', error);
    console.warn('Falling back to mock search results');
    return getMockSearchResults(query);
  }
};

export const getMovieDetailsTMDb = async (movieId: number): Promise<any> => {
  if (!hasValidCredentials()) {
    console.warn('TMDb API credentials not configured, returning mock movie details');
    return getMockMovieDetails(movieId);
  }

  try {
    console.log('Fetching movie details from TMDb for ID:', movieId);
    
    // Fetch movie details
    const movieResponse = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits',
      },
    });
    
    const movie = movieResponse.data;
    
    return {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: Number(movie.vote_average.toFixed(1)),
      vote_count: movie.vote_count,
      overview: movie.overview,
      genres: movie.genres || [],
      runtime: movie.runtime,
      tagline: movie.tagline || '',
      budget: movie.budget || 0,
      revenue: movie.revenue || 0,
      production_companies: movie.production_companies || [],
      spoken_languages: movie.spoken_languages || [],
      credits: movie.credits || { cast: [], crew: [] },
      imdb_id: movie.imdb_id,
    };
  } catch (error) {
    console.error('Error fetching movie details from TMDb:', error);
    console.warn('Falling back to mock movie details');
    return getMockMovieDetails(movieId);
  }
};
export const getPersonDetailsTMDb = async (personId: number): Promise<any> => {
  if (!hasValidCredentials()) {
    console.warn('TMDb API credentials not configured, returning mock person details');
    return getMockPersonDetails(personId);
  }

  try {
    console.log('Fetching person details from TMDb for ID:', personId);
    
    // Fetch person details
    const personResponse = await tmdbApi.get(`/person/${personId}`);
    const person: TMDbPerson = personResponse.data;
    
    // Fetch person's movie credits
    const creditsResponse = await tmdbApi.get(`/person/${personId}/movie_credits`);
    const credits: TMDbPersonCredits = creditsResponse.data;
    
    return {
      id: person.id,
      name: person.name,
      biography: person.biography,
      birthday: person.birthday,
      place_of_birth: person.place_of_birth,
      popularity: person.popularity,
      profile_path: person.profile_path,
      known_for_department: person.known_for_department,
      movie_credits: {
        cast: credits.cast || [],
        crew: credits.crew || [],
      },
    };
  } catch (error) {
    console.error('Error fetching person details from TMDb:', error);
    console.warn('Falling back to mock person details');
    return getMockPersonDetails(personId);
  }
};

export const getTMDbImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750/1e293b/64748b?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Mock data functions for when API is not available
const getMockTrendingMovies = (): any[] => {
  return [
    {
      id: 1,
      title: "The Shawshank Redemption",
      poster_path: "https://images.unsplash.com/photo-1489599735734-79b4ba5a1d6b?w=500&h=750&fit=crop",
      backdrop_path: "https://images.unsplash.com/photo-1489599735734-79b4ba5a1d6b?w=1280&h=720&fit=crop",
      release_date: "1994-09-23",
      vote_average: 9.3,
      vote_count: 2500000,
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      imdb_id: "tt0111161"
    },
    {
      id: 2,
      title: "The Godfather",
      poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop",
      backdrop_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop",
      release_date: "1972-03-24",
      vote_average: 9.2,
      vote_count: 1800000,
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      imdb_id: "tt0068646"
    },
    {
      id: 3,
      title: "The Dark Knight",
      poster_path: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=750&fit=crop",
      backdrop_path: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280&h=720&fit=crop",
      release_date: "2008-07-18",
      vote_average: 9.0,
      vote_count: 2700000,
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      imdb_id: "tt0468569"
    }
  ];
};

const getMockSearchResults = (query: string): any[] => {
  const mockMovies = getMockTrendingMovies();
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
};

const getMockMovieDetails = (movieId: number): any => {
  const mockMovies = getMockTrendingMovies();
  const movie = mockMovies.find(m => m.id === movieId) || mockMovies[0];
  
  return {
    ...movie,
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" }
    ],
    runtime: 142,
    tagline: "Fear can hold you prisoner. Hope can set you free.",
    budget: 25000000,
    revenue: 16000000,
    production_companies: [
      { id: 1, name: "Castle Rock Entertainment", logo_path: null, origin_country: "US" }
    ],
    spoken_languages: [
      { english_name: "English", iso_639_1: "en", name: "English" }
    ],
    credits: {
      cast: [
        { id: 1, name: "Tim Robbins", character: "Andy Dufresne", profile_path: null },
        { id: 2, name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", profile_path: null }
      ],
      crew: [
        { id: 1, name: "Frank Darabont", job: "Director", profile_path: null }
      ]
    }
  };
};

const getMockPersonDetails = (personId: number): any => {
  return {
    id: personId,
    name: "Morgan Freeman",
    biography: "Morgan Freeman is an American actor, director, and narrator. He has received various accolades, including an Academy Award, a Golden Globe Award, and a Screen Actors Guild Award.",
    birthday: "1937-06-01",
    place_of_birth: "Memphis, Tennessee, USA",
    popularity: 25.5,
    profile_path: null,
    known_for_department: "Acting",
    movie_credits: {
      cast: getMockTrendingMovies().map(movie => ({
        ...movie,
        character: "Character Name"
      })),
      crew: []
    }
  };
};

// Re-export everything from omdb.ts to maintain compatibility
export * from './omdb';