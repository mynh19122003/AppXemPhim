// Test method getNewMovies đã được sửa
const BASE_URL = 'https://phimapi.com';

// Simulate MovieService method
async function testFixedGetNewMovies() {
  console.log('🧪 Test method getNewMovies đã được sửa...\n');

  try {
    // Step 1: Gọi API như trong method
    console.log('📱 Bước 1: Gọi API endpoint...');
    const url = `${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`;
    const response = await fetch(url);
    const newMoviesResponse = await response.json();
    
    console.log(`✅ Response status: ${newMoviesResponse.status}`);
    console.log(`📊 Items count: ${newMoviesResponse.items?.length || 0}`);
    
    // Step 2: Chuyển đổi cấu trúc như trong code
    if (newMoviesResponse && newMoviesResponse.items) {
      console.log('\n🔄 Bước 2: Chuyển đổi cấu trúc...');
      
      const convertedResponse = {
        status: newMoviesResponse.status,
        msg: newMoviesResponse.msg,
        data: {
          items: newMoviesResponse.items,
          params: {
            pagination: newMoviesResponse.pagination
          }
        }
      };
      
      console.log(`✅ Converted structure:`);
      console.log(`   - Status: ${convertedResponse.status}`);
      console.log(`   - Items: ${convertedResponse.data.items.length}`);
      console.log(`   - Current page: ${convertedResponse.data.params.pagination.currentPage}`);
      console.log(`   - Total pages: ${convertedResponse.data.params.pagination.totalPages}`);
      
      // Sample movies
      if (convertedResponse.data.items.length > 0) {
        console.log('\n🎬 Sample movies:');
        convertedResponse.data.items.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. "${item.name}" - ${item.year}`);
        });
      }
      
      return convertedResponse;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Lỗi test:', error.message);
    return null;
  }
}

testFixedGetNewMovies();