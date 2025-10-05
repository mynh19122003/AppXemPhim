/**
 * Movie Detail API - Xử lý chi tiết phim và episodes
 * Based on web-mkp implementation
 */
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class MovieDetailService {
  async getMovieDetail(slug) {
    try {
      console.log(`🔍 Fetching movie detail for slug: ${slug}`);
      const url = `${API_ENDPOINTS.MOVIE_DETAIL}/${slug}`;
      const response = await apiClient.request(url);
      
      console.log(`🔍 API response status: ${response.status}, has movie: ${!!response.movie}`);
      
      if (response.status && response.movie) {
        // Attach episodes data from root level to movie object (like web-mkp)
        const movieData = { ...response.movie, episodes: response.episodes };
        console.log(`✅ Successfully got movie: ${movieData.name}`);
        console.log(`📺 Episodes found: ${response.episodes ? response.episodes.length : 0} servers`);
        return { movie: movieData, episodes: response.episodes };
      }
      
      console.log(`⚠️ No valid movie data in response for: ${slug}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching movie detail for ${slug}:`, error.message);
      throw error;
    }
  }

  async getEpisodes(slug) {
    try {
      const result = await this.getMovieDetail(slug);
      if (result && result.episodes) {
        console.log(`📺 Found ${result.episodes.length} episode servers for ${slug}`);
        return result.episodes;
      }
      return [];
    } catch (error) {
      console.error('📺 Episodes Error:', error.message);
      throw error;
    }
  }

  async getEpisodeStreamUrl(slug, episodeSlug) {
    try {
      const result = await this.getMovieDetail(slug);
      if (!result || !result.episodes) {
        throw new Error('No episodes found for this movie');
      }
      
      const episodes = result.episodes;
      console.log(`🔍 Searching for episode "${episodeSlug}" in ${episodes.length} servers`);
      
      // Tìm episode cụ thể trong tất cả servers
      let targetEpisode = null;
      let serverName = '';
      
      for (const episodeGroup of episodes) {
        if (episodeGroup.server_data && Array.isArray(episodeGroup.server_data)) {
          const foundEpisode = episodeGroup.server_data.find(ep => 
            ep.slug === episodeSlug || ep.name === episodeSlug
          );
          
          if (foundEpisode) {
            targetEpisode = foundEpisode;
            serverName = episodeGroup.server_name || 'Server 1';
            console.log(`✅ Found episode in server: ${serverName}`);
            break;
          }
        }
      }

      if (!targetEpisode) {
        // Nếu không tìm thấy theo slug, lấy episode đầu tiên
        for (const episodeGroup of episodes) {
          if (episodeGroup.server_data && episodeGroup.server_data.length > 0) {
            targetEpisode = episodeGroup.server_data[0];
            serverName = episodeGroup.server_name || 'Server 1';
            console.log(`⚡ Using first available episode from: ${serverName}`);
            break;
          }
        }
      }

      if (!targetEpisode) {
        throw new Error('No playable episodes found');
      }

      // Ưu tiên link_m3u8, fallback sang link_embed (like web-mkp)
      const streamUrl = targetEpisode.link_m3u8 || targetEpisode.link_embed;
      
      if (!streamUrl) {
        throw new Error('No stream URL available for this episode');
      }

      console.log(`🎥 Stream URL found: ${streamUrl.substring(0, 50)}...`);
      
      return {
        streamUrl: streamUrl,
        embedUrl: targetEpisode.link_embed,
        m3u8Url: targetEpisode.link_m3u8,
        slug: targetEpisode.slug,
        name: targetEpisode.name,
        serverName: serverName
      };
    } catch (error) {
      console.error('🎥 Stream URL Error:', error.message);
      throw error;
    }
  }

  // Lấy tất cả episodes cho selection UI
  async getAllEpisodes(slug) {
    try {
      const result = await this.getMovieDetail(slug);
      if (!result || !result.episodes) {
        return [];
      }

      const allEpisodes = [];
      
      result.episodes.forEach((episodeGroup, serverIndex) => {
        if (episodeGroup.server_data && Array.isArray(episodeGroup.server_data)) {
          episodeGroup.server_data.forEach((episode, epIndex) => {
            allEpisodes.push({
              ...episode,
              serverName: episodeGroup.server_name || `Server ${serverIndex + 1}`,
              serverIndex: serverIndex,
              episodeIndex: epIndex,
              hasM3u8: !!episode.link_m3u8,
              hasEmbed: !!episode.link_embed
            });
          });
        }
      });

      console.log(`📋 Total episodes across all servers: ${allEpisodes.length}`);
      return allEpisodes;
    } catch (error) {
      console.error('📋 Get all episodes error:', error.message);
      return [];
    }
  }
}

export const movieDetailService = new MovieDetailService();