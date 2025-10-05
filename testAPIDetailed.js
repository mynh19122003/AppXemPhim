/**
 * Test API chi tiết hơn
 */

const testDetailedAPI = async () => {
  console.log('🎬 Testing Detailed API...\n');

  try {
    // Test endpoint chính
    const response = await fetch('https://phimapi.com/phim/one-piece-dao-hai-tac');
    const data = await response.json();
    
    console.log('📊 Full Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testDetailedAPI();