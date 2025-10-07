// Test MovieService với các tham số nâng cao
const BASE_URL = 'https://phimapi.com';

async function testMovieServiceAdvanced() {
  console.log('🧪 Test MovieService với tham số nâng cao...\n');

  // Test 1: Phim bộ với sắp xếp theo năm
  try {
    console.log('📺 Test 1: Phim bộ - sắp xếp theo năm (mới nhất)...');
    const url = `${BASE_URL}/v1/api/danh-sach/phim-bo?page=1&limit=5&sort_field=year&sort_type=desc`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ Kết quả: ${data?.data?.items?.length || 0} phim`);
    if (data?.data?.items?.length > 0) {
      data.data.items.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.name}" - Năm: ${item.year}`);
      });
    }
  } catch (error) {
    console.log('❌ Lỗi test 1:', error.message);
  }

  // Test 2: Phim lẻ theo thể loại hành động
  try {
    console.log('\n🎬 Test 2: Phim lẻ thể loại hành động...');
    const url = `${BASE_URL}/v1/api/the-loai/hanh-dong?page=1&limit=3`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ Kết quả: ${data?.data?.items?.length || 0} phim hành động`);
    if (data?.data?.items?.length > 0) {
      data.data.items.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.name}" - ${item.year}`);
      });
    }
  } catch (error) {
    console.log('❌ Lỗi test 2:', error.message);
  }

  // Test 3: Phim Hàn Quốc 2023
  try {
    console.log('\n🇰🇷 Test 3: Phim Hàn Quốc năm 2023...');
    const url = `${BASE_URL}/v1/api/quoc-gia/han-quoc?page=1&limit=3&year=2023`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ Kết quả: ${data?.data?.items?.length || 0} phim Hàn Quốc 2023`);
    if (data?.data?.items?.length > 0) {
      data.data.items.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.name}" - ${item.year}`);
      });
    }
  } catch (error) {
    console.log('❌ Lỗi test 3:', error.message);
  }

  // Test 4: Tìm kiếm với filter vietsub
  try {
    console.log('\n🔍 Test 4: Tìm kiếm "one piece" với filter vietsub...');
    const url = `${BASE_URL}/v1/api/tim-kiem?keyword=one piece&page=1&limit=3&sort_lang=vietsub`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ Kết quả: ${data?.data?.items?.length || 0} phim vietsub`);
    if (data?.data?.items?.length > 0) {
      data.data.items.forEach((item, index) => {
        console.log(`   ${index + 1}. "${item.name}" - ${item.year}`);
      });
    }
  } catch (error) {
    console.log('❌ Lỗi test 4:', error.message);
  }

  // Test 5: Chi tiết phim với slug hợp lệ
  try {
    console.log('\n📄 Test 5: Chi tiết phim "avatar-doi-bong-dia-nguyen-2022"...');
    const url = `${BASE_URL}/phim/avatar-doi-bong-dia-nguyen-2022`;
    const response = await fetch(url);
    const data = await response.json();
    if (data?.movie) {
      console.log(`✅ Phim: "${data.movie.name}"`);
      console.log(`   Năm: ${data.movie.year}`);
      console.log(`   Thể loại: ${data.movie.category?.map(c => c.name)?.join(', ') || 'N/A'}`);
      console.log(`   Quốc gia: ${data.movie.country?.map(c => c.name)?.join(', ') || 'N/A'}`);
      console.log(`   Số tập: ${data.episodes?.[0]?.server_data?.length || 'N/A'}`);
    } else {
      console.log('⚠️ Không tìm thấy phim với slug này');
    }
  } catch (error) {
    console.log('❌ Lỗi test 5:', error.message);
  }

  console.log('\n🎉 Test MovieService hoàn thành!');
}

// Chạy test
testMovieServiceAdvanced();