// Test compliance với API Documentation mới
const BASE_URL = 'https://phimapi.com';

async function testAPICompliance() {
  console.log('🧪 Test tuân thủ API Documentation...\n');

  // Test 1: Phim mới - Test các phiên bản v1, v2, v3
  console.log('📱 Test 1: API Phim mới (v1, v2, v3)...');
  
  // V3
  try {
    const responseV3 = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat-v3?page=1`);
    console.log(`   V3 Status: ${responseV3.status}`);
    if (responseV3.ok) {
      const dataV3 = await responseV3.json();
      console.log(`   V3 Items: ${dataV3?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   V3 Error: ${error.message}`);
  }

  // V2
  try {
    const responseV2 = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat-v2?page=1`);
    console.log(`   V2 Status: ${responseV2.status}`);
    if (responseV2.ok) {
      const dataV2 = await responseV2.json();
      console.log(`   V2 Items: ${dataV2?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   V2 Error: ${error.message}`);
  }

  // V1
  try {
    const responseV1 = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`);
    console.log(`   V1 Status: ${responseV1.status}`);
    if (responseV1.ok) {
      const dataV1 = await responseV1.json();
      console.log(`   V1 Items: ${dataV1?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   V1 Error: ${error.message}`);
  }

  // Test 2: API tổng hợp với tất cả parameters theo documentation
  console.log('\n📺 Test 2: API tổng hợp với full parameters...');
  try {
    const fullUrl = `${BASE_URL}/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&category=hanh-dong&country=trung-quoc&year=2024&limit=10`;
    console.log(`   URL: ${fullUrl}`);
    const response = await fetch(fullUrl);
    console.log(`   Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   Items: ${data?.data?.items?.length || 0}`);
      if (data?.data?.items?.length > 0) {
        console.log(`   Sample: "${data.data.items[0].name}" - ${data.data.items[0].year}`);
      }
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: API tìm kiếm với full parameters
  console.log('\n🔍 Test 3: API tìm kiếm với full parameters...');
  try {
    const searchUrl = `${BASE_URL}/v1/api/tim-kiem?keyword=Thước&page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&category=hanh-dong&country=trung-quoc&year=2024&limit=10`;
    console.log(`   URL: ${searchUrl}`);
    const response = await fetch(searchUrl);
    console.log(`   Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   Results: ${data?.data?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: API thể loại
  console.log('\n🎭 Test 4: API thể loại...');
  try {
    // Lấy danh sách thể loại
    const categoriesResponse = await fetch(`${BASE_URL}/the-loai`);
    console.log(`   Categories Status: ${categoriesResponse.status}`);
    
    // Test chi tiết thể loại
    const categoryDetailUrl = `${BASE_URL}/v1/api/the-loai/hanh-dong?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&country=trung-quoc&year=2024&limit=10`;
    const detailResponse = await fetch(categoryDetailUrl);
    console.log(`   Detail Status: ${detailResponse.status}`);
    if (detailResponse.ok) {
      const data = await detailResponse.json();
      console.log(`   Detail Items: ${data?.data?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 5: API quốc gia
  console.log('\n🌍 Test 5: API quốc gia...');
  try {
    // Lấy danh sách quốc gia
    const countriesResponse = await fetch(`${BASE_URL}/quoc-gia`);
    console.log(`   Countries Status: ${countriesResponse.status}`);
    
    // Test chi tiết quốc gia
    const countryDetailUrl = `${BASE_URL}/v1/api/quoc-gia/trung-quoc?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&category=hanh-dong&year=2024&limit=10`;
    const detailResponse = await fetch(countryDetailUrl);
    console.log(`   Detail Status: ${detailResponse.status}`);
    if (detailResponse.ok) {
      const data = await detailResponse.json();
      console.log(`   Detail Items: ${data?.data?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 6: API năm
  console.log('\n📅 Test 6: API năm...');
  try {
    const yearUrl = `${BASE_URL}/v1/api/nam/2024?page=1&sort_field=_id&sort_type=asc&sort_lang=long-tieng&category=hanh-dong&country=trung-quoc&limit=10`;
    const response = await fetch(yearUrl);
    console.log(`   Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`   Items: ${data?.data?.items?.length || 0}`);
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  // Test 7: API chi tiết phim và TMDB
  console.log('\n📄 Test 7: API chi tiết phim...');
  try {
    // Chi tiết phim
    const movieDetailResponse = await fetch(`${BASE_URL}/phim/ngoi-truong-xac-song`);
    console.log(`   Movie Detail Status: ${movieDetailResponse.status}`);
    
    // TMDB
    const tmdbResponse = await fetch(`${BASE_URL}/tmdb/tv/280945`);
    console.log(`   TMDB Status: ${tmdbResponse.status}`);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🎉 Test API Documentation hoàn thành!');
}

testAPICompliance();