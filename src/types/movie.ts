// types/movie.ts - Định nghĩa kiểu dữ liệu cho phim

export interface Movie {
  // Basic info
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  description: string;
  
  // Images
  poster: string;
  thumbnail: string;
  backdrop?: string;
  
  // Ratings và votes
  rating?: number;
  imdbRating?: number;
  voteAverage?: number;
  voteCount?: number;
  
  // Episode info
  totalEpisodes?: number;
  currentEpisode?: number;
  
  // Basic metadata
  year: number;
  country?: string;
  countryData?: Country[];
  genres?: string[];
  categories?: Category[];
  duration?: number;
  quality?: string;
  isCompleted?: boolean;
  
  // Episodes và streaming
  episodes?: EpisodeServer[];
  views?: number;
  type?: 'movie' | 'tv' | 'single' | 'series' | 'hoathinh';
  apiType?: string;
  
  // Additional metadata
  tmdbId?: string;
  trailer?: string;
  releaseDate?: string;
  director?: string;
  cast?: string[];
  
  // Legacy fields để backward compatibility
  _id?: string;
  name?: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  image?: string;
  time?: string;
  episode_current?: string;
  episode_total?: string;
  lang?: string;
  content?: string;
  status?: string;
  trailer_url?: string;
  chieurap?: boolean;
  created?: {
    time: string;
  };
  modified?: {
    time: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface EpisodeServer {
  serverName: string;
  episodes: EpisodeData[];
}

export interface EpisodeData {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number;
  videoUrl: string;
  thumbnail: string;
}

export interface ApiResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: any;
    breadCrumb: any[];
    titlePage: string;
    items: Movie[];
    params: {
      type_slug: string;
      filterCategory: any[];
      filterCountry: any[];
      filterYear: string;
      filterType: string;
      sortField: string;
      sortType: string;
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: Movie & {
    episodes: Episode[];
  };
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}