// Test Movie Services - Kiểm tra cá    // Test 2: MovieService - Lấy danh sách phim bộ
    console.log('📺 Testing MovieService.getSeriesMovies...');
    const seriesResult = await movieService.getSeriesMovies({ page: 1 });
    if (seriesResult?.data?.items) {
      const seriesMovies = transformMovieDetailArrayToMovieArray(seriesResult.data.items);
      console.log(`✅ Series movies loaded: ${seriesMovies.length} items`);
    } else {
      console.log('❌ Series movies loading failed');
    }

    // Test 3: MovieService - Lấy danh sách phim lẻ  
    console.log('🎬 Testing MovieService.getSingleMovies...');
    const singleResult = await movieService.getSingleMovies({ page: 1 });
    if (singleResult?.data?.items) {
      const singleMovies = transformMovieDetailArrayToMovieArray(singleResult.data.items);
      console.log(`✅ Single movies loaded: ${singleMovies.length} items`);
    } else {
      console.log('❌ Single movies loading failed');
    }
import movieService from '../services/api/movieService';
import { transformMovieDetailArrayToMovieArray } from './movieDataTransform';

export const testMovieServices = async () => {
  console.log('🧪 Testing Movie Services...');
  
  try {
    // Test 1: MovieService - Lấy danh sách phim mới
    console.log('📱 Testing MovieService.getNewMovies...');
    const newMoviesResult = await movieService.getNewMovies(1);
    if (newMoviesResult?.data?.items) {
      const newMovies = transformMovieDetailArrayToMovieArray(newMoviesResult.data.items);
      console.log(`✅ New movies loaded: ${newMovies.length} items`);
      if (newMovies.length > 0) {
        console.log('📄 Sample movie:', {
          title: newMovies[0].title,
          poster: newMovies[0].poster?.substring(0, 50) + '...',
          year: newMovies[0].year,
          slug: newMovies[0].slug
        });
      }
    } else {
      console.log('❌ No new movies found');
    }

    // Test 2: MovieService - Lấy danh sách phim bộ
    console.log('📺 Testing MovieService.getSeriesMovies...');
    const seriesResult = await movieService.getSeriesMovies({ page: 1 });
    if (seriesResult?.data?.items) {
      const seriesMovies = transformMovieDetailArrayToMovieArray(seriesResult.data.items);
      console.log(`✅ Series movies loaded: ${seriesMovies.length} items`);
    } else {
      console.log('❌ Series movies loading failed');
    }
    
    // Test 3: MovieService - Lấy danh sách anime
    console.log('🔥 Testing MovieService.getAnimeMovies...');
    const animeResult = await movieService.getAnimeMovies({ page: 1 });
    if (animeResult?.data?.items) {
      const animeMovies = transformMovieDetailArrayToMovieArray(animeResult.data.items);
      console.log(`✅ Anime movies loaded: ${animeMovies.length} items`);
    } else {
      console.log('❌ Anime movies loading failed');
    }

    // Test 4: MovieService - Lấy danh sách phim lẻ
    console.log('🎯 Testing MovieService.getSingleMovies...');
    const singleResult = await movieService.getSingleMovies({ page: 1 });
    if (singleResult?.data?.items) {
      const singleMovies = transformMovieDetailArrayToMovieArray(singleResult.data.items);
      console.log(`✅ Single movies loaded: ${singleMovies.length} items`);
    } else {
      console.log('❌ Single movies loading failed');
    }
    
    console.log('🎉 All movie service tests completed!');
    
  } catch (error) {
    console.error('❌ Movie Services test failed:', error);
  }
};

// Test tương thích ngược (cho các phần còn sử dụng tên cũ)
export const testPhimAPIService = testMovieServices;