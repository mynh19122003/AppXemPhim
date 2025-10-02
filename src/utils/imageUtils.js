/**
 * Utility functions cho việc xử lý ảnh
 * Tuân thủ theo hướng dẫn copilot-instructions.md
 */
import {imageLogger} from './imageLogger';

// Cache cho URL ảnh đã chuyển đổi
const imageUrlCache = new Map();

/**
 * Chuyển đổi URL ảnh sang WEBP sử dụng API phimapi.com
 * @param {string} originalUrl - URL ảnh gốc
 * @returns {string|null} - URL ảnh đã chuyển đổi
 */
export const convertImageToWebP = (originalUrl) => {
  if (!originalUrl) return null;
  
  const startTime = Date.now();
  
  // Kiểm tra cache trước
  if (imageUrlCache.has(originalUrl)) {
    const cachedUrl = imageUrlCache.get(originalUrl);
    imageLogger.logImageRequest('webp', cachedUrl, Date.now() - startTime, true);
    return cachedUrl;
  }
  
  // Tạo URL ảnh đầy đủ
  let fullImageUrl = originalUrl;
  if (!originalUrl.startsWith('http')) {
    fullImageUrl = `https://phimimg.com/${originalUrl}`;
  }
  
  // Sử dụng API chuyển đổi ảnh sang WEBP
  const webpUrl = `https://phimapi.com/image.php?url=${encodeURIComponent(fullImageUrl)}`;
  
  // Lưu vào cache
  imageUrlCache.set(originalUrl, webpUrl);
  
  imageLogger.logImageRequest('webp', webpUrl, Date.now() - startTime, false);
  return webpUrl;
};

/**
 * Lấy URL ảnh gốc (fallback)
 * @param {string} originalUrl - URL ảnh gốc
 * @returns {string|null} - URL ảnh gốc đầy đủ
 */
export const getOriginalImageUrl = (originalUrl) => {
  if (!originalUrl) return null;
  
  const startTime = Date.now();
  let fullUrl;
  
  if (originalUrl.startsWith('http')) {
    fullUrl = originalUrl;
  } else {
    fullUrl = `https://phimimg.com/${originalUrl}`;
  }
  
  imageLogger.logImageRequest('original', fullUrl, Date.now() - startTime, false);
  return fullUrl;
};

/**
 * Lấy source ảnh với fallback
 * @param {string} imageUrl - URL ảnh
 * @param {boolean} useWebP - Có sử dụng WebP không
 * @returns {object} - Source object cho Image component
 */
export const getImageSource = (imageUrl, useWebP = true) => {
  if (!imageUrl) return null;
  
  const url = useWebP ? convertImageToWebP(imageUrl) : getOriginalImageUrl(imageUrl);
  return { uri: url };
};

/**
 * Clear cache ảnh
 */
export const clearImageCache = () => {
  imageUrlCache.clear();
  console.log('🗑️ Image cache cleared');
};

/**
 * Lấy kích thước cache
 */
export const getImageCacheSize = () => {
  return imageUrlCache.size;
};

/**
 * Log error và fallback
 */
export const logImageError = (url, error) => {
  imageLogger.logImageError(url, error);
};

/**
 * Lấy performance stats
 */
export const getImageStats = () => {
  return imageLogger.getStats();
};

/**
 * Print performance summary
 */
export const printImageSummary = () => {
  imageLogger.printSummary();
};