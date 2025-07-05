import axios from 'axios';
import { Movie, MovieDetails, Person } from '../types/movie';
import { getOMDbMovieDetails, OMDbMovie } from './omdb';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query: query.trim(),
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
    });
    
    // Filter out movies without posters and with low ratings for better results
    const filteredResults = (response.data.results || []).filter((movie: Movie) => 
      movie.poster_path && 
      movie.overview && 
      movie.vote_average > 0
    );
    
    return filteredResults;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await tmdbApi.get('/trending/movie/week', {
      params: {
        language: 'en-US',
      },
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw new Error('Failed to fetch trending movies');
  }
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails & { omdbData?: OMDbMovie }> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        language: 'en-US',
        append_to_response: 'credits,videos,reviews',
      },
    });
    
    const movieData = response.data;
    
    // Try to get additional details from OMDb if we have an IMDb ID
    let omdbData = null;
    if (movieData.imdb_id) {
      omdbData = await getOMDbMovieDetails(movieData.imdb_id);
    }
    
    return {
      ...movieData,
      omdbData,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getPersonDetails = async (personId: number): Promise<Person> => {
  try {
    const response = await tmdbApi.get(`/person/${personId}`, {
      params: {
        language: 'en-US',
        append_to_response: 'movie_credits',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw new Error('Failed to fetch person details');
  }
};

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750/1e293b/64748b?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getYear = (dateString: string): string => {
  return dateString ? new Date(dateString).getFullYear().toString() : 'N/A';
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};