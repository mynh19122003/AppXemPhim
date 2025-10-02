/**
 * Định nghĩa các kiểu dữ liệu cho API phimapi.com
 * Tuân thủ theo hướng dẫn copilot-instructions.md
 */

// Kiểu dữ liệu cơ bản cho phim
export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  content: string;
  type: string;
  status: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  category: Category[];
  country: Country[];
  actor: string[];
  director: string[];
  chieurap: boolean;
  trailer_url: string;
  modified: {
    time: string;
  };
}

// Kiểu dữ liệu cho thể loại
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Kiểu dữ liệu cho quốc gia
export interface Country {
  id: string;
  name: string;
  slug: string;
}

// Kiểu dữ liệu cho tập phim
export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

// Kiểu dữ liệu cho response danh sách phim
export interface MoviesListResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Movie[];
    params: {
      type_slug: string;
      filterCategory: string[];
      filterCountry: string[];
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

// Kiểu dữ liệu cho chi tiết phim
export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: {
    created: {
      time: string;
    };
    modified: {
      time: string;
    };
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    content: string;
    type: string;
    status: string;
    poster_url: string;
    thumb_url: string;
    is_copyright: boolean;
    sub_docquyen: boolean;
    chieurap: boolean;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    notify: string;
    showtimes: string;
    year: number;
    view: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
  };
  episodes: Episode[];
}

// Kiểu dữ liệu cho breadcrumb
export interface BreadCrumb {
  name: string;
  slug?: string;
  isCurrent?: boolean;
}

// Kiểu dữ liệu cho tham số API
export interface ApiParams {
  page?: number;
  sort_field?: 'modified.time' | '_id' | 'year';
  sort_type?: 'desc' | 'asc';
  sort_lang?: 'vietsub' | 'thuyet-minh' | 'long-tieng';
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
  keyword?: string;
}

// Kiểu dữ liệu cho response tìm kiếm
export interface SearchResponse extends MoviesListResponse {}

// Kiểu dữ liệu cho response thể loại
export interface CategoriesResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Category[];
  };
}

// Kiểu dữ liệu cho response quốc gia
export interface CountriesResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Country[];
  };
}

// Enum cho loại danh sách phim
export enum MovieListType {
  PHIM_BO = 'phim-bo',
  PHIM_LE = 'phim-le',
  TV_SHOWS = 'tv-shows',
  HOAT_HINH = 'hoat-hinh',
  PHIM_VIETSUB = 'phim-vietsub',
  PHIM_THUYET_MINH = 'phim-thuyet-minh',
  PHIM_LONG_TIENG = 'phim-long-tieng'
}

// Enum cho loại sắp xếp
export enum SortField {
  MODIFIED_TIME = 'modified.time',
  ID = '_id',
  YEAR = 'year'
}

export enum SortType {
  DESC = 'desc',
  ASC = 'asc'
}

export enum SortLang {
  VIETSUB = 'vietsub',
  THUYET_MINH = 'thuyet-minh',
  LONG_TIENG = 'long-tieng'
}