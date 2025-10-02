/**
 * Simple API test với fetch thuần
 */

async function testPhimAPI() {
  try {
    console.log('🚀 Testing phimapi.com...');
    
    // Test endpoint V1
    console.log('📡 Testing V1...');
    const response1 = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
    const data1 = await response1.json();
    console.log('V1 Response:', data1.status, 'Items:', data1.data?.items?.length || 0);
    
    // Test endpoint V2
    console.log('📡 Testing V2...');
    const response2 = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1');
    const data2 = await response2.json();
    console.log('V2 Response:', data2.status, 'Items:', data2.data?.items?.length || 0);
    
    // Test endpoint V3
    console.log('📡 Testing V3...');
    const response3 = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1');
    const data3 = await response3.json();
    console.log('V3 Response:', data3.status, 'Items:', data3.data?.items?.length || 0);
    
    // Test API list endpoint
    console.log('� Testing API List...');
    const response4 = await fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=10');
    const data4 = await response4.json();
    console.log('API List Response:', data4.status, 'Items:', data4.data?.items?.length || 0);
    
    // Hiển thị dữ liệu nếu có
    const workingData = data1.data?.items?.length > 0 ? data1 : 
                       data2.data?.items?.length > 0 ? data2 : 
                       data3.data?.items?.length > 0 ? data3 : 
                       data4.data?.items?.length > 0 ? data4 : null;
                       
    if (workingData?.data?.items?.length > 0) {
      const firstMovie = workingData.data.items[0];
      console.log('🎬 Phim đầu tiên:', firstMovie.name);
      console.log('🔗 Poster URL:', firstMovie.poster_url);
      console.log('📅 Năm:', firstMovie.year);
    } else {
      console.log('❌ Không có dữ liệu phim từ tất cả endpoints');
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

testPhimAPI();