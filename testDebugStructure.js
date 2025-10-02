// Test structure để debug
const testStructureDebug = async () => {
  try {
    console.log('\n🔍 Testing detailed structure...');
    
    // Test phim lẻ
    const response = await fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=3');
    const data = await response.json();
    
    console.log('📋 Phim lẻ structure:');
    if (data.data?.items?.[0]) {
      const movie = data.data.items[0];
      console.log({
        name: movie.name,
        type: movie.type,
        episode_current: movie.episode_current,
        episode_total: movie.episode_total,
        country: movie.country,
        category: movie.category,
        year: movie.year,
        tmdb_type: movie.tmdb?.type
      });
    }

    // Test phim bộ  
    const seriesResponse = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&limit=3');
    const seriesData = await seriesResponse.json();
    
    console.log('\n📋 Phim bộ structure:');
    if (seriesData.data?.items?.[0]) {
      const series = seriesData.data.items[0];
      console.log({
        name: series.name,
        type: series.type,
        episode_current: series.episode_current,
        episode_total: series.episode_total,
        country: series.country,
        category: series.category,
        year: series.year,
        tmdb_type: series.tmdb?.type
      });
    }

  } catch (error) {
    console.log('💥 Error:', error.message);
  }
};

testStructureDebug();