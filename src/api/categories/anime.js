/**
 * Anime Category - Filter và xử lý phim anime
 */

export class AnimeCategory {
  static filterJapaneseAnime(movies) {
    try {
      const filtered = movies.filter(movie => {
        const country = movie.country?.[0]?.name || '';
        const categories = movie.category?.map(cat => cat.name.toLowerCase()) || [];
        
        return country.toLowerCase().includes('nhật') || 
               country.toLowerCase().includes('japan') ||
               categories.includes('hoạt hình');
      });
      
      console.log('🎌 Anime filtered:', filtered.length, 'from', movies.length);
      return filtered.slice(0, 15);
    } catch (error) {
      console.error('🎌 Anime Filter Error:', error.message);
      return [];
    }
  }

  static isAnime(movie) {
    const country = movie.country?.[0]?.name || '';
    const categories = movie.category?.map(cat => cat.name.toLowerCase()) || [];
    
    return country.toLowerCase().includes('nhật') || 
           country.toLowerCase().includes('japan') ||
           categories.includes('hoạt hình');
  }
}

export default AnimeCategory;