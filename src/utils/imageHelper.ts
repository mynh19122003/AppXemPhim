// utils/imageHelper.ts - Xử lý ảnh từ API theo tài liệu chính thức

import { API_CONFIG } from '../services/api/config';

/**
 * Tạo URL ảnh đầy đủ từ API
 * @param imageUrl - URL ảnh từ API response
 * @returns URL ảnh đầy đủ hoặc null nếu không có ảnh
 */
export const getFullImageUrl = (imageUrl?: string): string | null => {
  if (!imageUrl) return null;
  
  // Kiểm tra nếu URL đã đầy đủ (có http/https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // API phimapi.com trả về path như: upload/vod/20250907-1/xxx.jpg
  // Cần thêm domain phimimg.com theo API document
  return `https://phimimg.com/${imageUrl}`;
};

/**
 * Tạo URL ảnh thông qua proxy để tối ưu WEBP
 * Theo tài liệu: GET https://phimapi.com/image.php?url={liên kết ảnh từ KKPhim}
 * @param imageUrl - URL ảnh gốc từ API
 * @returns URL ảnh đã được tối ưu WEBP
 */
export const getOptimizedImageUrl = (imageUrl?: string): string | null => {
  if (!imageUrl) return null;
  
  // Lấy URL đầy đủ trước
  const fullImageUrl = getFullImageUrl(imageUrl);
  if (!fullImageUrl) return null;
  
  // Sử dụng image proxy chính thức để convert sang WEBP
  return `${API_CONFIG.IMAGE_PROXY}?url=${encodeURIComponent(fullImageUrl)}`;
};

/**
 * Lấy URL ảnh poster hoặc thumbnail
 * @param movie - Object phim từ API
 * @param optimized - Có sử dụng tối ưu WEBP không
 * @returns URL ảnh
 */
export const getMovieImageUrl = (
  movie: { poster_url?: string; thumb_url?: string }, 
  optimized: boolean = false  // Tắt optimization mặc định, chỉ dùng ảnh gốc
): string | null => {
  const imageUrl = movie.poster_url || movie.thumb_url;
  if (!imageUrl) return null;
  
  return optimized 
    ? getOptimizedImageUrl(imageUrl)
    : getFullImageUrl(imageUrl);
};