// Test endpoint phim mới để tìm endpoint đúng
const BASE_URL = 'https://phimapi.com';

async function testNewMoviesEndpoints() {
  console.log('🧪 Test các endpoint phim mới...\n');

  // Test 1: Endpoint hiện tại
  try {
    console.log('📱 Test 1: /danh-sach/phim-moi-cap-nhat...');
    const response = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Items: ${data?.data?.items?.length || 0}`);
    console.log(`Structure:`, Object.keys(data || {}));
  } catch (error) {
    console.log('❌ Lỗi endpoint 1:', error.message);
  }

  // Test 2: Endpoint v1
  try {
    console.log('\n📱 Test 2: /v1/api/danh-sach/phim-moi...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-moi?page=1`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Items: ${data?.data?.items?.length || 0}`);
    if (data?.data?.items?.length > 0) {
      console.log(`Sample: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi endpoint 2:', error.message);
  }

  // Test 3: Endpoint phim mới cập nhật v1
  try {
    console.log('\n📱 Test 3: /v1/api/danh-sach/phim-moi-cap-nhat...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-moi-cap-nhat?page=1`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Items: ${data?.data?.items?.length || 0}`);
    if (data?.data?.items?.length > 0) {
      console.log(`Sample: "${data.data.items[0].name}"`);
    }
  } catch (error) {
    console.log('❌ Lỗi endpoint 3:', error.message);
  }

  // Test 4: Endpoint home page
  try {
    console.log('\n📱 Test 4: /home...');
    const response = await fetch(`${BASE_URL}/home`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Structure:`, Object.keys(data || {}));
    if (data?.data?.items) {
      console.log(`Items: ${data.data.items.length}`);
    }
  } catch (error) {
    console.log('❌ Lỗi endpoint 4:', error.message);
  }

  // Test 5: Dùng phim bộ làm fallback
  try {
    console.log('\n📺 Test 5: Fallback - /v1/api/danh-sach/phim-bo...');
    const response = await fetch(`${BASE_URL}/v1/api/danh-sach/phim-bo?page=1&limit=10`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Items: ${data?.data?.items?.length || 0}`);
    if (data?.data?.items?.length > 0) {
      console.log(`Sample: "${data.data.items[0].name}" - ${data.data.items[0].year}`);
    }
  } catch (error) {
    console.log('❌ Lỗi endpoint 5:', error.message);
  }

  console.log('\n🎉 Test endpoints hoàn thành!');
}

testNewMoviesEndpoints();