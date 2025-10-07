// screens/HomeScreen.new.tsx - Màn hình chính với cấu trúc mới

import React from 'react';
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

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

/**
 * Màn hình chính hiển thị danh sách phim theo các danh mục
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Sử dụng custom hook để quản lý state
  const {
    newMovies,
    singleMovies,
    seriesMovies,
    animeMovies,
    usukMovies,
    koreanMovies,
    featuredMovie,
    loading,
    refreshing,
    error,
    onRefresh,
  } = useMovies();

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