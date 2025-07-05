import axios from 'axios';

const IMDB_BASE_URL = 'https://imdb-api.com/en/API';
const IMDB_API_KEY = 'k_12345678'; // Placeholder API key

const imdbApi = axios.create({
  baseURL: IMDB_BASE_URL,
});

export interface IMDbMovie {
  id: string;
  title: string;
  fullTitle: string;
  year: string;
  image: string;
  releaseDate: string;
  runtimeMins: string;
  runtimeStr: string;
  plot: string;
  contentRating: string;
  imDbRating: string;
  imDbRatingCount: string;
  metacriticRating: string;
  genres: string;
  genreList: Array<{
    key: string;
    value: string;
  }>;
  directors: string;
  directorList: Array<{
    id: string;
    name: string;
  }>;
  stars: string;
  starList: Array<{
    id: string;
    name: string;
  }>;
  actorList: Array<{
    id: string;
    image: string;
    name: string;
    asCharacter: string;
  }>;
  companies: string;
  companyList: Array<{
    id: string;
    name: string;
  }>;
  countries: string;
  countryList: Array<{
    key: string;
    value: string;
  }>;
  languages: string;
  languageList: Array<{
    key: string;
    value: string;
  }>;
  awards: string;
  boxOffice: {
    budget: string;
    openingWeekendUSA: string;
    grossUSA: string;
    cumulativeWorldwideGross: string;
  };
}

export interface IMDbSearchResult {
  id: string;
  resultType: string;
  image: string;
  title: string;
  description: string;
}

export interface IMDbSearchResponse {
  searchType: string;
  expression: string;
  results: IMDbSearchResult[];
  errorMessage: string;
}

export interface IMDbTrendingResponse {
  items: Array<{
    id: string;
    rank: string;
    title: string;
    fullTitle: string;
    year: string;
    image: string;
    crew: string;
    imDbRating: string;
    imDbRatingCount: string;
  }>;
  errorMessage: string;
}

// Convert IMDb movie to our Movie interface
export const convertIMDbToMovie = (imdbMovie: any): any => {
  const rating = parseFloat(imdbMovie.imDbRating || imdbMovie.imDbRating || '0') || 0;
  
  return {
    id: parseInt(imdbMovie.id?.replace('tt', '') || Math.random().toString()) || Math.random() * 1000000,
    title: imdbMovie.title || imdbMovie.fullTitle || 'Unknown Title',
    poster_path: imdbMovie.image || null,
    backdrop_path: imdbMovie.image || null,
    release_date: imdbMovie.year || imdbMovie.releaseDate || '',
    vote_average: rating,
    vote_count: parseInt(imdbMovie.imDbRatingCount?.replace(/,/g, '') || '0') || 1000,
    overview: imdbMovie.plot || imdbMovie.description || 'No plot available.',
    imdb_id: imdbMovie.id,
  };
};

export const searchMoviesIMDb = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await imdbApi.get(`/SearchMovie/${IMDB_API_KEY}/${encodeURIComponent(query.trim())}`);
    
    if (response.data && response.data.results && !response.data.errorMessage) {
      return response.data.results.slice(0, 20).map(convertIMDbToMovie);
    }
    
    return [];
  } catch (error) {
    console.error('Error searching movies on IMDb:', error);
    throw new Error('Failed to search movies on IMDb.');
  }
};

export const getTrendingMoviesIMDb = async (): Promise<any[]> => {
  try {
    const response = await imdbApi.get(`/MostPopularMovies/${IMDB_API_KEY}`);
    
    if (response.data && response.data.items && !response.data.errorMessage) {
      return response.data.items.slice(0, 20).map(convertIMDbToMovie);
    }
    
    throw new Error('No trending movies found');
  } catch (error) {
    console.error('Error fetching trending movies from IMDb:', error);
    throw new Error('Failed to fetch trending movies from IMDb.');
  }
};

export const getMovieDetailsIMDb = async (movieId: number): Promise<any> => {
  try {
    // Convert numeric ID back to IMDb format
    const imdbId = `tt${movieId.toString().padStart(7, '0')}`;
    
    const response = await imdbApi.get(`/Title/${IMDB_API_KEY}/${imdbId}`);
    
    if (response.data && !response.data.errorMessage) {
      const movie = convertIMDbToMovie(response.data);
      return {
        ...movie,
        genres: response.data.genreList ? response.data.genreList.map((genre: any, index: number) => ({ 
          id: index, 
          name: genre.value 
        })) : [],
        runtime: response.data.runtimeMins ? parseInt(response.data.runtimeMins) : null,
        tagline: response.data.plot?.split('.')[0] + '.' || '',
        budget: response.data.boxOffice?.budget ? parseInt(response.data.boxOffice.budget.replace(/[$,]/g, '')) : 0,
        revenue: response.data.boxOffice?.cumulativeWorldwideGross ? parseInt(response.data.boxOffice.cumulativeWorldwideGross.replace(/[$,]/g, '')) : 0,
        production_companies: response.data.companyList ? response.data.companyList.slice(0, 3).map((company: any) => ({ 
          id: company.id, 
          name: company.name, 
          logo_path: null, 
          origin_country: 'US' 
        })) : [],
        spoken_languages: response.data.languageList ? response.data.languageList.map((lang: any) => ({ 
          english_name: lang.value, 
          iso_639_1: lang.key, 
          name: lang.value 
        })) : [],
        credits: {
          cast: response.data.actorList ? response.data.actorList.slice(0, 10).map((actor: any) => ({
            id: parseInt(actor.id?.replace('nm', '') || Math.random().toString()),
            name: actor.name,
            character: actor.asCharacter || 'Actor',
            profile_path: actor.image || null,
          })) : [],
          crew: response.data.directorList ? response.data.directorList.map((director: any) => ({
            id: parseInt(director.id?.replace('nm', '') || Math.random().toString()),
            name: director.name,
            job: 'Director',
            profile_path: null,
          })) : [],
        },
      };
    }
    
    throw new Error('Movie not found');
  } catch (error) {
    console.error('Error fetching movie details from IMDb:', error);
    throw new Error('Failed to fetch movie details from IMDb');
  }
};

export const getPersonDetailsIMDb = async (personId: number): Promise<any> => {
  try {
    // Convert numeric ID back to IMDb format
    const imdbId = `nm${personId.toString().padStart(7, '0')}`;
    
    const response = await imdbApi.get(`/Name/${IMDB_API_KEY}/${imdbId}`);
    
    if (response.data && !response.data.errorMessage) {
      return {
        id: personId,
        name: response.data.name || 'Unknown Actor',
        biography: response.data.summary || 'Biography not available.',
        birthday: response.data.birthDate || null,
        place_of_birth: response.data.birthPlace || null,
        popularity: 0,
        profile_path: response.data.image || null,
        known_for_department: response.data.role || 'Acting',
        movie_credits: {
          cast: response.data.knownFor ? response.data.knownFor.map(convertIMDbToMovie) : [],
          crew: [],
        },
      };
    }
    
    throw new Error('Person not found');
  } catch (error) {
    console.error('Error fetching person details from IMDb:', error);
    throw new Error('Failed to fetch person details from IMDb');
  }
};