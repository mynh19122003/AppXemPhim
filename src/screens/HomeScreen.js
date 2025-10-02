import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../constants/colors';
import {moviesData} from '../constants/movies';

const {width} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const MovieCard = ({movie}) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetail', {movie})}>
      <Image source={{uri: movie.thumbnail}} style={styles.movieImage} />
      <LinearGradient
        colors={colors.gradientOverlay}
        style={styles.movieOverlay}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieRating}>⭐ {movie.rating}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMovieRow = (title, movies) => (
    <View style={styles.movieSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.movieRow}>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎬 MOVIEFLIX</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Movie */}
        <View style={styles.featuredContainer}>
          <Image
            source={{uri: moviesData[0].banner}}
            style={styles.featuredImage}
          />
          <LinearGradient
            colors={colors.gradientOverlay}
            style={styles.featuredOverlay}>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredTitle}>{moviesData[0].title}</Text>
              <View style={styles.featuredGenres}>
                {moviesData[0].genre.map((genre, index) => (
                  <Text key={index} style={styles.genreTag}>
                    {genre}
                  </Text>
                ))}
              </View>
              <View style={styles.featuredButtons}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() =>
                    navigation.navigate('MovieDetail', {movie: moviesData[0]})
                  }>
                  <LinearGradient
                    colors={colors.gradientPrimary}
                    style={styles.playButtonGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Text style={styles.playButtonText}>▶ Xem ngay</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Movie Sections */}
        {renderMovieRow('Phim đề xuất', moviesData)}
        {renderMovieRow('Phim hành động', moviesData.filter(m => m.genre.includes('Action')))}
        {renderMovieRow('Phim khoa học viễn tưởng', moviesData.filter(m => m.genre.includes('Sci-Fi')))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  featuredContainer: {
    height: 500,
    marginBottom: 20,
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
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredInfo: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  featuredGenres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  genreTag: {
    color: colors.text,
    fontSize: 14,
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  featuredButtons: {
    flexDirection: 'row',
  },
  playButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  playButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  playButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 20,
    marginBottom: 15,
  },
  movieRow: {
    paddingHorizontal: 15,
  },
  movieCard: {
    width: 140,
    height: 210,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
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
    height: '50%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  movieInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieRating: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
