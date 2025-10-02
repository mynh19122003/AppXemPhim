/**
 * API Configuration - Cấu hình chính cho tất cả API calls
 * Dễ debug và thay đổi base URL
 */

export const API_CONFIG = {
  BASE_URL: 'https://phimapi.com',
  IMAGE_BASE_URL: 'https://phimimg.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const API_ENDPOINTS = {
  // Phim mới nhất
  LATEST_MOVIES: '/danh-sach/phim-moi-cap-nhat',
  
  // Phim theo loại
  SINGLE_MOVIES: '/v1/api/danh-sach/phim-le',
  SERIES_MOVIES: '/v1/api/danh-sach/phim-bo', 
  ANIMATION_MOVIES: '/v1/api/danh-sach/hoat-hinh',
  
  // Phim theo quốc gia
  JAPANESE_MOVIES: '/quoc-gia/nhat-ban',
  US_UK_MOVIES: '/quoc-gia/au-my',
  KOREAN_MOVIES: '/quoc-gia/han-quoc',
  
  // Khác
  MOVIE_DETAIL: '/phim',
  SEARCH: '/v1/api/tim-kiem',
  CATEGORIES: '/v1/api/the-loai',
  COUNTRIES: '/v1/api/quoc-gia',
};

export const DEFAULT_PARAMS = {
  page: 1,
  limit: 15,
};