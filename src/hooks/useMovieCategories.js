/**
 * useMovieCategories Hook - Quản lý data cho tất cả categories
 * Dễ debug từng category riêng biệt
 */
import { useState, useEffect } from 'react';
import { latestMoviesService } from '../api/endpoints/latestMovies';
import { singleMoviesService } from '../api/endpoints/singleMovies';
import { seriesMoviesService } from '../api/endpoints/seriesMovies';
import { animationMoviesService } from '../api/endpoints/animationMovies';
import AnimeCategory from '../api/categories/anime';
import UsUkCategory from '../api/categories/usUk';
import KoreanCategory from '../api/categories/korean';

export const useMovieCategories = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // State cho từng category
  const [latestMovies, setLatestMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [singleMovies, setSingleMovies] = useState([]);
  const [seriesMovies, setSeriesMovies] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);
  const [usUkMovies, setUsUkMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);

  const loadLatestMovies = async () => {
    try {
      console.log('🔥 Loading latest movies...');
      const response = await latestMoviesService.getLatestMovies({ limit: 20 });
      if (response.status && response.data?.items) {
        setLatestMovies(response.data.items);
        setFeaturedMovie(response.data.items[0] || null);
        console.log('✅ Latest movies loaded:', response.data.items.length);
      }
    } catch (error) {
      console.error('🔥 Latest movies failed:', error.message);
      // Fallback to single movies
      try {
        const fallback = await singleMoviesService.getSingleMovies({ limit: 20 });
        if (fallback.status && fallback.data?.items) {
          setLatestMovies(fallback.data.items);
          setFeaturedMovie(fallback.data.items[0] || null);
        }
      } catch (fallbackError) {
        console.error('🔥 Fallback failed:', fallbackError.message);
      }
    }
  };

  const loadSingleMovies = async () => {
    try {
      console.log('🎬 Loading single movies...');
      const response = await singleMoviesService.getPopularSingleMovies();
      if (response.status && response.data?.items) {
        setSingleMovies(response.data.items);
        console.log('✅ Single movies loaded:', response.data.items.length);
      }
    } catch (error) {
      console.error('🎬 Single movies failed:', error.message);
    }
  };

  const loadSeriesMovies = async () => {
    try {
      console.log('📺 Loading series movies...');
      const response = await seriesMoviesService.getPopularSeriesMovies();
      if (response.status && response.data?.items) {
        setSeriesMovies(response.data.items);
        console.log('✅ Series movies loaded:', response.data.items.length);
      }
    } catch (error) {
      console.error('📺 Series movies failed:', error.message);
    }
  };

  const loadAnimeMovies = async () => {
    try {
      console.log('🎌 Loading anime movies...');
      const response = await animationMoviesService.getPopularAnimationMovies();
      if (response.status && response.data?.items) {
        const filtered = AnimeCategory.filterJapaneseAnime(response.data.items);
        setAnimeMovies(filtered);
        console.log('✅ Anime movies loaded:', filtered.length);
      }
    } catch (error) {
      console.error('🎌 Anime movies failed:', error.message);
    }
  };

  const loadCountryMovies = async () => {
    try {
      console.log('🌍 Loading country-based movies...');
      
      // Load more movies for filtering
      const [singleResponse, seriesResponse] = await Promise.all([
        singleMoviesService.getSingleMovies({ page: 1, limit: 50 }),
        seriesMoviesService.getSeriesMovies({ page: 1, limit: 50 })
      ]);

      let allMovies = [];
      if (singleResponse.status && singleResponse.data?.items) {
        allMovies = [...allMovies, ...singleResponse.data.items];
      }
      if (seriesResponse.status && seriesResponse.data?.items) {
        allMovies = [...allMovies, ...seriesResponse.data.items];
      }

      // Filter by countries
      const usUkFiltered = UsUkCategory.filterUSUKMovies(allMovies);
      const koreanFiltered = KoreanCategory.filterKoreanMovies(allMovies);

      setUsUkMovies(usUkFiltered);
      setKoreanMovies(koreanFiltered);
      
      console.log('✅ Country movies loaded - US-UK:', usUkFiltered.length, 'Korean:', koreanFiltered.length);
    } catch (error) {
      console.error('🌍 Country movies failed:', error.message);
    }
  };

  const loadAllMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all categories in parallel
      await Promise.all([
        loadLatestMovies(),
        loadSingleMovies(), 
        loadSeriesMovies(),
        loadAnimeMovies(),
        loadCountryMovies()
      ]);
      
      console.log('✅ All movie categories loaded successfully!');
    } catch (error) {
      console.error('💥 Failed to load movie categories:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAllMovies();
  };

  useEffect(() => {
    loadAllMovies();
  }, []);

  return {
    // States
    loading,
    refreshing,
    error,
    
    // Data
    latestMovies,
    featuredMovie,
    singleMovies,
    seriesMovies,
    animeMovies,
    usUkMovies,
    koreanMovies,
    
    // Actions
    onRefresh,
    loadAllMovies,
  };
};