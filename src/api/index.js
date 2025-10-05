/**
 * API Index - Export tất cả API services
 * Centralized import cho dễ debug
 */

// Configuration
export { API_CONFIG, API_ENDPOINTS, DEFAULT_PARAMS } from './config';

// HTTP Client
export { apiClient } from './client';

// Endpoint Services
export { latestMoviesService, LatestMoviesService } from './endpoints/latestMovies';
export { singleMoviesService, SingleMoviesService } from './endpoints/singleMovies'; 
export { seriesMoviesService, SeriesMoviesService } from './endpoints/seriesMovies';
export { animationMoviesService, AnimationMoviesService } from './endpoints/animationMovies';
export { movieDetailService, MovieDetailService } from './endpoints/movieDetail';

// Category Filters
export { default as AnimeCategory } from './categories/anime';
export { default as UsUkCategory } from './categories/usUk';
export { default as KoreanCategory } from './categories/korean';

// Convenience exports for backward compatibility
export const fetchMoviesFromAPI = (endpoint, params = {}) => {
  return apiClient.request(endpoint, params);
};

export default {
  apiClient,
  latestMoviesService,
  singleMoviesService,
  seriesMoviesService,
  animationMoviesService,
  movieDetailService,
  AnimeCategory,
  UsUkCategory,
  KoreanCategory,
};