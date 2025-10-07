import { useState, useEffect, useCallback } from 'react';
import movieService from '../services/api/movieService';
import { transformMovieDetailArrayToMovieArray } from '../utils/movieDataTransform';
import { Movie } from '../types/Movie';

interface UseMoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

interface UseMoviesResult extends UseMoviesState {
  loadNewMovies: (page: number) => Promise<void>;
  loadSeriesMovies: (page: number) => Promise<void>;
  loadSingleMovies: (page: number) => Promise<void>;
  loadAnimeMovies: (page: number) => Promise<void>;
  loadKoreanMovies: (page: number) => Promise<void>;
  loadUSUKMovies: (page: number) => Promise<void>;
  loadMoviesByCategory: (categorySlug: string, page: number) => Promise<void>;
  searchMovies: (keyword: string, page: number) => Promise<void>;
  resetMovies: () => void;
  refreshMovies: () => Promise<void>;
}

export const useMovies = (initialType?: string): UseMoviesResult => {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  });

  const updateState = useCallback((updates: Partial<UseMoviesState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadNewMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getNewMovies(page);
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim mới');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadSeriesMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getSeriesMovies({ page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim bộ');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadSingleMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getSingleMovies({ page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim lẻ');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadAnimeMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getAnimeMovies({ page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim anime');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadKoreanMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getKoreanMovies({ page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim Hàn Quốc');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadUSUKMovies = useCallback(async (page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getUSUKMovies({ page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error('Không thể tải danh sách phim Âu Mỹ');
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const loadMoviesByCategory = useCallback(async (categorySlug: string, page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.getMoviesByCategory(categorySlug, { page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error(`Không thể tải phim theo thể loại: ${categorySlug}`);
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const searchMovies = useCallback(async (keyword: string, page: number = 1) => {
    updateState({ loading: true, error: null, currentPage: page });
    
    try {
      const response = await movieService.searchMovies(keyword, { page });
      if (response?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(response.data.items);
        updateState({
          movies: page === 1 ? transformedMovies : [...state.movies, ...transformedMovies],
          loading: false,
          totalPages: response.data.params?.pagination?.totalPages || 1,
        });
      } else {
        throw new Error(`Không tìm thấy kết quả cho: ${keyword}`);
      }
    } catch (error) {
      updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  }, [state.movies, updateState]);

  const resetMovies = useCallback(() => {
    setState({
      movies: [],
      loading: false,
      error: null,
      totalPages: 1,
      currentPage: 1,
    });
  }, []);

  const refreshMovies = useCallback(async () => {
    if (initialType) {
      switch (initialType) {
        case 'new':
          await loadNewMovies(1);
          break;
        case 'series':
          await loadSeriesMovies(1);
          break;
        case 'single':
          await loadSingleMovies(1);
          break;
        case 'anime':
          await loadAnimeMovies(1);
          break;
        case 'korean':
          await loadKoreanMovies(1);
          break;
        case 'usuk':
          await loadUSUKMovies(1);
          break;
        default:
          await loadNewMovies(1);
      }
    } else {
      await loadNewMovies(1);
    }
  }, [initialType, loadNewMovies, loadSeriesMovies, loadSingleMovies, loadAnimeMovies, loadKoreanMovies, loadUSUKMovies]);

  useEffect(() => {
    refreshMovies();
  }, [refreshMovies]);

  return {
    ...state,
    loadNewMovies,
    loadSeriesMovies,
    loadSingleMovies,
    loadAnimeMovies,
    loadKoreanMovies,
    loadUSUKMovies,
    loadMoviesByCategory,
    searchMovies,
    resetMovies,
    refreshMovies,
  };
};