/**
 * Movie Helpers - Utility functions cho movie data
 */

export const movieHelpers = {
  // Kiểm tra loại phim
  isSingleMovie: (movie) => movie.type === 'single',
  isSeriesMovie: (movie) => movie.type === 'series',
  
  // Lấy thông tin hiển thị
  getDisplayYear: (movie) => movie.year || 'N/A',
  getDisplayEpisode: (movie) => movie.episode_current || 'N/A',
  getDisplayTitle: (movie) => movie.name || movie.origin_name || 'Unknown',
  
  // Lấy thông tin quốc gia
  getCountryName: (movie) => movie.country?.[0]?.name || 'Unknown',
  
  // Lấy danh sách thể loại
  getCategoryNames: (movie) => {
    return movie.category?.map(cat => cat.name) || [];
  },
  
  // Kiểm tra URL ảnh
  hasValidImage: (movie) => {
    return !!(movie.poster_url || movie.thumb_url);
  },
  
  // Format episode cho hiển thị
  formatEpisodeDisplay: (movie) => {
    if (!movie.episode_current) return movie.year || 'N/A';
    
    // Rút gọn text dài
    let episode = movie.episode_current;
    if (episode.length > 15) {
      episode = episode.substring(0, 12) + '...';
    }
    
    return episode;
  },
  
  // Debug info
  getDebugInfo: (movie) => {
    return {
      id: movie._id || movie.id,
      name: movie.name,
      type: movie.type,
      country: movieHelpers.getCountryName(movie),
      categories: movieHelpers.getCategoryNames(movie),
      hasImage: movieHelpers.hasValidImage(movie),
    };
  }
};

export default movieHelpers;