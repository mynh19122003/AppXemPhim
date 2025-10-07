// utils/movieHelper.ts - Xử lý dữ liệu phim

import { Movie } from '../types/movie';

/**
 * Lấy thông tin hiển thị cho phim (thời lượng, số tập, năm)
 * @param movie - Object phim
 * @param showDuration - Có hiển thị thời lượng cho phim lẻ không
 * @returns Chuỗi thông tin hiển thị
 */
export const getMovieDisplayInfo = (movie: Movie, showDuration: boolean = false): string => {
  // Hiển thị thời lượng cho phim lẻ
  if (showDuration && movie.time) {
    return `⏱ ${movie.time}`;
  }
  
  // Hiển thị số tập cho phim bộ
  if (movie.episode_total) {
    return `📺 ${movie.episode_total} tập`;
  }
  
  if (movie.episode_current) {
    return `📺 ${movie.episode_current}`;
  }
  
  // Mặc định hiển thị năm
  return `⭐ ${movie.year || 'N/A'}`;
};

/**
 * Lấy tên phim (ưu tiên tên gốc, fallback sang tên dịch)
 * @param movie - Object phim
 * @returns Tên phim
 */
export const getMovieTitle = (movie: Movie): string => {
  return movie.name || movie.origin_name || 'Không có tên';
};

/**
 * Lấy mô tả phim (loại bỏ HTML tags)
 * @param movie - Object phim
 * @param maxLength - Độ dài tối đa (mặc định: không giới hạn)
 * @returns Mô tả phim đã được làm sạch
 */
export const getMovieDescription = (movie: Movie, maxLength?: number): string => {
  let description = movie.content?.replace(/<[^>]*>/g, '') || 'Mô tả không có sẵn';
  
  if (maxLength && description.length > maxLength) {
    description = description.substring(0, maxLength) + '...';
  }
  
  return description;
};

/**
 * Lấy danh sách thể loại phim
 * @param movie - Object phim
 * @param limit - Số lượng thể loại hiển thị tối đa
 * @returns Mảng tên thể loại
 */
export const getMovieGenres = (movie: Movie, limit?: number): string[] => {
  if (!movie.category) return [];
  
  const genres = movie.category.map(cat => cat.name);
  
  return limit ? genres.slice(0, limit) : genres;
};

/**
 * Lấy quốc gia phim
 * @param movie - Object phim
 * @returns Tên quốc gia hoặc chuỗi rỗng
 */
export const getMovieCountry = (movie: Movie): string => {
  return movie.country?.[0]?.name || '';
};

/**
 * Kiểm tra phim có phải là phim bộ không
 * @param movie - Object phim
 * @returns true nếu là phim bộ
 */
export const isSeriesMovie = (movie: Movie): boolean => {
  return !!(movie.episode_total || movie.episode_current);
};

/**
 * Kiểm tra phim có phải là phim lẻ không
 * @param movie - Object phim
 * @returns true nếu là phim lẻ
 */
export const isSingleMovie = (movie: Movie): boolean => {
  return !isSeriesMovie(movie);
};

/**
 * Format thời gian từ ISO string sang dạng dễ đọc
 * @param timeString - Chuỗi thời gian ISO
 * @returns Chuỗi thời gian đã format
 */
export const formatMovieTime = (timeString?: string): string => {
  if (!timeString) return '';
  
  try {
    const date = new Date(timeString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
};