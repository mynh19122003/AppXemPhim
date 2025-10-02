import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../constants/colors';
import {getImageSource, getOriginalImageUrl, logImageError} from '../utils/imageUtils';

const MovieCard = ({movie, onPress, width = 140, height = 210}) => {
  const [imageError, setImageError] = useState(false);
  
  // Lấy source ảnh với WebP conversion
  const imageSource = imageError 
    ? {uri: getOriginalImageUrl(movie.poster_url || movie.thumb_url)}
    : getImageSource(movie.poster_url || movie.thumb_url, true);

  const handleImageError = (error) => {
    const imageUrl = movie.poster_url || movie.thumb_url;
    console.log('Image load error, fallback to original:', movie.name);
    logImageError(imageUrl, error.nativeEvent?.error || 'Unknown error');
    setImageError(true);
  };

  return (
    <TouchableOpacity
      style={[styles.container, {width, height}]}
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
          <Text style={styles.rating}>⭐ {movie.rating || 'N/A'}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MovieCard;
