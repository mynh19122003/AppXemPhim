import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Movie } from '../types/movie';
import { getMovieImageUrl } from '../utils/imageHelper';
import { getMovieDisplayInfo, getMovieTitle } from '../utils/movieHelper';
import { colors } from '../constants/colors';

const PLACEHOLDER_IMAGE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' };

interface MovieCardProps {
  movie: Movie;
  showDuration?: boolean;
  onPress: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showDuration = false,
  onPress,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const imageUrl = getMovieImageUrl(movie, false); // Luôn sử dụng ảnh gốc, không optimization
  
  // Debug log để kiểm tra URL
  React.useEffect(() => {
    if (imageUrl) {
      console.log('🎬 MovieCard URL:', movie.name);
      console.log('📷 Direct Image URL:', imageUrl);
    }
  }, [imageUrl, movie.name]);

  return (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}>
      <Image 
        source={
          imageError || !imageUrl 
            ? PLACEHOLDER_IMAGE 
            : { 
                uri: imageUrl,
                cache: 'reload' // Force reload để tránh cache issues
              }
        }
        style={styles.movieImage}
        resizeMode="cover"
        onError={(error) => {
          console.log('❌ Image error for:', movie.name, error.nativeEvent?.error);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('✅ Image loaded for:', movie.name);
        }}
      />
      <LinearGradient
        colors={colors.gradientOverlay}
        style={styles.movieOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieRating}>
            {getMovieDisplayInfo(movie, showDuration)}
          </Text>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {getMovieTitle(movie)}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  movieCard: {
    width: 150,
    height: 200,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    height: '40%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  movieRating: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});
