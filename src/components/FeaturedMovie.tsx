// components/FeaturedMovie.tsx - Component hiển thị phim nổi bật

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Movie } from '../types/movie';
import { getMovieTitle, getMovieDescription, getMovieGenres } from '../utils/movieHelper';
import { colors } from '../constants/colors';

// Helper function để lấy URL hình ảnh gốc từ API
const getOriginalImageUrl = (movie: Movie) => {
  if (!movie) return null;
  
  // Sử dụng poster_url hoặc thumb_url trực tiếp từ API
  const imageUrl = movie.poster_url || movie.thumb_url;
  if (!imageUrl) return null;
  
  // Nếu URL đã có domain thì dùng luôn, không thì thêm domain phimimg.com
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  return `https://phimimg.com/${imageUrl}`;
};

interface FeaturedMovieProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

/**
 * Component hiển thị phim nổi bật ở đầu trang
 */
export const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie, onPress }) => {
  return (
    <View style={styles.featuredContainer}>
      <Image
        source={{ uri: getOriginalImageUrl(movie) || undefined }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={colors.gradientOverlay}
        style={styles.featuredOverlay}>
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredTitle}>
            {getMovieTitle(movie)}
          </Text>
          <View style={styles.featuredGenres}>
            {getMovieGenres(movie, 3).map((genre, index) => (
              <Text key={`featured-genre-${index}`} style={styles.genreTag}>
                {typeof genre === 'object' && genre !== null ? ((genre as any).name || (genre as any).title || String(genre)) : String(genre || '')}
              </Text>
            ))}
            <Text style={styles.genreTag}>{String(movie.year || '')}</Text>
            {movie.lang && <Text style={styles.genreTag}>{String(movie.lang)}</Text>}
          </View>
          <Text style={styles.featuredDescription} numberOfLines={3}>
            {getMovieDescription(movie)}
          </Text>
          <View style={styles.featuredButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => onPress(movie)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={colors.gradientPrimary}
                style={styles.playButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text style={styles.playButtonText}>▶ Xem ngay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  featuredContainer: {
    height: 500,
    marginBottom: 20,
    position: 'relative',
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
    height: '70%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredGenres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: colors.text,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  featuredDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredButtons: {
    flexDirection: 'row',
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});