/**
 * Test script để kiểm tra API services
 * Chạy bằng: node testApi.js
 */

const { apiServices } = require('./src/services/api');

async function testAPI() {
  try {
    console.log('🚀 Bắt đầu test API...');
    
    // Test lấy phim mới
    console.log('📡 Đang gọi API lấy phim mới...');
    const newMovies = await apiServices.newMovies.getNewMovies(1);
    
    if (newMovies.status && newMovies.data?.items) {
      console.log('✅ API hoạt động thành công!');
      console.log(`📊 Số lượng phim: ${newMovies.data.items.length}`);
      console.log(`🎬 Phim đầu tiên: ${newMovies.data.items[0]?.name}`);
      console.log(`🎯 Total pages: ${newMovies.data.params?.pagination?.totalPages}`);
    } else {
      console.log('❌ API không trả về dữ liệu đúng format');
      console.log('Response:', JSON.stringify(newMovies, null, 2));
    }
    
  } catch (error) {
    console.error('💥 Lỗi khi test API:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Chạy test
testAPI();