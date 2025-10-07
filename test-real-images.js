// Test image loading với URL thật từ API
const testRealImageUrls = async () => {
  console.log('🧪 Testing real image URLs from API...\n');
  
  try {
    // Lấy dữ liệu thật từ API
    const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const firstMovie = data.items[0];
      console.log('📽️ First movie:', firstMovie.name);
      console.log('🖼️ Original poster URL:', firstMovie.poster_url);
      console.log('🖼️ Original thumb URL:', firstMovie.thumb_url);
      
      // Test direct image URL
      console.log('\n✅ Direct image URL (should work):');
      console.log(firstMovie.poster_url);
      
      // Test optimized image URL
      const optimizedUrl = `https://phimapi.com/image.php?url=${encodeURIComponent(firstMovie.poster_url)}`;
      console.log('\n🚀 Optimized WEBP URL:');
      console.log(optimizedUrl);
      
      console.log('\n📋 Image helper test:');
      // Simulate imageHelper logic
      const imageUrl = firstMovie.poster_url || firstMovie.thumb_url;
      console.log('Final URL (no optimization):', imageUrl);
      console.log('Final URL (with optimization):', `https://phimapi.com/image.php?url=${encodeURIComponent(imageUrl)}`);
      
    } else {
      console.log('❌ No movies found in API response');
    }
    
  } catch (error) {
    console.error('❌ Error testing:', error);
  }
};

testRealImageUrls();