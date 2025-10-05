/**
 * Test thực tế với API PhimAPI.com
 */

const testRealMovie = async () => {
  console.log('🎬 Testing Real Movie API...\n');

  try {
    // Test với một số phim thực tế
    const testSlugs = [
      'anh-trai-vuot-moi-tam-tai', // Phim Việt mới
      'deadpool-wolverine',        // Phim bom tấn
      'doraemon-nobita-va-vung-dat-ly-tuong', // Anime
      'one-piece-dao-hai-tac',     // Anime dài tập
    ];

    for (const slug of testSlugs) {
      console.log(`\n📺 Testing: ${slug}`);
      
      try {
        const response = await fetch(`https://phimapi.com/phim/${slug}`);
        const data = await response.json();
        
        if (data.status && data.movie) {
          console.log('✅ Movie found:', data.movie.name);
          console.log('📋 Type:', data.movie.type);
          console.log('🎯 Current episode:', data.movie.episode_current);
          console.log('📊 Episodes servers:', data.episodes?.length || 0);
          
          if (data.episodes && data.episodes.length > 0) {
            data.episodes.forEach((server, index) => {
              console.log(`\n🖥️  Server ${index + 1}: ${server.server_name}`);
              console.log(`   Episodes: ${server.server_data?.length || 0}`);
              
              if (server.server_data && server.server_data.length > 0) {
                const firstEp = server.server_data[0];
                console.log(`   First episode: ${firstEp.name}`);
                console.log(`   Has M3U8: ${firstEp.link_m3u8 ? '✅' : '❌'}`);
                console.log(`   Has Embed: ${firstEp.link_embed ? '✅' : '❌'}`);
                
                if (firstEp.link_m3u8) {
                  console.log(`   M3U8: ${firstEp.link_m3u8.substring(0, 60)}...`);
                }
              }
            });
          }
          
          // Test successful, break
          console.log('\n🎉 Test completed successfully!');
          return;
          
        } else {
          console.log('❌ Movie not found:', data.msg);
        }
        
      } catch (error) {
        console.log(`❌ Error testing ${slug}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Test structure mong đợi
console.log('📋 Expected API Response Structure:');
console.log(JSON.stringify({
  status: true,
  movie: {
    name: "Movie Name",
    slug: "movie-slug", 
    type: "series/single/hoathinh",
    episode_current: "Tập 1",
    episode_total: "12"
  },
  episodes: [
    {
      server_name: "Server #1",
      server_data: [
        {
          name: "Tập 1",
          slug: "tap-1",
          link_m3u8: "https://example.com/video.m3u8",
          link_embed: "https://example.com/embed"
        }
      ]
    }
  ]
}, null, 2));

console.log('\n' + '='.repeat(50));

// Chạy test
testRealMovie();