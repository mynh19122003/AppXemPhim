// utils/movieHelper.ts - Xử lý dữ liệu phim

import { Movie } from '../types/movie';

/**
 * Lấy thông tin hiển thị cho phim (thời lượng, số tập, năm)
 * @param movie - Object phim
 * @param showDuration - Có hiển thị thời lượng cho phim lẻ không
 * @returns Chuỗi thông tin hiển thị
 */
export const getMovieDisplayInfo = (movie: Movie, showDuration: boolean = false): string => {
  // Kiểm tra movie có hợp lệ không
  if (!movie || typeof movie !== 'object') {
    return '⭐ N/A';
  }

  // Hiển thị thời lượng cho phim lẻ (ưu tiên field mới)
  if (showDuration && (movie.duration || movie.time)) {
    const duration = movie.duration ? `${movie.duration} phút` : String(movie.time);
    return `⏱ ${duration}`;
  }
  
  // Hiển thị số tập cho phim bộ (ưu tiên field mới)
  if (movie.totalEpisodes || movie.episode_total) {
    const episodes = movie.totalEpisodes || movie.episode_total;
    return `📺 ${String(episodes)} tập`;
  }
  
  if (movie.currentEpisode || movie.episode_current) {
    const current = movie.currentEpisode || movie.episode_current;
    return `📺 ${String(current)}`;
  }
  
  // Mặc định hiển thị năm - đảm bảo luôn trả về string
  return `⭐ ${String(movie.year || 'N/A')}`;
};

/**
 * Lấy tên phim (ưu tiên tên gốc, fallback sang tên dịch)
 * @param movie - Object phim
 * @returns Tên phim
 */
export const getMovieTitle = (movie: Movie): string => {
  // Kiểm tra movie có hợp lệ không
  if (!movie || typeof movie !== 'object') {
    return 'Không có tên';
  }
  
  // Lấy tên từ các field khác nhau và đảm bảo trả về string
  const title = movie.title || movie.name || movie.originalTitle || movie.origin_name;
  return String(title || 'Không có tên');
};

/**
 * Lấy mô tả phim (loại bỏ HTML tags)
 * @param movie - Object phim
 * @param maxLength - Độ dài tối đa (mặc định: không giới hạn)
 * @returns Mô tả phim đã được làm sạch
 */
export const getMovieDescription = (movie: Movie, maxLength?: number): string => {
  let description = (movie.description || movie.content)?.replace(/<[^>]*>/g, '') || 'Mô tả không có sẵn';
  
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
  // Kiểm tra movie có hợp lệ không
  if (!movie || typeof movie !== 'object') {
    return [];
  }

  // Ưu tiên field mới
  if (movie.genres && Array.isArray(movie.genres)) {
    const genres = movie.genres.map(genre => 
      typeof genre === 'object' && genre !== null 
        ? ((genre as any).name || (genre as any).title || String(genre))
        : String(genre || '')
    );
    return limit ? genres.slice(0, limit) : genres;
  }
  
  // Fallback sang categories
  if (!movie.categories || !Array.isArray(movie.categories)) return [];
  
  const genres = movie.categories.map((cat: any) => {
    if (typeof cat === 'object' && cat !== null) {
      return cat.name || cat.title || String(cat);
    }
    return String(cat || '');
  }).filter(Boolean); // Loại bỏ string rỗng
  
  return limit ? genres.slice(0, limit) : genres;
};

/**
 * Lấy quốc gia phim
 * @param movie - Object phim
 * @returns Tên quốc gia hoặc chuỗi rỗng
 */
export const getMovieCountry = (movie: Movie): string => {
  // Ưu tiên field mới
  if (movie.country && typeof movie.country === 'string') {
    return movie.country;
  }
  
  // Fallback sang field cũ (array)
  if (movie.countryData && Array.isArray(movie.countryData)) {
    return movie.countryData[0]?.name || '';
  }
  
  return '';
};

/**
 * Kiểm tra phim có phải là phim bộ không
 * @param movie - Object phim
 * @returns true nếu là phim bộ
 */
export const isSeriesMovie = (movie: Movie): boolean => {
  // Ưu tiên field mới
  if (movie.totalEpisodes && movie.totalEpisodes > 1) return true;
  if (movie.type === 'series' || movie.type === 'tv') return true;
  
  // Fallback sang field cũ
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