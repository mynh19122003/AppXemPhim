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
import { getMovieImageUrl } from '../utils/imageHelper';
import { getMovieTitle, getMovieDescription, getMovieGenres } from '../utils/movieHelper';
import { colors } from '../constants/colors';

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
        source={{ uri: getMovieImageUrl(movie, false) || undefined }}
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
              <Text key={index} style={styles.genreTag}>
                {genre}
              </Text>
            ))}
            <Text style={styles.genreTag}>{movie.year}</Text>
            {movie.lang && <Text style={styles.genreTag}>{movie.lang}</Text>}
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