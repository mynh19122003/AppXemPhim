/**
 * Test API phimapi.com để hiểu cấu trúc dữ liệu
 */

const testPhimAPI = async () => {
  console.log('🎬 Testing PhimAPI...\n');

  try {
    // Test với một phim cụ thể
    const testMovies = [
      'one-piece-dao-hai-tac',
      'conan-tham-tu-lung-danh',
      'avatar-aang-tiet-khi-su-cuoi-cung',
    ];

    for (const slug of testMovies) {
      console.log(`\n📺 Testing: ${slug}`);
      
      try {
        const response = await fetch(`https://phimapi.com/phim/${slug}`);
        const data = await response.json();
        
        console.log('✅ Movie found:', data.movie?.name);
        console.log('📊 Episodes:', data.movie?.episodes?.length || 0, 'groups');
        
        if (data.movie?.episodes && data.movie.episodes.length > 0) {
          const firstGroup = data.movie.episodes[0];
          console.log('🎯 First group:', firstGroup.server_name);
          console.log('📋 Server data:', firstGroup.server_data?.length || 0, 'episodes');
          
          if (firstGroup.server_data && firstGroup.server_data.length > 0) {
            const firstEpisode = firstGroup.server_data[0];
            console.log('🎥 First episode:', firstEpisode.name);
            console.log('🔗 Links available:');
            console.log('  - M3U8:', firstEpisode.link_m3u8 ? '✅' : '❌');
            console.log('  - Embed:', firstEpisode.link_embed ? '✅' : '❌');
            
            if (firstEpisode.link_m3u8) {
              console.log('🎯 M3U8 URL:', firstEpisode.link_m3u8);
            }
          }
        }
        
        break; // Test thành công với phim đầu tiên
        
      } catch (error) {
        console.log('❌ Failed to load:', slug);
        continue;
      }
    }
    
  } catch (error) {
    console.error('❌ Test API Error:', error.message);
  }
};

// Chạy test
testPhimAPI();