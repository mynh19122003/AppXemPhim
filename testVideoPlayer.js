/**
 * Test Video Player - Kiểm tra khả năng phát video
 */
const { movieDetailService } = require('./src/api/endpoints/movieDetail');

const testVideoPlayer = async () => {
  console.log('🎬 Testing Video Player...\n');

  try {
    // Test với một phim mẫu
    const movieSlug = 'phim-test'; // Thay thế bằng slug thực tế
    
    console.log('📺 Testing get movie detail...');
    const movieDetail = await movieDetailService.getMovieDetail(movieSlug);
    console.log('✅ Movie detail loaded');
    console.log('Movie:', movieDetail?.movie?.name);
    
    console.log('\n📺 Testing get episodes...');
    const episodes = await movieDetailService.getEpisodes(movieSlug);
    console.log('✅ Episodes loaded:', episodes.length, 'groups');
    
    // Kiểm tra cấu trúc episodes
    episodes.forEach((group, index) => {
      console.log(`\nServer ${index + 1}: ${group.server_name}`);
      console.log(`Episodes: ${group.server_data?.length || 0}`);
      
      if (group.server_data && group.server_data.length > 0) {
        const firstEpisode = group.server_data[0];
        console.log(`First episode: ${firstEpisode.name}`);
        console.log(`Links available:`, {
          m3u8: !!firstEpisode.link_m3u8,
          embed: !!firstEpisode.link_embed
        });
      }
    });
    
    // Test lấy stream URL
    if (episodes.length > 0 && episodes[0].server_data?.length > 0) {
      const firstEpisode = episodes[0].server_data[0];
      console.log('\n🎥 Testing get stream URL...');
      
      const streamData = await movieDetailService.getEpisodeStreamUrl(movieSlug, firstEpisode.slug);
      console.log('✅ Stream data:', {
        streamUrl: streamData.streamUrl ? 'Available' : 'Not available',
        embedUrl: streamData.embedUrl ? 'Available' : 'Not available',
        name: streamData.name
      });
    }
    
  } catch (error) {
    console.error('❌ Video Player Test Error:', error.message);
  }
};

// Test data structure
const testDataStructure = () => {
  console.log('\n📋 Expected API Response Structure:');
  console.log({
    movie: {
      name: 'Movie Name',
      episodes: [
        {
          server_name: 'Server 1',
          server_data: [
            {
              name: 'Tập 1',
              slug: 'tap-1',
              link_m3u8: 'https://example.com/video.m3u8',
              link_embed: 'https://example.com/embed'
            }
          ]
        }
      ]
    }
  });
};

// Chạy tests
testVideoPlayer();
testDataStructure();

module.exports = { testVideoPlayer };