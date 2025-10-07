// Kiểm tra cấu trúc response của endpoint phim mới
const BASE_URL = 'https://phimapi.com';

async function checkNewMoviesStructure() {
  console.log('🔍 Kiểm tra cấu trúc response...\n');

  try {
    const response = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`);
    const data = await response.json();
    
    console.log('📋 Full response structure:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.log('❌ Lỗi:', error.message);
  }
}

checkNewMoviesStructure();