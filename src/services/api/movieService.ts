// services/api/movieService.ts - Service xử lý API liên quan đến phim

import { API_CONFIG, DEFAULT_PARAMS } from './config';
import { ApiResponse, Movie, MovieDetailResponse } from '../../types/movie';

/**
 * Class chứa các hàm gọi API liên quan đến phim
 */
class MovieService {
  
  /**
   * Tạo URL đầy đủ cho API request
   * @param endpoint - Endpoint API
   * @param params - Các tham số query
   */
  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const url = new URL(API_CONFIG.BASE_URL + endpoint);
    
    // Thêm các tham số mặc định
    const allParams: Record<string, any> = { ...DEFAULT_PARAMS, ...params };
    
    Object.keys(allParams).forEach(key => {
      const value = allParams[key];
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  }

  /**
   * Gọi API và xử lý response
   * @param url - URL API
   */
  private async fetchData<T>(url: string): Promise<T> {
    try {
      console.log('🌐 Đang gọi API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API response thành công');
      return data;
      
    } catch (error) {
      console.error('❌ Lỗi khi gọi API:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phim mới cập nhật
   * @param page - Số trang (mặc định: 1)
   */
  async getNewMovies(page: number = 1): Promise<Movie[]> {
    try {
      const url = this.buildUrl(API_CONFIG.ENDPOINTS.NEW_MOVIES, { page });
      const response: any = await this.fetchData(url);
      
      // API "phim-moi-cap-nhat" trả về items trực tiếp
      if (response.status && response.items) {
        console.log(`📽️ Lấy được ${response.items.length} phim mới (trang ${page})`);
        return response.items;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy phim mới:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách phim lẻ
   * @param page - Số trang
   */
  async getSingleMovies(page: number = 1): Promise<Movie[]> {
    try {
      const url = this.buildUrl(API_CONFIG.ENDPOINTS.SINGLE_MOVIES, { page });
      const response: any = await this.fetchData(url);
      
      // API v1 trả về response.data.items
      if (response.status && response.data?.items) {
        console.log(`🎬 Lấy được ${response.data.items.length} phim lẻ (trang ${page})`);
        
        // Fix URLs ảnh bị thiếu domain
        const fixedMovies = response.data.items.map((movie: any) => ({
          ...movie,
          poster_url: movie.poster_url?.startsWith('http') 
            ? movie.poster_url 
            : `https://phimimg.com/${movie.poster_url}`,
          thumb_url: movie.thumb_url?.startsWith('http') 
            ? movie.thumb_url 
            : `https://phimimg.com/${movie.thumb_url}`,
        }));
        
        return fixedMovies;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy phim lẻ:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách phim bộ
   * @param page - Số trang
   */
  async getSeriesMovies(page: number = 1): Promise<Movie[]> {
    try {
      const url = this.buildUrl(API_CONFIG.ENDPOINTS.SERIES_MOVIES, { page });
      const response: any = await this.fetchData(url);
      
      // API v1 trả về response.data.items
      if (response.status && response.data?.items) {
        console.log(`📺 Lấy được ${response.data.items.length} phim bộ (trang ${page})`);
        
        // Fix URLs ảnh bị thiếu domain
        const fixedMovies = response.data.items.map((movie: any) => ({
          ...movie,
          poster_url: movie.poster_url?.startsWith('http') 
            ? movie.poster_url 
            : `https://phimimg.com/${movie.poster_url}`,
          thumb_url: movie.thumb_url?.startsWith('http') 
            ? movie.thumb_url 
            : `https://phimimg.com/${movie.thumb_url}`,
        }));
        
        return fixedMovies;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy phim bộ:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách phim hoạt hình/anime
   * @param page - Số trang
   */
  async getAnimeMovies(page: number = 1): Promise<Movie[]> {
    try {
      const url = this.buildUrl(API_CONFIG.ENDPOINTS.ANIME_MOVIES, { page });
      const response: any = await this.fetchData(url);
      
      // API v1 trả về cấu trúc khác: response.data.items thay vì response.items
      if (response.status && response.data?.items) {
        console.log(`🎌 Lấy được ${response.data.items.length} phim anime (trang ${page})`);
        
        // Fix URLs ảnh bị thiếu domain
        const fixedMovies = response.data.items.map((movie: any) => ({
          ...movie,
          poster_url: movie.poster_url?.startsWith('http') 
            ? movie.poster_url 
            : `https://phimimg.com/${movie.poster_url}`,
          thumb_url: movie.thumb_url?.startsWith('http') 
            ? movie.thumb_url 
            : `https://phimimg.com/${movie.thumb_url}`,
        }));
        
        return fixedMovies;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Lỗi khi lấy phim anime:', error);
      return [];
    }
  }

  /**
   * Lấy phim theo quốc gia
   * @param countrySlug - Slug quốc gia (vd: 'au-my', 'han-quoc')
   * @param page - Số trang
   */
  async getMoviesByCountry(countrySlug: string, page: number = 1): Promise<Movie[]> {
    try {
      // Build URL manually cho country endpoint
      const endpoint = `/v1/api/quoc-gia/${countrySlug}`;
      const url = this.buildUrl(endpoint, { page });
      const response: any = await this.fetchData(url);
      
      // API v1 trả về response.data.items
      if (response.status && response.data?.items) {
        console.log(`🌍 Lấy được ${response.data.items.length} phim ${countrySlug} (trang ${page})`);
        
        // Fix URLs ảnh bị thiếu domain
        const fixedMovies = response.data.items.map((movie: any) => ({
          ...movie,
          poster_url: movie.poster_url?.startsWith('http') 
            ? movie.poster_url 
            : `https://phimimg.com/${movie.poster_url}`,
          thumb_url: movie.thumb_url?.startsWith('http') 
            ? movie.thumb_url 
            : `https://phimimg.com/${movie.thumb_url}`,
        }));
        
        return fixedMovies;
      }
      
      return [];
    } catch (error) {
      console.error(`❌ Lỗi khi lấy phim ${countrySlug}:`, error);
      return [];
    }
  }

  /**
   * Lấy phim US-UK
   */
  async getUSUKMovies(page: number = 1): Promise<Movie[]> {
    return this.getMoviesByCountry(API_CONFIG.COUNTRIES.US, page);
  }

  /**
   * Lấy phim Hàn Quốc
   */
  async getKoreanMovies(page: number = 1): Promise<Movie[]> {
    return this.getMoviesByCountry(API_CONFIG.COUNTRIES.KOREA, page);
  }

  /**
   * Tìm kiếm phim
   * @param keyword - Từ khóa tìm kiếm
   * @param page - Số trang
   */
  async searchMovies(keyword: string, page: number = 1): Promise<Movie[]> {
    try {
      const url = this.buildUrl(API_CONFIG.ENDPOINTS.SEARCH, { 
        keyword: encodeURIComponent(keyword),
        page 
      });
      const response: ApiResponse = await this.fetchData(url);
      
      if (response.status && response.data?.items) {
        console.log(`🔍 Tìm được ${response.data.items.length} kết quả cho "${keyword}"`);
        return response.data.items;
      }
      
      return [];
    } catch (error) {
      console.error(`❌ Lỗi khi tìm kiếm "${keyword}":`, error);
      return [];
    }
  }

  /**
   * Lấy chi tiết phim
   * @param slug - Slug của phim
   */
  async getMovieDetail(slug: string): Promise<Movie | null> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOVIE_DETAIL}/${slug}`;
      const response: MovieDetailResponse = await this.fetchData(url);
      
      if (response.status && response.movie) {
        console.log(`🎬 Lấy chi tiết phim: ${response.movie.name}`);
        return response.movie;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Lỗi khi lấy chi tiết phim ${slug}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const movieService = new MovieService();
export default movieService;