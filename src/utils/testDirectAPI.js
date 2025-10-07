// Test API trực tiếp với fetch để debug
export const testDirectAPI = async () => {
  try {
    console.log('🧪 Testing direct API call...');
    
    // Test API phim mới cập nhật
    const newMoviesUrl = 'https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1';
    console.log('🌐 Calling:', newMoviesUrl);
    
    const response = await fetch(newMoviesUrl);
    const data = await response.json();
    
    console.log('📊 New Movies API Response:', {
      status: data.status,
      totalItems: data.data?.params?.pagination?.totalItems,
      totalPages: data.data?.params?.pagination?.totalPages,
      currentPage: data.data?.params?.pagination?.currentPage,
      itemsCount: data.data?.items?.length
    });
    
    // Kiểm tra 3 phim đầu tiên để debug hình ảnh
    if (data.data?.items?.length > 0) {
      data.data.items.slice(0, 3).forEach((movie, index) => {
        console.log(`🎬 Movie ${index + 1}:`, {
          name: movie.name,
          slug: movie.slug,
          poster_url: movie.poster_url,
          thumb_url: movie.thumb_url,
          hasPosterUrl: !!movie.poster_url,
          hasThumbUrl: !!movie.thumb_url
        });
      });
    }
    
    // Test API chi tiết phim
    const movieDetailUrl = 'https://phimapi.com/phim/ngoi-truong-xac-song';
    console.log('🌐 Calling:', movieDetailUrl);
    
    const detailResponse = await fetch(movieDetailUrl);
    const detailData = await detailResponse.json();
    
    console.log('📊 Movie Detail API Response:', {
      status: detailData.status,
      movieName: detailData.movie?.name,
      episodeServers: detailData.episodes?.length,
      hasMovie: !!detailData.movie,
      hasEpisodes: !!detailData.episodes
    });
    
    if (detailData.episodes?.length > 0) {
      console.log('📺 First Episode Server:', {
        serverName: detailData.episodes[0].server_name,
        episodeCount: detailData.episodes[0].server_data?.length,
        firstEpisode: detailData.episodes[0].server_data?.[0]
      });
    }
    
    return { newMovies: data, movieDetail: detailData };
    
  } catch (error) {
    console.error('❌ Direct API Test Error:', error);
    return null;
  }
};