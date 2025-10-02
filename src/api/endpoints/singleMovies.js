/**
 * Single Movies API - Xử lý phim lẻ
 */
import { apiClient } from '../client';
import { API_ENDPOINTS, DEFAULT_PARAMS } from '../config';

export class SingleMoviesService {
  async getSingleMovies(params = {}) {
    try {
      const requestParams = { ...DEFAULT_PARAMS, ...params };
      return await apiClient.request(API_ENDPOINTS.SINGLE_MOVIES, requestParams);
    } catch (error) {
      console.error('🎬 Single Movies Error:', error.message);
      throw error;
    }
  }

  async getPopularSingleMovies() {
    return await this.getSingleMovies({ page: 1, limit: 15 });
  }
}

export const singleMoviesService = new SingleMoviesService();