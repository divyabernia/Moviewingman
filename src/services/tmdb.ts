import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '51c2dca8f803c3321a9cb62ad846194d';
const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MWMyZGNhOGY4MDNjMzMyMWE5Y2I2MmFkODQ2MTk0ZCIsIm5iZiI6MTc1MTY1MTM1NS41MDgsInN1YiI6IjY4NjgxNDFiM2RhZWU2MzFiNTlhMzQyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nvvZ0W9Jyqr3nMUNmlNMA03KDNSfTkBtMpRISr9kJlo';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
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
    throw new Error('Failed to fetch trending movies from TMDb');
  }
};

export const searchMoviesTMDb = async (query: string, signal?: AbortSignal): Promise<any[]> => {
  if (!query.trim()) return [];
  
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
    throw new Error('Failed to search movies on TMDb');
  }
};

export const getMovieDetailsTMDb = async (movieId: number): Promise<any> => {
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
    throw new Error('Failed to fetch movie details from TMDb');
  }
};
export const getPersonDetailsTMDb = async (personId: number): Promise<any> => {
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
    throw new Error('Failed to fetch person details from TMDb');
  }
};

export const getTMDbImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750/1e293b/64748b?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Re-export everything from omdb.ts to maintain compatibility
export * from './omdb';