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

export const getOMDbMovieDetails = async (imdbId: string): Promise<OMDbMovie | null> => {
  try {
    const response = await omdbApi.get('', {
      params: {
        i: imdbId,
        plot: 'full',
      },
    });
    
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching OMDb movie details:', error);
    return null;
  }
};

export const searchOMDbMovies = async (title: string): Promise<OMDbMovie[]> => {
  try {
    const response = await omdbApi.get('', {
      params: {
        s: title,
        type: 'movie',
      },
    });
    
    if (response.data.Response === 'True' && response.data.Search) {
      return response.data.Search;
    }
    return [];
  } catch (error) {
    console.error('Error searching OMDb movies:', error);
    return [];
  }
};