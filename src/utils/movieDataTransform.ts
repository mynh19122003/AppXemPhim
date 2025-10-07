// utils/movieDataTransform.ts
// Helper functions để chuyển đổi dữ liệu từ MovieService sang Movie type

import { Movie } from '../types/movie';

// Convert MovieDetail từ movieService thành Movie type
export function transformMovieDetailToMovie(movieDetail: any): Movie {
  return {
    id: movieDetail.slug || movieDetail._id || '',
    title: movieDetail.name || '',
    originalTitle: movieDetail.origin_name || '',
    slug: movieDetail.slug || '',
    description: movieDetail.content || 'Chưa có mô tả',
    poster: convertImageUrl(movieDetail.poster_url || movieDetail.thumb_url || ''),
    thumbnail: convertImageUrl(movieDetail.thumb_url || movieDetail.poster_url || ''),
    backdrop: convertImageUrl(movieDetail.poster_url || ''),
    rating: movieDetail.tmdb?.vote_average || 6.0,
    imdbRating: movieDetail.imdb?.rating || 0,
    voteAverage: movieDetail.tmdb?.vote_average,
    voteCount: movieDetail.tmdb?.vote_count,
    totalEpisodes: extractTotalEpisodes(movieDetail.episode_current, movieDetail.episode_total),
    currentEpisode: extractCurrentEpisode(movieDetail.episode_current),
    year: movieDetail.year || new Date().getFullYear(),
    country: Array.isArray(movieDetail.country) 
      ? (movieDetail.country[0]?.name || String(movieDetail.country[0] || ''))
      : (movieDetail.country?.name || String(movieDetail.country || 'N/A')),
    countryData: Array.isArray(movieDetail.country) 
      ? movieDetail.country.map((c: any) => ({
          id: String(c.id || c.slug || ''),
          name: String(c.name || c.title || c || ''),
          slug: String(c.slug || '')
        })).filter((item: any) => item.name)
      : (movieDetail.country ? [{
          id: String(movieDetail.country.id || movieDetail.country.slug || ''),
          name: String(movieDetail.country.name || movieDetail.country.title || movieDetail.country || ''),
          slug: String(movieDetail.country.slug || '')
        }].filter((item: any) => item.name) : []),
    genres: Array.isArray(movieDetail.category)
      ? movieDetail.category.map((cat: any) => 
          typeof cat === 'object' && cat !== null 
            ? (cat.name || cat.title || String(cat))
            : String(cat || '')
        ).filter(Boolean)
      : [movieDetail.category?.name || 'Phim'],
    categories: Array.isArray(movieDetail.category)
      ? movieDetail.category.map((cat: any) => {
          if (typeof cat === 'object' && cat !== null) {
            return {
              id: String(cat.id || cat.slug || ''),
              name: String(cat.name || cat.title || ''),
              slug: String(cat.slug || '')
            };
          }
          return {
            id: String(cat || ''),
            name: String(cat || ''),
            slug: String(cat || '')
          };
        }).filter((item: any) => item.name) // Chỉ giữ lại items có name
      : movieDetail.category ? [{
          id: String(movieDetail.category.id || movieDetail.category.slug || ''),
          name: String(movieDetail.category.name || movieDetail.category.title || ''),
          slug: String(movieDetail.category.slug || '')
        }].filter((item: any) => item.name) : [],
    duration: parseDuration(movieDetail.time) || 120,
    quality: movieDetail.quality || movieDetail.lang || 'HD',
    isCompleted: movieDetail.status === 'completed' || movieDetail.episode_current === movieDetail.episode_total,
    episodes: movieDetail.episodes || [],
    views: movieDetail.view || 0,
    type: determineMovieType(movieDetail),
    apiType: movieDetail.type,
    tmdbId: movieDetail.tmdb?.id,
    trailer: movieDetail.trailer_url || '',
    releaseDate: movieDetail.created?.time || new Date().toISOString(),
    director: Array.isArray(movieDetail.director) ? movieDetail.director.join(', ') : movieDetail.director || '',
    cast: Array.isArray(movieDetail.actor) ? movieDetail.actor : [],
  };
}

// Transform array of MovieDetail to Movie array
export function transformMovieDetailArrayToMovieArray(movieDetails: any[]): Movie[] {
  return movieDetails.map(transformMovieDetailToMovie);
}

// Helper functions
function convertImageUrl(url: string): string {
  if (!url || url === 'null' || url === 'undefined') {
    return 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg';
  }
  
  try {
    let cleanUrl = url.trim();
    
    if (cleanUrl.includes('phimapi.com/image.php')) {
      return cleanUrl;
    }
    
    if (cleanUrl.includes('phimimg.com') || cleanUrl.includes('phimapi.com')) {
      cleanUrl = cleanUrl.replace('http://', 'https://').split('?')[0];
    } else if (cleanUrl.startsWith('/')) {
      cleanUrl = `https://phimimg.com${cleanUrl}`;
    } else if (!cleanUrl.startsWith('http') && cleanUrl.includes('.')) {
      if (cleanUrl.includes('upload/vod/')) {
        cleanUrl = `https://phimimg.com/${cleanUrl}`;
      } else {
        cleanUrl = `https://phimimg.com/upload/vod/${cleanUrl}`;
      }
    } else {
      cleanUrl = 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg';
    }
    
    const encodedUrl = encodeURIComponent(cleanUrl);
    return `https://phimapi.com/image.php?url=${encodedUrl}&quality=90&format=webp`;
  } catch (error) {
    return 'https://phimimg.com/upload/vod/20220309-1/2022030915165476.jpg';
  }
}

function extractCurrentEpisode(episodeCurrent: string): number | undefined {
  if (!episodeCurrent) return undefined;
  
  const tapMatch = episodeCurrent.match(/Tập\s*(\d+)/);
  if (tapMatch) {
    return parseInt(tapMatch[1]);
  }
  
  const hoanTatMatch = episodeCurrent.match(/Hoàn Tất\s*\((\d+)\/(\d+)\)/);
  if (hoanTatMatch) {
    return parseInt(hoanTatMatch[2]);
  }
  
  return undefined;
}

function extractTotalEpisodes(episodeCurrent: string, episodeTotal: string): number {
  if (episodeTotal) {
    const total = parseInt(episodeTotal);
    if (total > 0) return total;
  }
  
  if (!episodeCurrent) return 0;
  
  const hoanTatMatch = episodeCurrent.match(/Hoàn Tất\s*\((\d+)\/(\d+)\)/);
  if (hoanTatMatch) {
    return parseInt(hoanTatMatch[2]);
  }
  
  const tapMatch = episodeCurrent.match(/Tập\s*(\d+)/);
  if (tapMatch) {
    return parseInt(tapMatch[1]);
  }
  
  return 0;
}

function parseDuration(timeString: string): number {
  if (!timeString) return 0;
  
  const minutes = timeString.match(/(\d+)\s*phút/);
  if (minutes) {
    return parseInt(minutes[1]);
  }
  
  const hours = timeString.match(/(\d+)\s*giờ/);
  if (hours) {
    return parseInt(hours[1]) * 60;
  }
  
  return 0;
}

function determineMovieType(item: any): 'movie' | 'tv' | 'single' | 'series' | 'hoathinh' {
  if (item.type) {
    const type = item.type.toLowerCase();
    
    switch (type) {
      case 'single':
        return 'single';
      case 'series':
        return 'series';
      case 'hoathinh':
        return 'hoathinh';
      case 'tv':
        return 'tv';
      case 'movie':
        return 'movie';
      default:
        if (type.includes('series') || type.includes('bo')) {
          return 'series';
        }
        if (type.includes('hoat') || type.includes('anime')) {
          return 'hoathinh';
        }
        if (type.includes('le')) {
          return 'single';
        }
        return 'movie';
    }
  }
  
  const totalEpisodes = extractTotalEpisodes(item.episode_current, item.episode_total);
  const hasMultipleEpisodes = totalEpisodes > 1;
  
  if (hasMultipleEpisodes) {
    return 'series';
  }
  
  return 'single';
}