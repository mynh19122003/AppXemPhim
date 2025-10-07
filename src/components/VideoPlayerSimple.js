import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { colors } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayerSimple = ({ 
  source, 
  onClose, 
  title = 'Video Player',
  isFullscreen = false,
  onFullscreenToggle 
}) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        onFullscreenToggle();
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      // Reset orientation when unmounting
      Orientation.unlockAllOrientations();
    };
  }, [isFullscreen, onFullscreenToggle]);

  const handleClose = () => {
    Orientation.unlockAllOrientations();
    if (onClose) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    if (onFullscreenToggle) {
      onFullscreenToggle();
    }
  };

  // Video callbacks
  const onLoad = (data) => {
    console.log('🎬 Video loaded:', data);
    setDuration(data.duration);
    setLoading(false);
    setError(null);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onError = (error) => {
    console.error('🔥 Video Error:', error);
    console.error('🔥 Video Source URL:', source);
    setError('Không thể phát video. Vui lòng thử lại.');
    setLoading(false);
    Alert.alert(
      'Lỗi phát video',
      `Không thể phát video này. URL: ${source?.substring(0, 50)}...`,
      [
        { text: 'Thử lại', onPress: () => {
          setError(null);
          setLoading(true);
        }},
        { text: 'Đóng', onPress: handleClose }
      ]
    );
  };

  const onBuffer = ({ isBuffering }) => {
    setBuffering(isBuffering);
  };

  const onLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.black} barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
            <Text style={styles.fullscreenButtonText}>
              {isFullscreen ? '⊟' : '⊞'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Text style={styles.errorSubText}>
            Không thể phát video. Vui lòng kiểm tra kết nối mạng hoặc URL video.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.black} barStyle="light-content" />
      
      {/* Header với controls */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
          <Text style={styles.fullscreenButtonText}>
            {isFullscreen ? '⊟' : '⊞'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Video player */}
      <View style={styles.videoContainer}>
        {source && source.trim() ? (
          <Video
            ref={videoRef}
            source={{ uri: source }}
            style={styles.video}
            onLoad={onLoad}
            onProgress={onProgress}
            onError={onError}
            onBuffer={onBuffer}
            onLoadStart={onLoadStart}
            paused={paused}
            resizeMode="contain"
            repeat={false}
            playWhenInactive={false}
            playInBackground={false}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000
            }}
          />
        ) : (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>URL video không hợp lệ</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
              <Text style={styles.retryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.loadingText}>Đang tải video...</Text>
          </View>
        )}

        {/* Buffering Indicator */}
        {buffering && !loading && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Error Overlay */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
              <Text style={styles.retryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && !loading && !error && (
          <TouchableOpacity 
            style={styles.controlsOverlay}
            activeOpacity={1}
            onPress={() => setShowControls(!showControls)}
          >
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                <Text style={styles.playIcon}>{paused ? '▶️' : '⏸️'}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: StatusBar.currentHeight + 12,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenButton: {
    padding: 8,
    marginLeft: 12,
  },
  fullscreenButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    backgroundColor: colors.black,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 30,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  timeText: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
  },
  bufferingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  },
  loadingText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.red,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoPlayerSimple;