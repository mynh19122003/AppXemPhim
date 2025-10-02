/**
 * US-UK Category - Filter và xử lý phim Âu Mỹ
 */

export class UsUkCategory {
  static filterUSUKMovies(movies) {
    try {
      const filtered = movies.filter(movie => {
        const country = movie.country?.[0]?.name || '';
        return country.toLowerCase().includes('âu mỹ') || 
               country.toLowerCase().includes('us') ||
               country.toLowerCase().includes('uk') ||
               country.toLowerCase().includes('mỹ');
      });
      
      console.log('🇺🇸 US-UK filtered:', filtered.length, 'from', movies.length);
      return filtered.slice(0, 15);
    } catch (error) {
      console.error('🇺🇸 US-UK Filter Error:', error.message);
      return [];
    }
  }

  static isUSUK(movie) {
    const country = movie.country?.[0]?.name || '';
    return country.toLowerCase().includes('âu mỹ') || 
           country.toLowerCase().includes('us') ||
           country.toLowerCase().includes('uk') ||
           country.toLowerCase().includes('mỹ');
  }
}

export default UsUkCategory;