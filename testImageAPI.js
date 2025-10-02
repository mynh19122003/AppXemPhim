/**
 * Test API chuyển đổi ảnh sang WEBP
 */

async function testImageConversion() {
  try {
    console.log('🎨 Testing phimapi.com image conversion...');
    
    // Test với URL ảnh mẫu
    const sampleImageUrl = 'https://phimimg.com/upload/vod/20250907-1/1c0c9f21c64a58b6b7706018e289ebb7.jpg';
    const convertedUrl = `https://phimapi.com/image.php?url=${encodeURIComponent(sampleImageUrl)}`;
    
    console.log('📷 Original URL:', sampleImageUrl);
    console.log('🔄 Converted URL:', convertedUrl);
    
    // Test fetch
    const response = await fetch(convertedUrl, { method: 'HEAD' });
    console.log('✅ Response status:', response.status);
    console.log('📦 Content-Type:', response.headers.get('content-type'));
    console.log('📏 Content-Length:', response.headers.get('content-length'));
    
    if (response.ok) {
      console.log('🎉 Image conversion API working!');
    } else {
      console.log('❌ Image conversion failed');
    }
    
  } catch (error) {
    console.error('💥 Error testing image conversion:', error.message);
  }
}

testImageConversion();