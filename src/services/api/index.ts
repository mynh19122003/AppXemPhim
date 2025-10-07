// services/api/index.ts - Export tất cả services

export { default as movieService } from './movieService';
export { movieDetailService } from './movieDetailService';
export type { Movie, ApiResponse, MovieDetailResponse, Category, Country, Episode, EpisodeData } from '../../types/movie';