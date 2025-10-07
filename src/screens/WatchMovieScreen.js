import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../constants/colors';
import { movieDetailService } from '../services/api/movieDetailService';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';

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

const WatchMovieScreen = ({ navigation, route }) => {
  const { movie, episodeSlug = null } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);
  const [flatEpisodes, setFlatEpisodes] = useState([]); // Flat list cho VideoPlayer

  useEffect(() => {
    loadMovieData();
  }, []);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      console.log(`🎬 Loading movie data for: ${movie.slug}`);
      
      // Lấy chi tiết phim và episodes từ movieDetailService
      const result = await movieDetailService.getMovieDetail(movie.slug);
      if (result && result.movie) {
        setMovieDetail(result.movie);
        console.log(`✅ Movie loaded: ${result.movie.name}`);
        
        // Set episodes từ movie detail
        if (result.episodes && result.episodes.length > 0) {
          setEpisodes(result.episodes);
          console.log(`📺 Episodes loaded: ${result.episodes.length} servers`);
          
          // Tạo flat episodes list cho VideoPlayer
          const allEpisodes = [];
          result.episodes.forEach((serverGroup) => {
            if (serverGroup.server_data && serverGroup.server_data.length > 0) {
              serverGroup.server_data.forEach((ep) => {
                allEpisodes.push({
                  id: ep.slug,
                  title: ep.name,
                  videoUrl: ep.link_m3u8 || ep.link_embed,
                  serverName: serverGroup.server_name,
                });
              });
            }
          });
          setFlatEpisodes(allEpisodes);
          console.log(`📋 Flat episodes created: ${allEpisodes.length} total episodes`);
          
          // Log episodes structure để debug
          result.episodes.forEach((group, index) => {
            console.log(`Server ${index + 1}: ${group.server_name} - ${group.server_data?.length || 0} episodes`);
          });
          
          // Nếu có episodes, tự động chọn episode đầu tiên
          if (allEpisodes.length > 0) {
            const firstEpisode = allEpisodes[0];
            setSelectedEpisode(firstEpisode);
            setCurrentEpisodeIndex(0);
            console.log(`🎥 Auto-selected first episode: ${firstEpisode.title}`);
          }
          
          // Nếu có episodeSlug được chỉ định, tìm và chọn episode đó
          if (episodeSlug) {
            console.log(`🎯 Looking for specified episode: ${episodeSlug}`);
            const episodeIndex = allEpisodes.findIndex(ep => ep.id === episodeSlug);
            if (episodeIndex !== -1) {
              setSelectedEpisode(allEpisodes[episodeIndex]);
              setCurrentEpisodeIndex(episodeIndex);
              console.log(`✅ Found and selected episode: ${allEpisodes[episodeIndex].title}`);
            } else {
              console.warn(`⚠️ Episode ${episodeSlug} not found, using first episode`);
            }
          }
        } else {
          console.log('⚠️ No episodes found in movie detail');
        }
      } else {
        console.warn('⚠️ No movie detail found');
      }
    } catch (error) {
      console.error('❌ Load movie data error:', error);
      Alert.alert(
        'Lỗi tải phim',
        `Không thể tải thông tin phim "${movie.title || movie.name}". Vui lòng thử lại.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle episode change từ VideoPlayer
  const handleEpisodeChange = (episode, index) => {
    setSelectedEpisode(episode);
    setCurrentEpisodeIndex(index);
    console.log(`🔄 Changed to episode: ${episode.title} (Index: ${index})`);
  };

  // Handle fullscreen toggle
  const handleFullscreenToggle = (isFullscreen) => {
    setIsFullscreen(isFullscreen);
  };

  const renderEpisodeItem = ({ item: episodeGroup, index: groupIndex }) => {
    if (!episodeGroup.episodes || episodeGroup.episodes.length === 0) {
      return null;
    }

    return (
      <View style={styles.episodeGroup}>
        <Text style={styles.serverName}>
          {episodeGroup.serverName || `Server ${groupIndex + 1}`}
          <Text style={styles.episodeCount}> ({episodeGroup.episodes.length} tập)</Text>
        </Text>
        
        <View style={styles.episodesGrid}>
          {episodeGroup.episodes.map((episode, episodeIndex) => {
            // Tìm index trong flatEpisodes
            const flatIndex = flatEpisodes.findIndex(ep => ep.id === episode.id);
            const isSelected = selectedEpisode?.id === episode.id;
            
            return (
              <TouchableOpacity
                key={episodeIndex}
                style={[
                  styles.episodeCard,
                  isSelected && styles.selectedEpisodeCard
                ]}
                onPress={() => {
                  const episodeToPlay = flatEpisodes[flatIndex];
                  if (episodeToPlay) {
                    handleEpisodeChange(episodeToPlay, flatIndex);
                  }
                }}
              >
                <Text style={[
                  styles.episodeText,
                  isSelected && styles.selectedEpisodeText
                ]}>
                  {episode.title}
                </Text>
                {/* Hiển thị indicator cho video quality */}
                <View style={styles.qualityIndicators}>
                  {episode.videoUrl && (
                    <Text style={styles.qualityBadge}>HD</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={colors.gradientStart} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin phim...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      {/* Video Player */}
      {selectedEpisode && selectedEpisode.videoUrl && (
        <VideoPlayer
          videoUrl={selectedEpisode.videoUrl}
          title={`${movie.title || movie.name} - ${selectedEpisode.title}`}
          episodes={flatEpisodes}
          currentEpisodeIndex={currentEpisodeIndex}
          onEpisodeChange={handleEpisodeChange}
          onGoBack={() => navigation.goBack()}
          isFullscreen={isFullscreen}
          onFullscreenToggle={handleFullscreenToggle}
        />
      )}

      {/* Content */}
      {!isFullscreen && (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {movie.title || movie.name}
            </Text>
          </View>

          {/* Movie Info */}
          <View style={styles.movieInfo}>
            <Image 
              source={{uri: getOriginalImageUrl(movie) || undefined}} 
              style={styles.poster} 
            />
            
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{movie.title || movie.name}</Text>
              <Text style={styles.movieOriginName}>{movie.origin_name}</Text>
              
              <View style={styles.movieMeta}>
                <Text style={styles.metaText}>⭐ {movie.year || 'N/A'}</Text>
                <Text style={styles.metaText}>📺 {movie.episode_current || 'N/A'}</Text>
                <Text style={styles.metaText}>🌍 {movie.country?.[0]?.name || 'N/A'}</Text>
              </View>

              <View style={styles.genresContainer}>
                {(movieDetail?.category || movie.category || []).slice(0, 3).map((item, index) => (
                  <View key={`genre-${index}`} style={styles.genreChip}>
                    <Text style={styles.genreText}>
                      {typeof item === 'object' && item !== null ? (item.name || item.title || String(item)) : String(item || '')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Video Player Info */}
          {selectedEpisode && selectedEpisode.videoUrl && !isFullscreen && (
            <View style={styles.videoInfoContainer}>
              <Text style={styles.videoInfoTitle}>Đang phát</Text>
              <Text style={styles.videoInfoEpisode}>
                {selectedEpisode.title || 'Video'} - {movie.title || movie.name}
              </Text>
              <Text style={styles.videoInfoUrl}>
                Stream: {selectedEpisode.videoUrl.includes('m3u8') ? 'M3U8 Stream' : 'Video Player'}
              </Text>
            </View>
          )}

          {/* Episodes List */}
          <View style={styles.episodesSection}>
            <Text style={styles.sectionTitle}>
              Danh sách tập phim ({episodes.reduce((total, group) => total + (group.server_data?.length || 0), 0)} tập)
            </Text>
            
            <FlatList
              data={episodes}
              renderItem={renderEpisodeItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Description */}
          {(movieDetail?.description || movieDetail?.content) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nội dung phim</Text>
              <Text style={styles.description}>
                {(movieDetail?.description || movieDetail?.content)?.replace(/<[^>]*>/g, '') || ''}
              </Text>
            </View>
          )}

          {/* Movie Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.detailsList}>
              <DetailRow label="Đạo diễn" value={movieDetail?.director || 'N/A'} />
              <DetailRow label="Diễn viên" value={Array.isArray(movieDetail?.cast) ? movieDetail.cast.join(', ') : (movieDetail?.cast || 'N/A')} />
              <DetailRow label="Thể loại" value={
                Array.isArray(movieDetail?.genres) 
                  ? movieDetail.genres.join(', ') 
                  : (Array.isArray(movieDetail?.categories) 
                      ? movieDetail.categories.map(c => typeof c === 'object' ? (c.name || c.title || String(c)) : String(c)).join(', ') 
                      : 'N/A')
              } />
              <DetailRow label="Quốc gia" value={
                typeof movieDetail?.country === 'string' 
                  ? movieDetail.country
                  : (Array.isArray(movieDetail?.countryData) 
                      ? movieDetail.countryData.map(c => typeof c === 'object' ? (c.name || c.title || String(c)) : String(c)).join(', ') 
                      : 'N/A')
              } />
              <DetailRow label="Năm sản xuất" value={movieDetail?.year || 'N/A'} />
              <DetailRow label="Thời lượng" value={movieDetail?.duration ? `${movieDetail.duration} phút` : (movieDetail?.time || 'N/A')} />
              <DetailRow label="Chất lượng" value={movieDetail?.quality || 'N/A'} />
            </View>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 0,
  },
  poster: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
  },
  movieDetails: {
    flex: 1,
    marginLeft: 15,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  movieOriginName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  movieMeta: {
    marginBottom: 10,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  genreText: {
    color: colors.text,
    fontSize: 11,
  },
  videoInfoContainer: {
    backgroundColor: colors.cardBackground,
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  videoInfoTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoInfoEpisode: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  videoInfoUrl: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  episodesSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  episodeGroup: {
    marginBottom: 20,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
  },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  episodeCard: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedEpisodeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  episodeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedEpisodeText: {
    color: colors.darkBackground,
    fontWeight: 'bold',
  },
  qualityIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  qualityBadge: {
    fontSize: 8,
    color: colors.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  episodeCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  section: {
    padding: 15,
    paddingTop: 0,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  detailsList: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    width: 100,
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
});

export default WatchMovieScreen;