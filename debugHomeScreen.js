// Debug script giống như trong HomeScreen
console.log('🔍 Debug HomeScreen API calls...');

async function debugHomeScreenCalls() {
  try {
    console.log('📱 Testing getNewMovies()...');
    const newMoviesResponse = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1');
    if (newMoviesResponse.ok) {
      const newMoviesData = await newMoviesResponse.json();
      console.log(`✅ New movies V3: ${newMoviesData?.items?.length || 0} items`);
    } else {
      console.log('⚠️ V3 failed, trying V2...');
      const newMoviesV2Response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1');
      if (newMoviesV2Response.ok) {
        const newMoviesV2Data = await newMoviesV2Response.json();
        console.log(`✅ New movies V2: ${newMoviesV2Data?.items?.length || 0} items`);
      } else {
        console.log('⚠️ V2 failed, trying V1...');
        const newMoviesV1Response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
        const newMoviesV1Data = await newMoviesV1Response.json();
        console.log(`✅ New movies V1: ${newMoviesV1Data?.items?.length || 0} items`);
      }
    }

    console.log('📺 Testing getSingleMovies({ page: 1 })...');
    const singleResponse = await fetch('https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=20&sort_field=modified.time&sort_type=desc');
    const singleData = await singleResponse.json();
    console.log(`✅ Single movies: ${singleData?.data?.items?.length || 0} items`);

    console.log('📚 Testing getSeriesMovies({ page: 1 })...');
    const seriesResponse = await fetch('https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&limit=20&sort_field=modified.time&sort_type=desc');
    const seriesData = await seriesResponse.json();
    console.log(`✅ Series movies: ${seriesData?.data?.items?.length || 0} items`);

    console.log('🔥 Testing getAnimeMovies({ page: 1 })...');
    const animeResponse = await fetch('https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=20&sort_field=modified.time&sort_type=desc');
    const animeData = await animeResponse.json();
    console.log(`✅ Anime movies: ${animeData?.data?.items?.length || 0} items`);

    console.log('🇺🇸 Testing getUSUKMovies({ page: 1 })...');
    const usukResponse = await fetch('https://phimapi.com/v1/api/quoc-gia/au-my?page=1&limit=20&sort_field=modified.time&sort_type=desc');
    const usukData = await usukResponse.json();
    console.log(`✅ USUK movies: ${usukData?.data?.items?.length || 0} items`);

    console.log('🇰🇷 Testing getKoreanMovies({ page: 1 })...');
    const koreanResponse = await fetch('https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1&limit=20&sort_field=modified.time&sort_type=desc');
    const koreanData = await koreanResponse.json();
    console.log(`✅ Korean movies: ${koreanData?.data?.items?.length || 0} items`);

    console.log('🎉 All HomeScreen API calls completed successfully!');
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugHomeScreenCalls();