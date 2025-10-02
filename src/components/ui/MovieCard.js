/**
 * MovieCard UI Component - Hiển thị movie card
 * Tách riêng để dễ debug UI issues
 */
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { getImageSource, getOriginalImageUrl, logImageError } from '../../utils/imageUtils';

export const MovieCard = ({ movie, onPress, showEpisodes = false, style = {} }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = (error) => {
    const imageUrl = movie.poster_url || movie.thumb_url;
    console.log('❌ Image load error for:', movie.name);
    logImageError(imageUrl, error.nativeEvent?.error || 'Unknown error');
    setImageError(true);
  };

  const imageSource = imageError 
    ? { uri: getOriginalImageUrl(movie.poster_url || movie.thumb_url) }
    : getImageSource(movie.poster_url || movie.thumb_url, true);

  const getDisplayInfo = () => {
    if (showEpisodes && movie.episode_current) {
      return movie.episode_current;
    }
    return movie.year || 'N/A';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}>
      <Image 
        source={imageSource}
        style={styles.image}
        onError={handleImageError}
      />
      <LinearGradient
        colors={colors.gradientOverlay}
        style={styles.overlay}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View style={styles.info}>
          <Text style={styles.rating}>⭐ {getDisplayInfo()}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {movie.name || movie.origin_name}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 210,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBackground,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  info: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rating: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default MovieCard;