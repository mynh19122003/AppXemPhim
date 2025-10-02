// Test thêm các endpoints khác
const testMoreAPI = async () => {
  const endpoints = [
    '/danh-sach/phim-moi-cap-nhat?page=1&limit=5',
    '/the-loai/hoat-hinh?page=1&limit=5',
    '/quoc-gia/nhat-ban?page=1&limit=5',
    '/quoc-gia/han-quoc?page=1&limit=5', 
    '/quoc-gia/au-my?page=1&limit=5',
    '/v1/api/the-loai',
    '/v1/api/quoc-gia'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      const response = await fetch(`https://phimapi.com${endpoint}`);
      const data = await response.json();
      
      if (data.data?.items?.length > 0) {
        console.log(`✅ Success: ${data.data.items.length} items`);
        const sample = data.data.items[0];
        console.log(`📋 Sample:`, {
          name: sample.name,
          type: sample.type,
          country: sample.country?.[0]?.name || 'N/A',
          episode_current: sample.episode_current
        });
      } else if (data.data && Array.isArray(data.data)) {
        console.log(`✅ List data: ${data.data.length} items`);
        console.log(`📋 First few:`, data.data.slice(0, 3).map(item => item.name || item.slug));
      } else {
        console.log(`❌ No data or different structure:`, Object.keys(data));
      }
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
    }
  }
};

testMoreAPI();