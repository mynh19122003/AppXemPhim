// Test API call trực tiếp để debug
import { movieDetailService } from '../services/api/movieDetailService';

export const testMovieAPI = async () => {
  try {
    console.log('🧪 Testing API call...');
    
    // Test với slug phim có sẵn data
    const slug = 'ngoi-truong-xac-song'; // Slug từ ví dụ trong tài liệu API
    
    console.log(`🔍 Testing with slug: ${slug}`);
    
    const result = await movieDetailService.getMovieDetail(slug);
    
    if (result) {
      console.log('✅ API Test Success:', {
        movieName: result.movie.name,
        movieSlug: result.movie.slug,
        posterUrl: result.movie.poster_url,
        thumbUrl: result.movie.thumb_url,
        episodeServers: result.episodes.length,
        totalEpisodes: result.episodes.reduce((total, server) => total + server.server_data.length, 0)
      });
      
      // Test hình ảnh URLs
      console.log('🖼️ Image URLs:', {
        poster: result.movie.poster_url,
        thumb: result.movie.thumb_url,
        finalImageUrl: result.movie.poster_url || result.movie.thumb_url
      });
      
      // Log first episode để test video
      if (result.episodes.length > 0 && result.episodes[0].server_data.length > 0) {
        const firstEpisode = result.episodes[0].server_data[0];
        console.log('📺 First Episode:', {
          name: firstEpisode.name,
          slug: firstEpisode.slug,
          m3u8: firstEpisode.link_m3u8,
          embed: firstEpisode.link_embed,
          hasM3u8: !!firstEpisode.link_m3u8,
          hasEmbed: !!firstEpisode.link_embed
        });
      }
      
      return result;
    } else {
      console.log('❌ API Test Failed: No data returned');
      return null;
    }
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    return null;
  }
};