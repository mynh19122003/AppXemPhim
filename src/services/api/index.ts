// services/api/index.ts - Export tất cả services

export { movieService as default, movieService } from './movieService';
export { API_CONFIG, DEFAULT_PARAMS } from './config';
export type { Movie, ApiResponse, MovieDetailResponse, Category, Country, Episode, EpisodeData } from '../../types/movie';