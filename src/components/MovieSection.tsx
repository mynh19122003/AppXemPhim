// components/MovieSection.tsx - Component hiển thị section phim

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { colors } from '../constants/colors';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  showDuration?: boolean;
  onMoviePress: (movie: Movie) => void;
  onSeeAllPress?: () => void;
}

/**
 * Component hiển thị section phim với tiêu đề và danh sách phim cuộn ngang
 */
export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  showDuration = false,
  onMoviePress,
  onSeeAllPress,
}) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.movieSection}>
      {/* Header với title và nút "Xem tất cả" */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity 
            onPress={onSeeAllPress}
            activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Xem tất cả →</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Danh sách phim cuộn ngang */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieRow}>
        {movies.map((movie, index) => (
          <MovieCard
            key={movie._id || movie.id || index}
            movie={movie}
            showDuration={showDuration}
            onPress={onMoviePress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  movieSection: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    flexShrink: 1,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  movieRow: {
    paddingHorizontal: 20,
  },
});