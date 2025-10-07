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
import { getMovieDisplayInfo, getMovieTitle } from '../utils/movieHelper';
import { colors } from '../constants/colors';

const PLACEHOLDER_IMAGE = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' };

// Helper function để lấy URL hình ảnh gốc từ API
const getOriginalImageUrl = (movie: Movie) => {
  if (!movie) return null;
  
  // Thử các trường hình ảnh khác nhau từ API (ưu tiên field mới)
  let imageUrl = movie.poster || movie.thumbnail || movie.poster_url || movie.thumb_url || movie.image;
  
  if (!imageUrl) {
    console.log('⚠️ No image URL found for movie:', movie.title || movie.name);
    return null;
  }
  
  // Nếu URL đã có domain thì dùng luôn
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Thêm domain phimimg.com cho relative URLs
  return `https://phimimg.com/${imageUrl}`;
};

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
  const imageUrl = getOriginalImageUrl(movie); // Sử dụng hình ảnh gốc từ API
  
  // Debug log để kiểm tra URL
  React.useEffect(() => {
    console.log('🎬 MovieCard Debug:', {
      movieName: movie.name,
      posterUrl: movie.poster_url,
      thumbUrl: movie.thumb_url,
      finalUrl: imageUrl,
      hasImageUrl: !!imageUrl
    });
  }, [imageUrl, movie.title || movie.name]);

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
          console.log('❌ Image error for:', movie.title || movie.name, error.nativeEvent?.error);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('✅ Image loaded for:', movie.title || movie.name);
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
