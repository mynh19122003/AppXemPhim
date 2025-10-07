// Base URL API cho dự án
const API_BASE_URL = 'https://phimapi.com';

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

export interface MovieDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  year: number;
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes?: EpisodeServer[];
}

export interface MoviesListResponse {
  status: boolean;
  msg: string;
  data: {
    items: MovieDetail[];
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
  };
}

export interface NewMoviesResponse {
  status: boolean;
  msg: string;
  items: MovieDetail[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ApiOptions {
  page?: number;
  limit?: number;
  sort_field?: 'modified.time' | '_id' | 'year';
  sort_type?: 'desc' | 'asc';
  sort_lang?: 'vietsub' | 'thuyet-minh' | 'long-tieng';
  category?: string;
  country?: string;
  year?: number;
}

class MovieService {
  private async fetchData<T>(url: string): Promise<T> {
    try {
      console.log('🌐 Gọi API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response thành công');
      
      return data;
    } catch (error) {
      console.error('❌ Lỗi API:', error);
      throw error;
    }
  }

  /**
   * Build query string từ options
   */
  private buildQueryString(options: ApiOptions): string {
    const params: string[] = [];
    
    if (options.page) params.push(`page=${options.page}`);
    if (options.limit) params.push(`limit=${options.limit}`);
    if (options.sort_field) params.push(`sort_field=${options.sort_field}`);
    if (options.sort_type) params.push(`sort_type=${options.sort_type}`);
    if (options.sort_lang) params.push(`sort_lang=${options.sort_lang}`);
    if (options.category) params.push(`category=${options.category}`);
    if (options.country) params.push(`country=${options.country}`);
    if (options.year) params.push(`year=${options.year}`);
    
    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  async getNewMovies(page: number = 1): Promise<MoviesListResponse | null> {
    try {
      // Thử phiên bản v3 trước (theo documentation có nhiều kết quả khác nhau)
      try {
        const urlV3 = `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
        const responseV3 = await this.fetchData<NewMoviesResponse>(urlV3);
        
        if (responseV3 && responseV3.items && responseV3.items.length > 0) {
          console.log('✅ Sử dụng API v3 cho phim mới');
          return this.convertNewMoviesResponse(responseV3);
        }
      } catch (errorV3) {
        console.log('⚠️ API v3 không khả dụng, thử v2...');
      }

      // Fallback sang v2
      try {
        const urlV2 = `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat-v2?page=${page}`;
        const responseV2 = await this.fetchData<NewMoviesResponse>(urlV2);
        
        if (responseV2 && responseV2.items && responseV2.items.length > 0) {
          console.log('✅ Sử dụng API v2 cho phim mới');
          return this.convertNewMoviesResponse(responseV2);
        }
      } catch (errorV2) {
        console.log('⚠️ API v2 không khả dụng, thử v1...');
      }

      // Fallback cuối cùng sang v1 (original)
      const urlV1 = `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`;
      const responseV1 = await this.fetchData<NewMoviesResponse>(urlV1);
      
      if (responseV1 && responseV1.items) {
        console.log('✅ Sử dụng API v1 cho phim mới');
        return this.convertNewMoviesResponse(responseV1);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách phim mới (tất cả phiên bản):', error);
      return null;
    }
  }

  /**
   * Helper method để convert NewMoviesResponse sang MoviesListResponse
   */
  private convertNewMoviesResponse(response: NewMoviesResponse): MoviesListResponse {
    return {
      status: response.status,
      msg: response.msg,
      data: {
        items: response.items,
        params: {
          pagination: response.pagination
        }
      }
    };
  }

  async getSingleMovies(options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/danh-sach/phim-le${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi lấy phim lẻ:', error);
      return null;
    }
  }

  async getSeriesMovies(options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/danh-sach/phim-bo${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi lấy phim bộ:', error);
      return null;
    }
  }

  async getAnimeMovies(options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        // Filter để chỉ lấy hoạt hình Nhật Bản
        country: 'nhat-ban',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      // Sử dụng endpoint hoạt hình với filter quốc gia Nhật Bản
      const url = `${API_BASE_URL}/v1/api/danh-sach/hoat-hinh${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi lấy anime Nhật Bản:', error);
      return null;
    }
  }

  async getKoreanMovies(options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/quoc-gia/han-quoc${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi lấy phim Hàn Quốc:', error);
      return null;
    }
  }

  async getUSUKMovies(options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/quoc-gia/au-my${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi lấy phim Âu Mỹ:', error);
      return null;
    }
  }

  async searchMovies(keyword: string, options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      // Đúng theo documentation: keyword làm parameter đầu tiên, các params khác nối bằng &
      const url = `${API_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}${queryString ? '&' + queryString.substring(1) : ''}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm phim:', error);
      return null;
    }
  }

  async getMoviesByCategory(categorySlug: string, options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/the-loai/${categorySlug}${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error(`❌ Lỗi lấy phim thể loại ${categorySlug}:`, error);
      return null;
    }
  }

  async getMoviesByCountry(countrySlug: string, options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/quoc-gia/${countrySlug}${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error(`❌ Lỗi lấy phim quốc gia ${countrySlug}:`, error);
      return null;
    }
  }

  async getMoviesByYear(year: number, options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/nam/${year}${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error(`❌ Lỗi lấy phim năm ${year}:`, error);
      return null;
    }
  }

  async getCategories(): Promise<any> {
    try {
      const url = `${API_BASE_URL}/the-loai`;
      return await this.fetchData(url);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách thể loại:', error);
      return null;
    }
  }

  async getCountries(): Promise<any> {
    try {
      const url = `${API_BASE_URL}/quoc-gia`;
      return await this.fetchData(url);
    } catch (error) {
      console.error('❌ Lỗi lấy danh sách quốc gia:', error);
      return null;
    }
  }

  // ===== ADDITIONAL API METHODS =====

  /**
   * Lấy danh sách phim theo type_list với options đầy đủ
   * type_list: phim-bo, phim-le, tv-shows, hoat-hinh, phim-vietsub, phim-thuyet-minh, phim-long-tieng
   */
  async getMoviesByType(typeList: string, options: ApiOptions = {}): Promise<MoviesListResponse | null> {
    try {
      const defaultOptions: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...options
      };
      
      const queryString = this.buildQueryString(defaultOptions);
      const url = `${API_BASE_URL}/v1/api/danh-sach/${typeList}${queryString}`;
      return await this.fetchData<MoviesListResponse>(url);
    } catch (error) {
      console.error(`❌ Lỗi lấy phim type ${typeList}:`, error);
      return null;
    }
  }

  /**
   * Lấy phim theo TMDB ID
   */
  async getMovieByTMDB(type: 'tv' | 'movie', id: number): Promise<any> {
    try {
      const url = `${API_BASE_URL}/tmdb/${type}/${id}`;
      return await this.fetchData(url);
    } catch (error) {
      console.error(`❌ Lỗi lấy phim TMDB ${type}/${id}:`, error);
      return null;
    }
  }

  /**
   * Advanced search với tất cả filters
   */
  async advancedSearch(keyword: string, filters: {
    sort_lang?: 'vietsub' | 'thuyet-minh' | 'long-tieng';
    category?: string;
    country?: string;
    year?: number;
    page?: number;
    limit?: number;
    sort_field?: 'modified.time' | '_id' | 'year';
    sort_type?: 'desc' | 'asc';
  } = {}): Promise<MoviesListResponse | null> {
    try {
      const options: ApiOptions = {
        page: 1,
        limit: 20,
        sort_field: 'modified.time',
        sort_type: 'desc',
        ...filters
      };
      
      return await this.searchMovies(keyword, options);
    } catch (error) {
      console.error('❌ Lỗi advanced search:', error);
      return null;
    }
  }
}

const movieService = new MovieService();
export default movieService;
