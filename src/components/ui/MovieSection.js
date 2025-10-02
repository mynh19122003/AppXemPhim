/**
 * MovieSection UI Component - Hiển thị section phim
 * Dễ debug layout issues
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import MovieCard from './MovieCard';

export const MovieSection = ({ 
  title, 
  movies, 
  showEpisodes = false, 
  onMoviePress,
  style = {} 
}) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie._id || movie.id || index}
            movie={movie}
            showEpisodes={showEpisodes}
            onPress={() => onMoviePress && onMoviePress(movie)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 20,
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
});

export default MovieSection;