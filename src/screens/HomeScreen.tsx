// screens/HomeScreen.new.tsx - Màn hình chính với cấu trúc mới

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationProp } from '@react-navigation/native';

// Import từ cấu trúc mới
import { useMovies } from '../hooks/useMovies';
import { FeaturedMovie, MovieSection } from '../components';
import { colors } from '../constants/colors';
import movieService from '../services/api/movieService';
import { transformMovieDetailArrayToMovieArray } from '../utils/movieDataTransform';
import { Movie } from '../types/Movie';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

/**
 * Màn hình chính hiển thị danh sách phim theo các danh mục
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // State riêng cho từng loại phim
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [singleMovies, setSingleMovies] = useState<Movie[]>([]);
  const [seriesMovies, setSeriesMovies] = useState<Movie[]>([]);
  const [animeMovies, setAnimeMovies] = useState<Movie[]>([]);
  const [usukMovies, setUsukMovies] = useState<Movie[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dữ liệu cho tất cả các loại phim
  const loadAllMoviesData = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Loading all movies data...');
      
      const [
        newMoviesResult,
        singleMoviesResult,
        seriesMoviesResult,
        animeMoviesResult,
        usukMoviesResult,
        koreanMoviesResult,
      ] = await Promise.all([
        movieService.getNewMovies(),
        movieService.getSingleMovies({ page: 1 }),
        movieService.getSeriesMovies({ page: 1 }),
        movieService.getAnimeMovies({ page: 1 }),
        movieService.getUSUKMovies({ page: 1 }),
        movieService.getKoreanMovies({ page: 1 }),
      ]);

      console.log('📊 API Results:', {
        newMovies: newMoviesResult?.data?.items?.length || 0,
        singleMovies: singleMoviesResult?.data?.items?.length || 0,
        seriesMovies: seriesMoviesResult?.data?.items?.length || 0,
        animeMovies: animeMoviesResult?.data?.items?.length || 0,
        usukMovies: usukMoviesResult?.data?.items?.length || 0,
        koreanMovies: koreanMoviesResult?.data?.items?.length || 0,
      });

      // Transform và set data cho từng loại phim
      if (newMoviesResult?.data?.items) {
        const transformedMovies = transformMovieDetailArrayToMovieArray(newMoviesResult.data.items);
        setNewMovies(transformedMovies);
        if (transformedMovies.length > 0) {
          setFeaturedMovie(transformedMovies[0]); // Phim đầu tiên làm featured
        }
        console.log('✅ New movies set:', transformedMovies.length);
      }

      if (singleMoviesResult?.data?.items) {
        setSingleMovies(transformMovieDetailArrayToMovieArray(singleMoviesResult.data.items));
      }

      if (seriesMoviesResult?.data?.items) {
        setSeriesMovies(transformMovieDetailArrayToMovieArray(seriesMoviesResult.data.items));
      }

      if (animeMoviesResult?.data?.items) {
        setAnimeMovies(transformMovieDetailArrayToMovieArray(animeMoviesResult.data.items));
      }

      if (usukMoviesResult?.data?.items) {
        setUsukMovies(transformMovieDetailArrayToMovieArray(usukMoviesResult.data.items));
      }

      if (koreanMoviesResult?.data?.items) {
        setKoreanMovies(transformMovieDetailArrayToMovieArray(koreanMoviesResult.data.items));
      }

    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu phim:', error);
      setError('Không thể tải dữ liệu phim. Vui lòng thử lại.');
    } finally {
      setRefreshing(false);
      setLoading(false);
      console.log('✅ Loading completed');
    }
  }, []);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadAllMoviesData();
  }, [loadAllMoviesData]);

  // Hàm onRefresh cho pull-to-refresh
  const onRefresh = useCallback(() => {
    loadAllMoviesData();
  }, [loadAllMoviesData]);

  /**
   * Xử lý khi nhấn vào phim
   * @param movie - Phim được chọn
   */
  const handleMoviePress = (movie: any) => {
    navigation.navigate('MovieDetail', { movie });
  };

  /**
   * Xử lý khi nhấn vào profile
   */
  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  // Hiển thị loading spinner khi đang tải dữ liệu lần đầu
  if (loading) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải phim...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={onRefresh}
            activeOpacity={0.8}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.darkBackground} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎬 MOVIEFLIX</Text>
        <TouchableOpacity 
          onPress={handleProfilePress}
          activeOpacity={0.8}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        
        {/* Featured Movie */}
        {featuredMovie && (
          <FeaturedMovie 
            movie={featuredMovie}
            onPress={handleMoviePress}
          />
        )}

        {/* Movie Sections */}
        <MovieSection
          title="🆕 Phim mới nhất"
          movies={newMovies}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('NewMovies')}
        />
        
        <MovieSection
          title="🎬 Phim lẻ"
          movies={singleMovies}
          showDuration={true}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('SingleMovies')}
        />
        
        <MovieSection
          title="📺 Phim bộ"
          movies={seriesMovies}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('SeriesMovies')}
        />
        
        <MovieSection
          title="🎌 Anime"
          movies={animeMovies}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('Anime')}
        />
        
        <MovieSection
          title="🇺🇸 Phim Âu Mỹ"
          movies={usukMovies}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('USUKMovies')}
        />
        
        <MovieSection
          title="🇰🇷 Phim Hàn Quốc"
          movies={koreanMovies}
          onMoviePress={handleMoviePress}
          onSeeAllPress={() => navigation.navigate('KoreanMovies')}
        />
        
        {/* Khoảng cách cuối */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default HomeScreen;