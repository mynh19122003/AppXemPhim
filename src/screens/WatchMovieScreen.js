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
import { movieDetailService } from '../api/endpoints/movieDetail';
import VideoPlayer from '../components/VideoPlayer';
import { getImageSource } from '../utils/imageUtils';

const WatchMovieScreen = ({ navigation, route }) => {
  const { movie, episodeSlug = null } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    loadMovieData();
  }, []);

  useEffect(() => {
    if (episodeSlug && episodes.length > 0) {
      // Tự động phát episode được chỉ định
      const episode = findEpisodeBySlug(episodeSlug);
      if (episode) {
        playEpisode(episode);
      }
    }
  }, [episodes, episodeSlug]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      console.log(`🎬 Loading movie data for: ${movie.slug}`);
      
      // Lấy chi tiết phim và episodes
      const result = await movieDetailService.getMovieDetail(movie.slug);
      if (result && result.movie) {
        setMovieDetail(result.movie);
        console.log(`✅ Movie loaded: ${result.movie.name}`);
      }
      
      const episodesList = await movieDetailService.getEpisodes(movie.slug);
      setEpisodes(episodesList);
      console.log(`📺 Episodes loaded: ${episodesList.length} servers`);
      
      // Log episodes structure để debug
      episodesList.forEach((group, index) => {
        console.log(`Server ${index + 1}: ${group.server_name} - ${group.server_data?.length || 0} episodes`);
      });
      
      // Nếu chỉ có 1 server và 1 episode (phim lẻ), tự động phát
      if (episodesList.length === 1 && episodesList[0].server_data?.length === 1) {
        const episode = episodesList[0].server_data[0];
        console.log(`🎥 Auto-playing single episode: ${episode.name}`);
        await playEpisode(episode);
      }
      // Nếu có episodeSlug được chỉ định, tự động phát episode đó
      else if (episodeSlug) {
        console.log(`🎯 Looking for specified episode: ${episodeSlug}`);
        const episode = findEpisodeBySlug(episodeSlug);
        if (episode) {
          await playEpisode(episode);
        } else {
          console.warn(`⚠️ Episode ${episodeSlug} not found, user can select manually`);
        }
      }
    } catch (error) {
      console.error('❌ Load movie data error:', error);
      Alert.alert(
        'Lỗi tải phim',
        `Không thể tải thông tin phim "${movie.name}". Vui lòng thử lại.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const findEpisodeBySlug = (slug) => {
    for (const episodeGroup of episodes) {
      const found = episodeGroup.server_data?.find(ep => ep.slug === slug);
      if (found) return found;
    }
    return null;
  };

  const playEpisode = async (episode) => {
    try {
      setVideoLoading(true);
      setSelectedEpisode(episode);
      console.log(`🎬 Playing episode: ${episode.name}`);
      
      const streamData = await movieDetailService.getEpisodeStreamUrl(movie.slug, episode.slug);
      
      console.log(`🎥 Stream data received:`, {
        hasM3u8: !!streamData.m3u8Url,
        hasEmbed: !!streamData.embedUrl,
        serverName: streamData.serverName
      });
      
      // Ưu tiên M3U8, fallback sang embed
      const videoUrl = streamData.streamUrl;
      
      if (!videoUrl) {
        throw new Error('Không có link video khả dụng');
      }
      
      console.log(`▶️ Setting video URL: ${videoUrl.substring(0, 50)}...`);
      setStreamUrl(videoUrl);
      
    } catch (error) {
      console.error('❌ Play episode error:', error);
      Alert.alert(
        'Lỗi phát video',
        `Không thể phát episode "${episode.name}". ${error.message}`,
        [
          { text: 'Thử episode khác', style: 'default' },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setVideoLoading(false);
    }
  };

  const closeVideo = () => {
    setStreamUrl(null);
    setSelectedEpisode(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderEpisodeItem = ({ item: episodeGroup, index: groupIndex }) => {
    if (!episodeGroup.server_data || episodeGroup.server_data.length === 0) {
      return null;
    }

    return (
      <View style={styles.episodeGroup}>
        <Text style={styles.serverName}>
          {episodeGroup.server_name || `Server ${groupIndex + 1}`}
          <Text style={styles.episodeCount}> ({episodeGroup.server_data.length} tập)</Text>
        </Text>
        
        <View style={styles.episodesGrid}>
          {episodeGroup.server_data.map((episode, episodeIndex) => (
            <TouchableOpacity
              key={episodeIndex}
              style={[
                styles.episodeCard,
                selectedEpisode?.slug === episode.slug && styles.selectedEpisodeCard
              ]}
              onPress={() => playEpisode(episode)}
              disabled={videoLoading}
            >
              <Text style={[
                styles.episodeText,
                selectedEpisode?.slug === episode.slug && styles.selectedEpisodeText
              ]}>
                {episode.name}
              </Text>
              {/* Hiển thị indicator cho video quality */}
              <View style={styles.qualityIndicators}>
                {episode.link_m3u8 && (
                  <Text style={styles.qualityBadge}>M3U8</Text>
                )}
                {episode.link_embed && (
                  <Text style={styles.qualityBadge}>HD</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
      {streamUrl && (
        <VideoPlayer
          source={streamUrl}
          onClose={closeVideo}
          title={`${movie.name} - ${selectedEpisode?.name || ''}`}
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
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
              {movie.name}
            </Text>
          </View>

          {/* Movie Info */}
          <View style={styles.movieInfo}>
            <Image 
              source={getImageSource(movie.poster_url || movie.thumb_url, true)} 
              style={styles.poster} 
            />
            
            <View style={styles.movieDetails}>
              <Text style={styles.movieTitle}>{movie.name}</Text>
              <Text style={styles.movieOriginName}>{movie.origin_name}</Text>
              
              <View style={styles.movieMeta}>
                <Text style={styles.metaText}>⭐ {movie.year || 'N/A'}</Text>
                <Text style={styles.metaText}>📺 {movie.episode_current || 'N/A'}</Text>
                <Text style={styles.metaText}>🌍 {movie.country?.[0]?.name || 'N/A'}</Text>
              </View>

              <View style={styles.genresContainer}>
                {(movieDetail?.category || movie.category || []).slice(0, 3).map((item, index) => (
                  <View key={index} style={styles.genreChip}>
                    <Text style={styles.genreText}>
                      {typeof item === 'object' ? item.name : item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Loading Video */}
          {videoLoading && (
            <View style={styles.videoLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.videoLoadingText}>Đang tải video...</Text>
              <Text style={styles.videoLoadingSubtext}>
                {selectedEpisode ? `Tập: ${selectedEpisode.name}` : 'Đang xử lý link stream...'}
              </Text>
            </View>
          )}

          {/* Video Player Info */}
          {streamUrl && !isFullscreen && (
            <View style={styles.videoInfoContainer}>
              <Text style={styles.videoInfoTitle}>Đang phát</Text>
              <Text style={styles.videoInfoEpisode}>
                {selectedEpisode?.name || 'Video'} - {movie.name}
              </Text>
              <Text style={styles.videoInfoUrl}>
                Stream: {streamUrl.includes('m3u8') ? 'M3U8 Stream' : 'Video Player'}
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
          {movieDetail?.content && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nội dung phim</Text>
              <Text style={styles.description}>
                {movieDetail.content.replace(/<[^>]*>/g, '')}
              </Text>
            </View>
          )}

          {/* Movie Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.detailsList}>
              <DetailRow label="Đạo diễn" value={movieDetail?.director?.join(', ') || 'N/A'} />
              <DetailRow label="Diễn viên" value={movieDetail?.actor?.join(', ') || 'N/A'} />
              <DetailRow label="Thể loại" value={movieDetail?.category?.map(c => c.name).join(', ') || 'N/A'} />
              <DetailRow label="Quốc gia" value={movieDetail?.country?.map(c => c.name).join(', ') || 'N/A'} />
              <DetailRow label="Năm sản xuất" value={movieDetail?.year || 'N/A'} />
              <DetailRow label="Thời lượng" value={movieDetail?.time || 'N/A'} />
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
  videoLoadingContainer: {
    backgroundColor: colors.cardBackground,
    margin: 15,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoLoadingText: {
    color: colors.text,
    marginTop: 10,
    fontSize: 16,
  },
  videoLoadingSubtext: {
    color: colors.textSecondary,
    marginTop: 5,
    fontSize: 12,
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