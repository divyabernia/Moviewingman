export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  overview: string;
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetails extends Movie {
  belongs_to_collection?: any;
  budget: number;
  genres: Genre[];
  homepage?: string;
  imdb_id?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime?: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline?: string;
  credits?: Credits;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Person {
  id: number;
  name: string;
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  gender: number;
  homepage?: string | null;
  imdb_id?: string;
  known_for_department: string;
  place_of_birth?: string;
  popularity: number;
  profile_path: string | null;
  movie_credits?: {
    cast: Movie[];
    crew: Movie[];
  };
}

export interface AppState {
  searchResults: Movie[];
  watchlist: Movie[];
  loading: boolean;
  searchQuery: string;
  error: string | null;
}