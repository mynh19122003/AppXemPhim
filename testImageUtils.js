/**
 * Test script để kiểm tra image utility functions
 */

// Simulate the functions locally for testing
const imageUrlCache = new Map();

const convertImageToWebP = (originalUrl) => {
  if (!originalUrl) return null;
  
  // Kiểm tra cache trước
  if (imageUrlCache.has(originalUrl)) {
    return imageUrlCache.get(originalUrl);
  }
  
  // Tạo URL ảnh đầy đủ
  let fullImageUrl = originalUrl;
  if (!originalUrl.startsWith('http')) {
    fullImageUrl = `https://phimimg.com/${originalUrl}`;
  }
  
  // Sử dụng API chuyển đổi ảnh sang WEBP
  const webpUrl = `https://phimapi.com/image.php?url=${encodeURIComponent(fullImageUrl)}`;
  
  // Lưu vào cache
  imageUrlCache.set(originalUrl, webpUrl);
  
  return webpUrl;
};

const getOriginalImageUrl = (originalUrl) => {
  if (!originalUrl) return null;
  
  if (originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  return `https://phimimg.com/${originalUrl}`;
};

const getImageSource = (imageUrl, useWebP = true) => {
  if (!imageUrl) return null;
  
  const url = useWebP ? convertImageToWebP(imageUrl) : getOriginalImageUrl(imageUrl);
  return { uri: url };
};

const clearImageCache = () => {
  imageUrlCache.clear();
};

const getImageCacheSize = () => {
  return imageUrlCache.size;
};

console.log('🧪 Testing Image Utility Functions...\n');

// Test data
const testImages = [
  'uploads/movies/doraemon-nobita-va-mat-trang-phieu-luu-ky-thumb.jpg',
  'uploads/movies/anh-hung-xa-dieu-2024-thumb.jpg',
  'https://phimimg.com/uploads/movies/test-image.jpg'
];

console.log('1. Testing convertImageToWebP:');
testImages.forEach((imageUrl, index) => {
  const webpUrl = convertImageToWebP(imageUrl);
  console.log(`   ${index + 1}. Original: ${imageUrl}`);
  console.log(`      WebP: ${webpUrl}\n`);
});

console.log('2. Testing getOriginalImageUrl:');
testImages.forEach((imageUrl, index) => {
  const originalUrl = getOriginalImageUrl(imageUrl);
  console.log(`   ${index + 1}. Input: ${imageUrl}`);
  console.log(`      Original: ${originalUrl}\n`);
});

console.log('3. Testing getImageSource:');
testImages.forEach((imageUrl, index) => {
  const sourceWebP = getImageSource(imageUrl, true);
  const sourceOriginal = getImageSource(imageUrl, false);
  console.log(`   ${index + 1}. Image: ${imageUrl}`);
  console.log(`      WebP Source: ${JSON.stringify(sourceWebP)}`);
  console.log(`      Original Source: ${JSON.stringify(sourceOriginal)}\n`);
});

console.log(`4. Cache size: ${getImageCacheSize()} items`);

console.log('5. Testing cache clear:');
clearImageCache();
console.log(`   Cache size after clear: ${getImageCacheSize()} items`);

console.log('\n✅ Test completed!');