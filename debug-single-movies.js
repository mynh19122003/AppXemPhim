// Debug SingleMovies API call
const testSingleMoviesAPI = async () => {
  console.log('🧪 Testing SingleMovies API...');
  
  try {
    // Test API endpoint trực tiếp
    const response = await fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1');
    const data = await response.json();
    
    console.log('📊 API Response Status:', data.status);
    console.log('📊 Has data:', !!data.data);
    console.log('📊 Has items:', !!data.data?.items);
    console.log('📊 Items count:', data.data?.items?.length || 0);
    
    if (data.data?.items && data.data.items.length > 0) {
      const firstMovie = data.data.items[0];
      console.log('🎬 First movie sample:');
      console.log('  - Name:', firstMovie.name);
      console.log('  - Poster URL:', firstMovie.poster_url);
      console.log('  - Has poster_url:', !!firstMovie.poster_url);
      console.log('  - Poster starts with http:', firstMovie.poster_url?.startsWith('http'));
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Test Error:', error);
    return null;
  }
};

testSingleMoviesAPI();