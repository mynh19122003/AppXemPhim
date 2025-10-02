/**
 * Latest Movies API - Xử lý phim mới nhất
 * Dễ debug và maintain
 */
import { apiClient } from '../client';
import { API_ENDPOINTS, DEFAULT_PARAMS } from '../config';

export class LatestMoviesService {
  async getLatestMovies(params = {}) {
    try {
      const requestParams = { ...DEFAULT_PARAMS, ...params };
      return await apiClient.request(API_ENDPOINTS.LATEST_MOVIES, requestParams);
    } catch (error) {
      console.error('🔥 Latest Movies Error:', error.message);
      throw error;
    }
  }

  async getFeaturedMovie() {
    try {
      const response = await this.getLatestMovies({ limit: 1 });
      return response.data?.items?.[0] || null;
    } catch (error) {
      console.error('🔥 Featured Movie Error:', error.message);
      return null;
    }
  }
}

export const latestMoviesService = new LatestMoviesService();