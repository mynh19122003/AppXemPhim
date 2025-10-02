/**
 * Series Movies API - Xử lý phim bộ
 */
import { apiClient } from '../client';
import { API_ENDPOINTS, DEFAULT_PARAMS } from '../config';

export class SeriesMoviesService {
  async getSeriesMovies(params = {}) {
    try {
      const requestParams = { ...DEFAULT_PARAMS, ...params };
      return await apiClient.request(API_ENDPOINTS.SERIES_MOVIES, requestParams);
    } catch (error) {
      console.error('📺 Series Movies Error:', error.message);
      throw error;
    }
  }

  async getPopularSeriesMovies() {
    return await this.getSeriesMovies({ page: 1, limit: 15 });
  }
}

export const seriesMoviesService = new SeriesMoviesService();