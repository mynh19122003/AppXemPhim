// hooks/useMovies.ts - Custom hook để quản lý state phim

import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types/movie';
import movieService from '../services/api/movieService';

interface UseMoviesState {
  // Dữ liệu phim
  newMovies: Movie[];
  singleMovies: Movie[];
  seriesMovies: Movie[];
  animeMovies: Movie[];
  usukMovies: Movie[];
  koreanMovies: Movie[];
  featuredMovie: Movie | null;
  
  // Trạng thái loading
  loading: boolean;
  refreshing: boolean;
  
  // Lỗi
  error: string | null;
  
  // Hàm actions
  loadMoviesData: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook để quản lý việc load và refresh dữ liệu phim
 * @returns Object chứa state và functions
 */
export const useMovies = (): UseMoviesState => {
  // State cho các loại phim
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [singleMovies, setSingleMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [usukMovies, setUsukMovies] = useState<Movie[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  // State cho UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load tất cả dữ liệu phim từ API
   */
  const loadMoviesData = useCallback(async (): Promise<void> => {
    try {
      console.log('🔄 Bắt đầu load dữ liệu phim...');
      setError(null);
      
      // Gọi tất cả API song song để tăng performance
      const [
        newMoviesData,
        singleMoviesData, 
        seriesMoviesData,
        animeMoviesData,
        usukMoviesData,
        koreanMoviesData
      ] = await Promise.all([
        movieService.getNewMovies(),
        movieService.getSingleMovies(),
        movieService.getSeriesMovies(), 
        movieService.getAnimeMovies(),
        movieService.getUSUKMovies(),
        movieService.getKoreanMovies()
      ]);

      // Cập nhật state
      setNewMovies(newMoviesData);
      setSingleMovies(singleMoviesData);
      setSeriesMovies(seriesMoviesData);
      setAnimeMovies(animeMoviesData);
      setUsukMovies(usukMoviesData);
      setKoreanMovies(koreanMoviesData);
      
      // Set featured movie từ phim mới nhất
      if (newMoviesData.length > 0) {
        setFeaturedMovie(newMoviesData[0]);
      }
      
      console.log('✅ Load dữ liệu phim thành công');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ Lỗi khi load dữ liệu phim:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh dữ liệu phim
   */
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await loadMoviesData();
    setRefreshing(false);
  }, [loadMoviesData]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadMoviesData();
  }, [loadMoviesData]);

  return {
    // Data
    newMovies,
    singleMovies,
    seriesMovies,
    animeMovies,
    usukMovies,
    koreanMovies,
    featuredMovie,
    
    // UI State
    loading,
    refreshing,
    error,
    
    // Actions
    loadMoviesData,
    onRefresh,
  };
};