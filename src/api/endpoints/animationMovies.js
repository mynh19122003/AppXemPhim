/**
 * Animation Movies API - Xử lý phim hoạt hình
 */
import { apiClient } from '../client';
import { API_ENDPOINTS, DEFAULT_PARAMS } from '../config';

export class AnimationMoviesService {
  async getAnimationMovies(params = {}) {
    try {
      const requestParams = { ...DEFAULT_PARAMS, ...params };
      return await apiClient.request(API_ENDPOINTS.ANIMATION_MOVIES, requestParams);
    } catch (error) {
      console.error('🎌 Animation Movies Error:', error.message);
      throw error;
    }
  }

  async getPopularAnimationMovies() {
    return await this.getAnimationMovies({ page: 1, limit: 30 });
  }
}

export const animationMoviesService = new AnimationMoviesService();