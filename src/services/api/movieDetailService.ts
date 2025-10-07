// services/api/movieDetailService.ts - Movie Detail API Service

// Base URL API
const API_BASE_URL = 'https://phimapi.com';

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

export interface MovieDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  country: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export interface MovieDetailResponse {
  status: boolean;
  message: string;
  movie: MovieDetail;
  episodes: EpisodeServer[];
}

class MovieDetailService {
  private baseUrl = API_BASE_URL;

  // Lấy chi tiết phim và danh sách tập theo API phimapi.com
  async getMovieDetail(slug: string): Promise<MovieDetailResponse | null> {
    try {
      console.log(`🔍 Fetching movie detail for slug: ${slug}`);
      
      // API endpoint theo tài liệu: GET https://phimapi.com/phim/{slug}
      const url = `${this.baseUrl}/phim/${slug}`;
      console.log(`🌐 API URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📱 API Response:`, data);

      if (data.status && data.movie) {
        console.log(`✅ Successfully got movie: ${data.movie.name}`);
        console.log(`📺 Episodes found: ${data.episodes ? data.episodes.length : 0} servers`);
        return data;
      }

      console.log(`⚠️ No valid movie data in response for: ${slug}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching movie detail for ${slug}:`, error);
      throw error;
    }
  }

  // Lấy danh sách episodes
  async getEpisodes(slug: string): Promise<EpisodeServer[]> {
    try {
      const result = await this.getMovieDetail(slug);
      if (result && result.episodes) {
        console.log(`📺 Found ${result.episodes.length} episode servers for ${slug}`);
        return result.episodes;
      }
      return [];
    } catch (error) {
      console.error('📺 Episodes Error:', error);
      throw error;
    }
  }

  // Lấy URL stream của một tập cụ thể - Enhanced với fallback và validation
  async getEpisodeStreamUrl(slug: string, episodeSlug: string): Promise<{
    streamUrl: string;
    m3u8Url?: string;
    embedUrl?: string;
    serverName: string;
  } | null> {
    try {
      const result = await this.getMovieDetail(slug);
      if (!result || !result.episodes) {
        throw new Error('No episodes data found');
      }

      // Tìm episode trong tất cả servers
      for (const server of result.episodes) {
        const episode = server.server_data.find(ep => ep.slug === episodeSlug);
        if (episode) {
          console.log(`🎬 Found episode: ${episode.name} in server: ${server.server_name}`);
          
          // Ưu tiên link_m3u8, nếu không có thì dùng link_embed
          const streamUrl = episode.link_m3u8 || episode.link_embed;
          
          if (!streamUrl) {
            console.warn(`⚠️ No valid stream URL found for episode ${episodeSlug}`);
            continue; // Try next server
          }
          
          console.log(`🔗 Stream URL: ${streamUrl.substring(0, 50)}...`);
          
          return {
            streamUrl,
            m3u8Url: episode.link_m3u8,
            embedUrl: episode.link_embed,
            serverName: server.server_name
          };
        }
      }

      console.log(`⚠️ Episode ${episodeSlug} not found in any server`);
      return null;
    } catch (error) {
      console.error(`❌ Error getting episode stream URL:`, error);
      throw error;
    }
  }

  // Lấy episode đầu tiên (để auto-play)
  async getFirstEpisodeUrl(slug: string): Promise<string | null> {
    try {
      const episodes = await this.getEpisodes(slug);
      if (episodes.length > 0 && episodes[0].server_data.length > 0) {
        const firstEpisode = episodes[0].server_data[0];
        const streamUrl = firstEpisode.link_m3u8 || firstEpisode.link_embed;
        console.log(`🎬 First episode URL: ${streamUrl}`);
        return streamUrl;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting first episode URL:', error);
      throw error;
    }
  }
}

export const movieDetailService = new MovieDetailService();