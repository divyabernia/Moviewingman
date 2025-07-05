import axios from 'axios';

const IMDB_API_KEY = '4886df08d3msh33d3088f7f52edap147239jsnd51845b8bae1';
const IMDB_BASE_URL = 'https://imdb-com.p.rapidapi.com';

const imdbApi = axios.create({
  baseURL: IMDB_BASE_URL,
  headers: {
    'X-RapidAPI-Host': 'imdb-com.p.rapidapi.com',
    'X-RapidAPI-Key': IMDB_API_KEY,
  },
});

export interface IMDbSearchResult {
  id: string;
  title: string;
  year: number;
  image: string;
  titleType: string;
  principals?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

export interface IMDbMovieDetails {
  id: string;
  title: string;
  year: number;
  image: string;
  plot: string;
  rating: number;
  ratingCount: number;
  genres: string[];
  runtime: number;
  directors: Array<{
    id: string;
    name: string;
  }>;
  writers: Array<{
    id: string;
    name: string;
  }>;
  stars: Array<{
    id: string;
    name: string;
  }>;
  boxOffice?: {
    budget?: string;
    gross?: string;
  };
}

// Convert IMDb data to our Movie interface
export const convertIMDbToMovie = (imdbData: any, index: number = 0): any => {
  const id = imdbData.id ? parseInt(imdbData.id.replace('tt', '')) : Math.floor(Math.random() * 1000000) + index;
  
  return {
    id,
    title: imdbData.title || imdbData.titleText?.text || 'Unknown Title',
    poster_path: imdbData.image || imdbData.primaryImage?.url || null,
    backdrop_path: imdbData.image || imdbData.primaryImage?.url || null,
    release_date: imdbData.year?.toString() || imdbData.releaseYear?.year?.toString() || 'N/A',
    vote_average: imdbData.rating || imdbData.ratingsSummary?.aggregateRating || Math.random() * 3 + 7,
    vote_count: imdbData.ratingCount || imdbData.ratingsSummary?.voteCount || Math.floor(Math.random() * 10000) + 1000,
    overview: imdbData.plot || imdbData.plotSummary?.text || 'No plot available.',
    imdb_id: imdbData.id,
  };
};

export const searchMoviesIMDb = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];
  
  try {
    console.log('Searching IMDb for:', query);
    const response = await imdbApi.get('/title/find', {
      params: {
        q: query.trim(),
      },
    });
    
    console.log('IMDb Search Response:', response.data);
    
    if (response.data?.results) {
      // Filter for movies only and convert to our format
      const movies = response.data.results
        .filter((item: any) => item.titleType === 'movie')
        .slice(0, 20) // Limit results
        .map((movie: any, index: number) => convertIMDbToMovie(movie, index));
      
      return movies;
    }
    
    return [];
  } catch (error) {
    console.error('Error searching IMDb:', error);
    throw new Error('Failed to search IMDb. Please try again.');
  }
};

export const getTrendingMoviesIMDb = async (): Promise<any[]> => {
  try {
    console.log('Fetching trending movies from IMDb...');
    
    // Get popular movies from IMDb's most popular endpoint
    const response = await imdbApi.get('/title/get-most-popular-movies', {
      params: {
        homeCountry: 'US',
        purchaseCountry: 'US',
        currentCountry: 'US',
      },
    });
    
    console.log('IMDb Trending Response:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      // Get detailed info for each movie
      const moviePromises = response.data.slice(0, 20).map(async (movieId: string, index: number) => {
        try {
          const detailResponse = await imdbApi.get('/title/get-overview-details', {
            params: {
              tconst: movieId,
              currentCountry: 'US',
            },
          });
          
          if (detailResponse.data) {
            return convertIMDbToMovie(detailResponse.data, index);
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch details for ${movieId}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(moviePromises);
      const validResults = results.filter(movie => movie !== null);
      
      console.log('IMDb trending movies fetched:', validResults.length);
      return validResults;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching trending movies from IMDb:', error);
    throw new Error('Failed to fetch trending movies from IMDb.');
  }
};

export const getMovieDetailsIMDb = async (movieId: number): Promise<any> => {
  try {
    const imdbId = `tt${movieId.toString().padStart(7, '0')}`;
    
    console.log('Fetching IMDb movie details for:', imdbId);
    
    // Get basic details
    const detailsResponse = await imdbApi.get('/title/get-overview-details', {
      params: {
        tconst: imdbId,
        currentCountry: 'US',
      },
    });
    
    // Get additional metadata
    const metaResponse = await imdbApi.get('/title/get-meta-data', {
      params: {
        ids: imdbId,
      },
    });
    
    console.log('IMDb Details Response:', detailsResponse.data);
    console.log('IMDb Meta Response:', metaResponse.data);
    
    if (detailsResponse.data) {
      const movie = convertIMDbToMovie(detailsResponse.data);
      const metaData = metaResponse.data?.[imdbId];
      
      return {
        ...movie,
        genres: detailsResponse.data.genres?.map((genre: any, index: number) => ({ 
          id: index, 
          name: genre.text || genre 
        })) || [],
        runtime: detailsResponse.data.runtime?.seconds ? Math.floor(detailsResponse.data.runtime.seconds / 60) : null,
        tagline: detailsResponse.data.plotSummary?.text?.split('.')[0] + '.' || '',
        budget: 0,
        revenue: 0,
        production_companies: detailsResponse.data.productionCompanies?.map((company: any, index: number) => ({
          id: index,
          name: company.company?.companyText?.text || company.name || 'Unknown',
          logo_path: null,
          origin_country: 'US',
        })) || [],
        spoken_languages: detailsResponse.data.spokenLanguages?.map((lang: any) => ({
          english_name: lang.text || lang,
          iso_639_1: '',
          name: lang.text || lang,
        })) || [],
        credits: {
          cast: detailsResponse.data.principalCredits?.[0]?.credits?.slice(0, 10).map((credit: any, index: number) => ({
            id: index + 1,
            name: credit.name?.nameText?.text || credit.name || 'Unknown',
            character: credit.characters?.[0]?.name || 'Actor',
            profile_path: credit.name?.primaryImage?.url || null,
          })) || [],
          crew: detailsResponse.data.directors?.map((director: any, index: number) => ({
            id: index + 1,
            name: director.credits?.[0]?.name?.nameText?.text || director.name || 'Unknown',
            job: 'Director',
            profile_path: director.credits?.[0]?.name?.primaryImage?.url || null,
          })) || [],
        },
        imdbData: {
          ...detailsResponse.data,
          ...metaData,
        },
      };
    }
    
    throw new Error('Movie not found on IMDb');
  } catch (error) {
    console.error('Error fetching IMDb movie details:', error);
    throw new Error('Failed to fetch movie details from IMDb.');
  }
};