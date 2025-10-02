// Test API endpoints để hiểu cấu trúc data
const testAPI = async () => {
  const endpoints = [
    '/v1/api/danh-sach/phim-moi-cap-nhat?page=1&limit=5',
    '/v1/api/danh-sach/phim-le?page=1&limit=5', 
    '/v1/api/danh-sach/phim-bo?page=1&limit=5',
    '/v1/api/danh-sach/hoat-hinh?page=1&limit=5',
    '/quoc-gia/nhat-ban?page=1&limit=5',
    '/quoc-gia/us-uk?page=1&limit=5',
    '/quoc-gia/han-quoc?page=1&limit=5'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      const response = await fetch(`https://phimapi.com${endpoint}`);
      const data = await response.json();
      
      if (data.data?.items?.length > 0) {
        const sample = data.data.items[0];
        console.log(`✅ Success: ${data.data.items.length} items`);
        console.log(`📋 Sample:`, {
          name: sample.name,
          type: sample.type,
          episode_current: sample.episode_current,
          episode_total: sample.episode_total,
          year: sample.year,
          country: sample.country?.[0]?.name,
          category: sample.category?.map(c => c.name).join(', ')
        });
      } else {
        console.log(`❌ No data or different structure`);
      }
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
    }
  }
};

testAPI();