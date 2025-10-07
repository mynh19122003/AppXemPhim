// Quick test để kiểm tra API có hoạt động không
console.log('🧪 Quick API Test...');

async function quickApiTest() {
  try {
    // Test phim mới
    console.log('📱 Testing new movies...');
    const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
    const data = await response.json();
    console.log(`✅ New movies: ${data?.items?.length || 0} items`);
    
    // Test phim bộ
    console.log('📺 Testing series movies...');
    const seriesResponse = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1');
    const seriesData = await seriesResponse.json();
    console.log(`✅ Series movies: ${seriesData?.data?.items?.length || 0} items`);
    
    console.log('🎉 API Test completed!');
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
}

quickApiTest();