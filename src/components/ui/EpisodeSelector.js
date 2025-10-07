import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { movieDetailService } from '../../services/api/movieDetailService';

const EpisodeSelector = ({ 
  movie, 
  visible, 
  onClose, 
  onEpisodeSelect,
  selectedEpisode = null 
}) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState(new Set([0])); // Mở group đầu tiên

  useEffect(() => {
    if (visible) {
      loadEpisodes();
    }
  }, [visible]);

  const loadEpisodes = async () => {
    try {
      setLoading(true);
      const episodesList = await movieDetailService.getEpisodes(movie.slug);
      setEpisodes(episodesList);
    } catch (error) {
      console.error('Load episodes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupIndex) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex);
    } else {
      newExpanded.add(groupIndex);
    }
    setExpandedGroups(newExpanded);
  };

  const handleEpisodeSelect = (episode) => {
    onEpisodeSelect(episode);
    onClose();
  };

  const renderEpisodeGroup = ({ item: episodeGroup, index: groupIndex }) => {
    if (!episodeGroup.server_data || episodeGroup.server_data.length === 0) {
      return null;
    }

    const isExpanded = expandedGroups.has(groupIndex);
    const serverName = episodeGroup.server_name || `Server ${groupIndex + 1}`;

    return (
      <View style={styles.episodeGroup}>
        <TouchableOpacity
          style={styles.groupHeader}
          onPress={() => toggleGroup(groupIndex)}
        >
          <Text style={styles.serverName}>{serverName}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.episodesGrid}>
            {episodeGroup.server_data.map((episode, episodeIndex) => (
              <TouchableOpacity
                key={episodeIndex}
                style={[
                  styles.episodeCard,
                  selectedEpisode?.slug === episode.slug && styles.selectedEpisodeCard
                ]}
                onPress={() => handleEpisodeSelect(episode)}
              >
                <Text style={[
                  styles.episodeText,
                  selectedEpisode?.slug === episode.slug && styles.selectedEpisodeText
                ]}>
                  {episode.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient colors={colors.gradientStart} style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chọn tập phim</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Movie Info */}
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {movie.name}
            </Text>
            <Text style={styles.episodeCount}>
              {episodes.reduce((total, group) => total + (group.server_data?.length || 0), 0)} tập
            </Text>
          </View>

          {/* Episodes List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Đang tải danh sách tập...</Text>
            </View>
          ) : (
            <FlatList
              data={episodes}
              renderItem={renderEpisodeGroup}
              keyExtractor={(item, index) => index.toString()}
              style={styles.episodesList}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Quick Actions */}
          {!loading && episodes.length > 0 && (
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => {
                  // Phát tập đầu tiên
                  const firstEpisode = episodes[0]?.server_data?.[0];
                  if (firstEpisode) {
                    handleEpisodeSelect(firstEpisode);
                  }
                }}
              >
                <Text style={styles.quickActionText}>Phát từ đầu</Text>
              </TouchableOpacity>

              {episodes.length > 1 && (
                <TouchableOpacity
                  style={[styles.quickActionButton, styles.quickActionButtonSecondary]}
                  onPress={() => {
                    // Mở tất cả groups
                    const allGroups = new Set(episodes.map((_, index) => index));
                    setExpandedGroups(allGroups);
                  }}
                >
                  <Text style={styles.quickActionTextSecondary}>Mở tất cả</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  movieInfo: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  episodeCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 10,
  },
  episodesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  episodeGroup: {
    marginVertical: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  expandIcon: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  episodeCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  },
  selectedEpisodeText: {
    color: colors.darkBackground,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  quickActionButtonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 0,
    marginLeft: 10,
  },
  quickActionText: {
    color: colors.darkBackground,
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActionTextSecondary: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EpisodeSelector;