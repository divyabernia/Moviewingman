import axios from 'axios';
import { searchMoviesTMDb, getTrendingMoviesTMDb, getMovieDetailsTMDb, getPersonDetailsTMDb, getTMDbImageUrl } from './tmdb';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'b00a7e04';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

// Check if OMDb API key is available
const hasValidOMDbKey = () => {
  return OMDB_API_KEY && OMDB_API_KEY !== 'your_omdb_api_key_here' && OMDB_API_KEY.length > 5;
};

const omdbApi = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
  timeout: 10000, // 10 second timeout
});

export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface OMDbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbSearchResponse {
  Search: OMDbSearchResult[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Convert OMDb movie to our Movie interface
export const convertOMDbToMovie = (omdbMovie: OMDbMovie | OMDbSearchResult, index: number = 0): any => {
  const isFullMovie = 'Plot' in omdbMovie;
  const imdbRating = isFullMovie ? parseFloat(omdbMovie.imdbRating) || 0 : Math.random() * 3 + 7; // Random rating between 7-10
  
  // Generate a consistent numeric ID from imdbID
  const numericId = omdbMovie.imdbID ? 
    parseInt(omdbMovie.imdbID.replace('tt', '')) : 
    Math.floor(Math.random() * 1000000) + index;
  
  return {
    id: numericId,
    title: omdbMovie.Title,
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    backdrop_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    release_date: omdbMovie.Year,
    vote_average: Number(imdbRating.toFixed(1)),
    vote_count: isFullMovie ? parseInt(omdbMovie.imdbVotes?.replace(/,/g, '') || '0') : Math.floor(Math.random() * 10000) + 1000,
    overview: isFullMovie ? omdbMovie.Plot : 'No plot available.',
    imdb_id: omdbMovie.imdbID,
  };
};

export const searchMovies = async (query: string, signal?: AbortSignal): Promise<any[]> => {
  if (!query.trim()) return [];
  
  try {
    console.log('Searching TMDb for:', query);
    const tmdbResults = await searchMoviesTMDb(query, signal);
    if (tmdbResults && tmdbResults.length > 0) {
      console.log('Found results from TMDb');
      return tmdbResults;
    }
  } catch (tmdbError) {
    console.error('TMDb search failed:', tmdbError);
  }
  
  // Fallback to OMDb only if we have a valid API key
  if (hasValidOMDbKey()) {
    try {
      console.log('TMDb failed, trying OMDb as backup for:', query);
      const response = await omdbApi.get('', {
        params: {
          s: query.trim(),
          type: 'movie',
          page: 1,
        },
        signal,
      });
      
      console.log('OMDb Search Response:', response.data);
      
      if (response.data.Response === 'True' && response.data.Search) {
        return response.data.Search.map((movie: OMDbSearchResult, index: number) => 
          convertOMDbToMovie(movie, index)
        );
      }
    } catch (omdbError) {
      console.error('OMDb search also failed:', omdbError);
    }
  } else {
    console.warn('OMDb API key not configured, skipping OMDb search');
  }
  
  // Last resort: return some popular movies as suggestions
  try {
    console.log('All search methods failed, returning trending movies as suggestions');
    const trending = await getTrendingMoviesTMDb();
    return trending ? trending.slice(0, 10) : [];
  } catch {
    console.warn('All movie search methods failed, returning empty results');
    return [];
  }
};

export const getTrendingMovies = async (): Promise<any[]> => {
  try {
    console.log('Fetching trending movies from TMDb...');
    const trendingMovies = await getTrendingMoviesTMDb();
    console.log('Trending movies fetched from TMDb:', trendingMovies ? trendingMovies.length : 0);
    return trendingMovies || [];
  } catch (error) {
    console.error('Error fetching trending movies from TMDb:', error);
    console.warn('Returning empty trending movies list');
    return [];
  }
};

export const getMovieDetails = async (movieId: number): Promise<any> => {
  try {
    console.log('Fetching movie details from TMDb for ID:', movieId);
    const tmdbDetails = await getMovieDetailsTMDb(movieId);
    if (tmdbDetails) {
      console.log('Successfully got movie details from TMDb');
      return tmdbDetails;
    }
  } catch (tmdbError) {
    console.error('TMDb movie details failed:', tmdbError);
  }
    
  // Fallback to OMDb only if we have a valid API key
  if (hasValidOMDbKey()) {
    try {
      // Convert numeric ID back to IMDb format
      const imdbId = `tt${movieId.toString().padStart(7, '0')}`;
      
      console.log('TMDb failed, trying OMDb for movie details:', imdbId);
      const response = await omdbApi.get('', {
        params: {
          i: imdbId,
          plot: 'full',
        },
      });
      
      console.log('Movie details response from OMDb:', response.data);
      
      if (response.data.Response === 'True') {
        const movie = convertOMDbToMovie(response.data);
        return {
          ...movie,
          genres: response.data.Genre ? response.data.Genre.split(', ').map((name: string, index: number) => ({ id: index, name })) : [],
          runtime: response.data.Runtime ? parseInt(response.data.Runtime.replace(' min', '')) : null,
          tagline: response.data.Plot?.split('.')[0] + '.' || '',
          budget: 0,
          revenue: response.data.BoxOffice ? parseInt(response.data.BoxOffice.replace(/[$,]/g, '')) || 0 : 0,
          production_companies: response.data.Production ? [{ id: 1, name: response.data.Production, logo_path: null, origin_country: 'US' }] : [],
          spoken_languages: response.data.Language ? response.data.Language.split(', ').map((lang: string) => ({ english_name: lang, iso_639_1: '', name: lang })) : [],
          credits: {
            cast: response.data.Actors ? response.data.Actors.split(', ').map((name: string, index: number) => ({
              id: index + 1,
              name,
              character: 'Actor',
              profile_path: null,
            })) : [],
            crew: response.data.Director ? [{
              id: 1,
              name: response.data.Director,
              job: 'Director',
              profile_path: null,
            }] : [],
          },
          omdbData: response.data,
        };
      }
      
      throw new Error('Movie not found in OMDb');
    } catch (omdbError) {
      console.error('OMDb backup also failed:', omdbError);
    }
  } else {
    console.warn('OMDb API key not configured, skipping OMDb fallback');
  }
  
  // Return mock data as final fallback
  console.warn('All movie detail methods failed, returning mock data');
  return getMockMovieDetails(movieId);
};

export const getPersonDetails = async (personId: number): Promise<any> => {
  try {
    console.log('Fetching person details from TMDb...');
    const personDetails = await getPersonDetailsTMDb(personId);
    if (personDetails) {
      console.log('Person details fetched from TMDb');
      return personDetails;
    }
  } catch (error) {
    console.error('Error fetching person details:', error);
  }
  
  // Return a mock response as fallback
  console.warn('Returning mock person details');
  return {
    id: personId,
    name: 'Actor Name',
    biography: 'Biography not available.',
    birthday: null,
    place_of_birth: null,
    popularity: 0,
    profile_path: null,
    known_for_department: 'Acting',
    movie_credits: {
      cast: [],
      crew: [],
    },
  };
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path || path === 'N/A') return 'https://via.placeholder.com/500x750/1e293b/64748b?text=No+Image';
  
  // Check if it's a full URL (from OMDb/IMDb) or a relative path (from TMDb)
  if (path.startsWith('http')) {
    return path;
  } else {
    // It's a TMDb relative path
    return getTMDbImageUrl(path, size);
  }
};

export const getYear = (dateString: string): string => {
  return dateString || 'N/A';
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

// Mock data function for movie details fallback
const getMockMovieDetails = (movieId: number): any => {
  return {
    id: movieId,
    title: "Sample Movie",
    poster_path: "https://images.unsplash.com/photo-1489599735734-79b4ba5a1d6b?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1489599735734-79b4ba5a1d6b?w=1280&h=720&fit=crop",
    release_date: "2023-01-01",
    vote_average: 7.5,
    vote_count: 1000,
    overview: "This is a sample movie description. The actual movie data could not be loaded due to API connectivity issues.",
    genres: [
      { id: 18, name: "Drama" },
      { id: 28, name: "Action" }
    ],
    runtime: 120,
    tagline: "A sample movie tagline",
    budget: 0,
    revenue: 0,
    production_companies: [],
    spoken_languages: [
      { english_name: "English", iso_639_1: "en", name: "English" }
    ],
    credits: {
      cast: [
        { id: 1, name: "Sample Actor", character: "Main Character", profile_path: null }
      ],
      crew: [
        { id: 1, name: "Sample Director", job: "Director", profile_path: null }
      ]
    },
    imdb_id: `tt${movieId.toString().padStart(7, '0')}`
  };
};