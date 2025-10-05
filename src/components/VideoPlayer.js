import React, { useState, useRef, useEffect } from 'react';
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

const VideoPlayer = ({ 
  source, 
  onClose, 
  title = 'Video Player',
  isFullscreen = false,
  onFullscreenToggle 
}) => {
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    // Khóa orientation khi component mount
    if (isFullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        onFullscreenToggle();
        return true;
      }
      return false;
    });

    return () => {
      Orientation.unlockAllOrientations();
      backHandler.remove();
    };
  }, [isFullscreen]);

  useEffect(() => {
    // Auto hide controls
    if (showControls && !paused) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls, paused]);

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setLoading(false);
    setError(null);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onError = (error) => {
    console.error('Video Error:', error);
    setError('Không thể phát video. Vui lòng thử lại.');
    setLoading(false);
    Alert.alert(
      'Lỗi phát video',
      'Không thể phát video này. Vui lòng thử lại sau.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const onBuffer = ({ isBuffering }) => {
    setBuffering(isBuffering);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
    }
  };

  const onProgressBarPress = (event) => {
    const { locationX } = event.nativeEvent;
    const progressBarWidth = screenWidth - 40;
    const newTime = (locationX / progressBarWidth) * duration;
    seekTo(newTime);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const skip = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  };

  const videoStyle = isFullscreen 
    ? { width: screenHeight, height: screenWidth }
    : { width: screenWidth, height: 220 };

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <StatusBar hidden={isFullscreen} />
      
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={toggleControls}
        style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}
      >
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={[styles.video, videoStyle]}
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onError}
          onBuffer={onBuffer}
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

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
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
            <TouchableOpacity style={styles.retryButton} onPress={onClose}>
              <Text style={styles.retryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && !loading && !error && (
          <View style={styles.controlsOverlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>{title}</Text>
              {!isFullscreen && (
                <TouchableOpacity onPress={onFullscreenToggle} style={styles.fullscreenButton}>
                  <Text style={styles.fullscreenIcon}>⛶</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={() => skip(-10)} style={styles.skipButton}>
                <Text style={styles.skipText}>⏪ 10s</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                <Text style={styles.playIcon}>{paused ? '▶️' : '⏸️'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => skip(10)} style={styles.skipButton}>
                <Text style={styles.skipText}>10s ⏩</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
              
              <TouchableOpacity
                style={styles.progressBar}
                onPress={onProgressBarPress}
                activeOpacity={0.8}
              >
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(currentTime / duration) * 100}%` }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBackground,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  videoContainer: {
    position: 'relative',
  },
  fullscreenVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    backgroundColor: colors.darkBackground,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 10,
    fontSize: 16,
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
    color: colors.text,
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
    color: colors.text,
    fontWeight: 'bold',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeIcon: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  fullscreenButton: {
    padding: 10,
  },
  fullscreenIcon: {
    color: colors.text,
    fontSize: 18,
  },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    padding: 15,
    marginHorizontal: 20,
  },
  skipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
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
    paddingBottom: 20,
  },
  timeText: {
    color: colors.text,
    fontSize: 12,
    minWidth: 80,
  },
  progressBar: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    marginLeft: 10,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default VideoPlayer;