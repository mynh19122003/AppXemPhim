import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../constants/colors';
import {getMovieGenres, getMovieDescription} from '../utils/movieHelper';
import EpisodeSelector from '../components/ui/EpisodeSelector';

const {width} = Dimensions.get('window');

// Helper function để lấy URL hình ảnh gốc từ API
const getOriginalImageUrl = (movie) => {
  if (!movie) return null;
  
  // Ưu tiên field mới từ movieService, fallback sang field cũ
  const imageUrl = movie.poster || movie.thumbnail || movie.poster_url || movie.thumb_url;
  if (!imageUrl) return null;
  
  // Nếu URL đã có domain thì dùng luôn, không thì thêm domain phimimg.com
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  return `https://phimimg.com/${imageUrl}`;
};

const MovieDetailScreen = ({navigation, route}) => {
  // Debug: Kiểm tra params
  console.log('🎬 MovieDetailScreen route.params:', route.params);
  
  const {movie} = route.params || {};
  
  // Kiểm tra movie object
  if (!movie) {
    console.error('❌ MovieDetailScreen: No movie data provided');
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy thông tin phim</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
  
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

  const handlePlayMovie = () => {
    console.log(`🎬 Playing movie: ${movie.name} (${movie.slug})`);
    
    try {
      // Luôn chuyển tới WatchMovieScreen để xem video và episodes
      navigation.navigate('WatchMovie', { movie });
    } catch (error) {
      console.error('❌ Navigation error to WatchMovie:', error);
    }
  };

  const handleEpisodeSelect = (episode) => {
    try {
      navigation.navigate('WatchMovie', { 
        movie, 
        episodeSlug: episode.slug 
      });
    } catch (error) {
      console.error('❌ Navigation error to WatchMovie with episode:', error);
    }
  };

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={{uri: getOriginalImageUrl(movie) || undefined}} style={styles.bannerImage} />
          <LinearGradient
            colors={colors.gradientOverlay}
            style={styles.bannerOverlay}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.name || movie.origin_name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>⭐ {movie.quality || 'HD'}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{movie.year}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>{movie.time || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.genresContainer}>
            {getMovieGenres(movie).map((genre, index) => (
              <View key={index} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          {/* Play Button */}
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayMovie}
          >
            <LinearGradient
              colors={colors.gradientPrimary}
              style={styles.playButtonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}>
              <Text style={styles.playButtonText}>▶ Phát phim</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionText}>Danh sách</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👍</Text>
              <Text style={styles.actionText}>Thích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{getMovieDescription(movie)}</Text>
          </View>

          {/* Similar Movies */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phim tương tự</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.similarMovies}>
              {[1, 2, 3, 4].map(item => (
                <View key={item} style={styles.similarMovieCard}>
                  <View style={styles.similarMovieImage}>
                    <Text style={styles.placeholderText}>Phim {item}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Episode Selector Modal */}
      <EpisodeSelector
        movie={movie}
        visible={showEpisodeSelector}
        onClose={() => setShowEpisodeSelector(false)}
        onEpisodeSelect={handleEpisodeSelect}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    height: 300,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBackground,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  metaDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreChip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  genreText: {
    color: colors.text,
    fontSize: 13,
  },
  playButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  playButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  playButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  actionText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  similarMovies: {
    marginTop: 10,
  },
  similarMovieCard: {
    width: 120,
    height: 180,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarMovieImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.text,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default MovieDetailScreen;
