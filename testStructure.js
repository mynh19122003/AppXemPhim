// Test cấu trúc response khác
const testStructure = async () => {
  try {
    console.log('🔍 Testing phim mới cập nhật structure...');
    const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1&limit=5');
    const data = await response.json();
    
    console.log('📦 Full structure:', JSON.stringify(data, null, 2));
    
    if (data.items && data.items.length > 0) {
      console.log('\n✅ Found items directly in response');
      const sample = data.items[0];
      console.log('📋 Sample item:', {
        name: sample.name,
        type: sample.type,
        country: sample.country?.[0]?.name,
        episode_current: sample.episode_current
      });
    }
  } catch (error) {
    console.log('💥 Error:', error.message);
  }
};

testStructure();