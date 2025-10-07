// Test image URLs to debug the issue
const testImageUrls = [
  // Test different image URL formats
  'https://img.phimapi.com/uploads/movies/am-anh-kinh-hoang-nghi-le-cuoi-cung-poster.jpg',
  'https://phimapi.com/image.php?url=https://img.phimapi.com/uploads/movies/am-anh-kinh-hoang-nghi-le-cuoi-cung-poster.jpg',
  'https://phimimg.com/uploads/movies/am-anh-kinh-hoang-nghi-le-cuoi-cung-poster.jpg',
  'uploads/movies/am-anh-kinh-hoang-nghi-le-cuoi-cung-poster.jpg'
];

console.log('Testing image URLs:');
testImageUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

// Test fetch to see which works
fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1')
  .then(response => response.json())
  .then(data => {
    if (data.data && data.data.items && data.data.items[0]) {
      const firstMovie = data.data.items[0];
      console.log('\nFirst movie data:');
      console.log('Name:', firstMovie.name);
      console.log('Poster URL:', firstMovie.poster_url);
      console.log('Thumb URL:', firstMovie.thumb_url);
    }
  })
  .catch(error => {
    console.error('Error fetching movies:', error);
  });