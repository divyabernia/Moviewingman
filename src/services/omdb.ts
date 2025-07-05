import axios from 'axios';

const OMDB_API_KEY = 'b00a7e04';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

const omdbApi = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: OMDB_API_KEY,
  },
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
export const convertOMDbToMovie = (omdbMovie: OMDbMovie | OMDbSearchResult): any => {
  const isFullMovie = 'Plot' in omdbMovie;
  const imdbRating = isFullMovie ? parseFloat(omdbMovie.imdbRating) || 0 : 7.0;
  
  return {
    id: parseInt(omdbMovie.imdbID.replace('tt', '')) || Math.random() * 1000000,
    title: omdbMovie.Title,
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    backdrop_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    release_date: omdbMovie.Year,
    vote_average: imdbRating,
    vote_count: isFullMovie ? parseInt(omdbMovie.imdbVotes?.replace(/,/g, '') || '0') : 1000,
    overview: isFullMovie ? omdbMovie.Plot : 'No plot available.',
    imdb_id: omdbMovie.imdbID,
  };
};

export const searchMovies = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await omdbApi.get('', {
      params: {
        s: query.trim(),
        type: 'movie',
        page: 1,
      },
    });
    
    if (response.data.Response === 'True' && response.data.Search) {
      return response.data.Search.map(convertOMDbToMovie);
    }
    
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};

export const getTrendingMovies = async (): Promise<any[]> => {
  // Since OMDb doesn't have trending, we'll search for popular movies
  const popularMovies = [
    'Avengers', 'Spider-Man', 'Batman', 'Superman', 'Iron Man',
    'Wonder Woman', 'Black Panther', 'Captain America', 'Thor',
    'Guardians of the Galaxy', 'Deadpool', 'X-Men', 'Fast and Furious',
    'Mission Impossible', 'John Wick', 'Matrix', 'Star Wars', 'Jurassic Park',
    'Terminator', 'Alien'
  ];
  
  try {
    const moviePromises = popularMovies.slice(0, 10).map(async (title) => {
      try {
        const response = await omdbApi.get('', {
          params: {
            s: title,
            type: 'movie',
            page: 1,
          },
        });
        
        if (response.data.Response === 'True' && response.data.Search && response.data.Search.length > 0) {
          return convertOMDbToMovie(response.data.Search[0]);
        }
        return null;
      } catch (error) {
        return null;
      }
    });
    
    const results = await Promise.all(moviePromises);
    return results.filter(movie => movie !== null);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw new Error('Failed to fetch trending movies');
  }
};

export const getMovieDetails = async (movieId: number): Promise<any> => {
  try {
    // Convert numeric ID back to IMDb format
    const imdbId = `tt${movieId.toString().padStart(7, '0')}`;
    
    const response = await omdbApi.get('', {
      params: {
        i: imdbId,
        plot: 'full',
      },
    });
    
    if (response.data.Response === 'True') {
      const movie = convertOMDbToMovie(response.data);
      return {
        ...movie,
        genres: response.data.Genre ? response.data.Genre.split(', ').map((name: string, index: number) => ({ id: index, name })) : [],
        runtime: response.data.Runtime ? parseInt(response.data.Runtime.replace(' min', '')) : null,
        tagline: response.data.Plot?.split('.')[0] + '.' || '',
        budget: 0,
        revenue: response.data.BoxOffice ? parseInt(response.data.BoxOffice.replace(/[$,]/g, '')) : 0,
        production_companies: response.data.Production ? [{ id: 1, name: response.data.Production, logo_path: null, origin_country: 'US' }] : [],
        spoken_languages: response.data.Language ? response.data.Language.split(', ').map((lang: string) => ({ english_name: lang, iso_639_1: '', name: lang })) : [],
        credits: {
          cast: response.data.Actors ? response.data.Actors.split(', ').map((name: string, index: number) => ({
            id: index,
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
    
    throw new Error('Movie not found');
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getPersonDetails = async (personId: number): Promise<any> => {
  // OMDb doesn't support person details, so we'll return a mock response
  return {
    id: personId,
    name: 'Actor Name',
    biography: 'Biography not available with OMDb API.',
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
  return path;
};

export const getYear = (dateString: string): string => {
  return dateString || 'N/A';
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};