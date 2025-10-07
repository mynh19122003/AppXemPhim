// screens/categories/USUKMovies/USUKMoviesScreen.tsx
// Màn hình hiển thị danh sách phim US-UK

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { MovieCard } from '../../../components';
import { movieService } from '../../../services/api';
import { colors } from '../../../constants/colors';
import { Movie } from '../../../types/movie';

interface USUKMoviesScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

/**
 * Màn hình hiển thị danh sách phim US-UK
 * Cho phép load more và refresh
 */
const USUKMoviesScreen: React.FC<USUKMoviesScreenProps> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load danh sách phim US-UK
   */
  const loadMovies = async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (pageNum === 1) {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const newMovies = await movieService.getUSUKMovies(pageNum);
      
      if (newMovies && newMovies.length > 0) {
        if (pageNum === 1) {
          setMovies(newMovies);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
        }
        
        // API v1 trả về 10 items mỗi trang, kiểm tra có đủ 10 items không
        setHasMore(newMovies.length >= 10);
        setPage(pageNum);
        
        console.log(`🌍 Lấy được ${newMovies.length} phim au-my (trang ${pageNum})`);
        console.log(`📱 Đã load trang ${pageNum}, tổng: ${pageNum === 1 ? newMovies.length : movies.length + newMovies.length} phim`);
      } else {
        if (pageNum === 1) {
          setError('Không thể tải danh sách phim US-UK');
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('❌ Lỗi load phim US-UK:', err);
      setError('Lỗi kết nối mạng');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  /**
   * Load page đầu tiên khi component mount
   */
  useEffect(() => {
    loadMovies(1);
  }, []);

  /**
   * Xử lý pull to refresh
   */
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadMovies(1, true);
  };

  /**
   * Xử lý load more khi scroll đến cuối
   */
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMovies(page + 1);
    }
  };

  /**
   * Xử lý khi nhấn vào phim
   */
  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movie });
  };

  /**
   * Render item trong FlatList
   */
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieCard}>
      <MovieCard
        movie={item}
        onPress={() => handleMoviePress(item)}
      />
    </View>
  );

  /**
   * Render loading footer khi load more
   */
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  // Hiển thị loading khi lần đầu load
  if (loading) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải phim US-UK...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Hiển thị lỗi
  if (error && movies.length === 0) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Text style={styles.retryText} onPress={handleRefresh}>
            Nhấn để thử lại
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>�🇸🇬🇧 Phim US-UK</Text>
        <Text style={styles.subtitle}>
          {movies.length} phim • Trang {page}
        </Text>
      </View>

      {/* Danh sách phim */}
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  movieCard: {
    flex: 1,
    margin: 5,
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
    marginBottom: 10,
  },
  retryText: {
    color: colors.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});

export default USUKMoviesScreen;