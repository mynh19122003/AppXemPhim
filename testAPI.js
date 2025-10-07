// Test script đơn giản để kiểm tra API
const BASE_URL = 'https://phimapi.com';

// Test tất cả các endpoint chính
async function testAPI() {
  console.log('🧪 Bắt đầu test API...\n');

  // Test 1: Phim mới cập nhật
  try {
    console.log('📱 Test 1: Phim mới cập nhật...');
    const response = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`);
    const data = await response.json();
    console.log(`✅ Phim mới: ${data?.data?.items?.length || 0} phim`);
    if (data?.data?.items?.length > 0) {
      console.log(`   Ví dụ: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi phim mới:', error.message);
  }

  // Test 2: Phim bộ
  try {
    console.log('\n📺 Test 2: Phim bộ...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-bo?page=1`);
    const data = await response.json();
    console.log(`✅ Phim bộ: ${data?.data?.items?.length || 0} phim`);
    if (data?.data?.items?.length > 0) {
      console.log(`   Ví dụ: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi phim bộ:', error.message);
  }

  // Test 3: Phim lẻ
  try {
    console.log('\n🎬 Test 3: Phim lẻ...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-le?page=1`);
    const data = await response.json();
    console.log(`✅ Phim lẻ: ${data?.data?.items?.length || 0} phim`);
    if (data?.data?.items?.length > 0) {
      console.log(`   Ví dụ: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi phim lẻ:', error.message);
  }

  // Test 4: Anime
  try {
    console.log('\n🔥 Test 4: Anime...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/hoat-hinh?page=1`);
    const data = await response.json();
    console.log(`✅ Anime: ${data?.data?.items?.length || 0} phim`);
    if (data?.data?.items?.length > 0) {
      console.log(`   Ví dụ: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi anime:', error.message);
  }

  // Test 5: Tìm kiếm
  try {
    console.log('\n🔍 Test 5: Tìm kiếm "avatar"...');
    const response = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=avatar&page=1`);
    const data = await response.json();
    console.log(`✅ Tìm kiếm: ${data?.data?.items?.length || 0} kết quả`);
    if (data?.data?.items?.length > 0) {
      console.log(`   Ví dụ: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi tìm kiếm:', error.message);
  }

  // Test 6: Chi tiết phim (với slug mẫu)
  try {
    console.log('\n📄 Test 6: Chi tiết phim...');
    const response = await fetch(`${BASE_URL}/phim/co-be-den-2022`);
    const data = await response.json();
    if (data?.movie) {
      console.log(`✅ Chi tiết phim: "${data.movie.name}"`);
      console.log(`   Năm: ${data.movie.year}, Thời lượng: ${data.movie.time}`);
    } else {
      console.log('⚠️ Không tìm thấy phim với slug này');
    }
  } catch (error) {
    console.log('❌ Lỗi chi tiết phim:', error.message);
  }

  console.log('\n🎉 Test API hoàn thành!');
}

// Chạy test
testAPI();