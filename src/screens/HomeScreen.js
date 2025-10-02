import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../constants/colors';
import { getImageSource } from '../utils/imageUtils';
import { useMovieCategories } from '../hooks/useMovieCategories';
import MovieSection from '../components/ui/MovieSection';

const HomeScreen = ({ navigation }) => {
  // Sử dụng custom hook cho movie data
  const {
    loading,
    refreshing,
    error,
    latestMovies,
    featuredMovie,
    singleMovies,
    seriesMovies,
    animeMovies,
    usUkMovies,
    koreanMovies,
    onRefresh,
  } = useMovieCategories();

  // Handler cho movie press
  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  // Hiển thị loading spinner nếu đang tải dữ liệu
  if (loading) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải phim theo danh mục...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Hiển thị error nếu có
  if (error) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎬 MOVIEFLIX</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
          <View style={styles.featuredContainer}>
            <Image
              source={getImageSource(featuredMovie.poster_url || featuredMovie.thumb_url, true)}
              style={styles.featuredImage}
              onError={() => console.log('❌ Featured image load error for:', featuredMovie.name)}
            />
            <LinearGradient
              colors={colors.gradientOverlay}
              style={styles.featuredOverlay}>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>
                  {featuredMovie.name || featuredMovie.origin_name}
                </Text>
                <View style={styles.featuredGenres}>
                  {featuredMovie.category?.slice(0, 3).map((cat, index) => (
                    <Text key={index} style={styles.genreTag}>
                      {cat.name}
                    </Text>
                  ))}
                  <Text style={styles.genreTag}>{featuredMovie.year}</Text>
                  {featuredMovie.lang && <Text style={styles.genreTag}>{featuredMovie.lang}</Text>}
                </View>
                <Text style={styles.featuredDescription} numberOfLines={3}>
                  {featuredMovie.content?.replace(/<[^>]*>/g, '') || 'Mô tả không có sẵn'}
                </Text>
                <View style={styles.featuredButtons}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() =>
                      navigation.navigate('MovieDetail', {movie: featuredMovie})
                    }>
                    <LinearGradient
                      colors={colors.gradientPrimary}
                      style={styles.playButtonGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}>
                      <Text style={styles.playButtonText}>▶ Xem ngay</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Movie Sections với phân loại mới - sử dụng MovieSection component */}
        <MovieSection 
          title="🔥 Phim mới nhất" 
          movies={latestMovies.slice(1, 11)} 
          onMoviePress={handleMoviePress}
        />
        
        <MovieSection 
          title="🎬 Phim lẻ" 
          movies={singleMovies} 
          showEpisodes={false}
          onMoviePress={handleMoviePress}
        />
        
        <MovieSection 
          title="📺 Phim bộ" 
          movies={seriesMovies} 
          showEpisodes={true}
          onMoviePress={handleMoviePress}
        />
        
        <MovieSection 
          title="🎌 Anime" 
          movies={animeMovies} 
          showEpisodes={true}
          onMoviePress={handleMoviePress}
        />
        
        <MovieSection 
          title="🇺🇸 Phim US-UK" 
          movies={usUkMovies} 
          showEpisodes={false}
          onMoviePress={handleMoviePress}
        />
        
        <MovieSection 
          title="🇰🇷 Phim Hàn Quốc" 
          movies={koreanMovies} 
          showEpisodes={true}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginTop: 10,
  },
  errorText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
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
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  featuredContainer: {
    height: 500,
    marginBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBackground,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredInfo: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  featuredDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 15,
    lineHeight: 20,
  },
  featuredGenres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  genreTag: {
    color: colors.text,
    fontSize: 14,
    marginRight: 10,
    marginBottom: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  featuredButtons: {
    flexDirection: 'row',
  },
  playButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  playButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 20,
    marginBottom: 15,
  },
  movieRow: {
    paddingHorizontal: 15,
  },
  movieCard: {
    width: 140,
    height: 210,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBackground,
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  movieInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  movieRating: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default HomeScreen;
