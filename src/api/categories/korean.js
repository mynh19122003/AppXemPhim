/**
 * Korean Category - Filter và xử lý phim Hàn Quốc
 */

export class KoreanCategory {
  static filterKoreanMovies(movies) {
    try {
      const filtered = movies.filter(movie => {
        const country = movie.country?.[0]?.name || '';
        return country.toLowerCase().includes('hàn') || 
               country.toLowerCase().includes('korea') ||
               country.toLowerCase().includes('hàn quốc');
      });
      
      console.log('🇰🇷 Korean filtered:', filtered.length, 'from', movies.length);
      return filtered.slice(0, 15);
    } catch (error) {
      console.error('🇰🇷 Korean Filter Error:', error.message);
      return [];
    }
  }

  static isKorean(movie) {
    const country = movie.country?.[0]?.name || '';
    return country.toLowerCase().includes('hàn') || 
           country.toLowerCase().includes('korea') ||
           country.toLowerCase().includes('hàn quốc');
  }
}

export default KoreanCategory;