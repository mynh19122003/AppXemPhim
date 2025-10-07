// components/VideoPlayer/VideoPlayer.tsx - Video Player hoàn chỉnh với react-native-video

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { colors } from '../../constants/colors';
import VideoControls from './VideoControls';
import { formatTime } from '../../utils/timeHelper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Episode {
  id: string;
  title: string;
  videoUrl: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  episodes?: Episode[];
  currentEpisodeIndex?: number;
  onEpisodeChange?: (episode: Episode, index: number) => void;
  onGoBack?: () => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title = 'Video',
  episodes = [],
  currentEpisodeIndex = 0,
  onEpisodeChange,
  onGoBack,
  isFullscreen = false,
  onFullscreenToggle,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [seeking, setSeeking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1.0);

  // Auto hide controls
  const hideControlsTimer = useRef<number | null>(null);

  useEffect(() => {
    // Handle back button cho fullscreen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        toggleFullscreen();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isFullscreen]);

  // Auto hide controls after 3 seconds
  useEffect(() => {
    if (showControls && !paused) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [showControls, paused]);

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    
    if (newFullscreenState) {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true, 'fade');
    } else {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false, 'fade');
    }
    
    onFullscreenToggle?.(newFullscreenState);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
    setShowControls(true);
  };

  const onLoad = (data: any) => {
    console.log('📹 Video loaded:', data);
    setDuration(data.duration);
    setLoading(false);
    setError(null);
  };

  const onProgress = (data: any) => {
    if (!seeking) {
      setCurrentTime(data.currentTime);
    }
  };

  const onError = (error: any) => {
    console.error('❌ Video error:', error);
    setError('Không thể phát video. Vui lòng thử lại.');
    setLoading(false);
  };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setBuffering(isBuffering);
  };

  const onSeek = (time: number) => {
    setSeeking(true);
    setCurrentTime(time);
    videoRef.current?.seek(time);
    
    setTimeout(() => {
      setSeeking(false);
    }, 100);
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    onSeek(newTime);
  };

  const onVideoPress = () => {
    setShowControls(!showControls);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(rate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setRate(rates[nextIndex]);
  };

  const playNextEpisode = () => {
    if (episodes.length > 0 && currentEpisodeIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentEpisodeIndex + 1];
      onEpisodeChange?.(nextEpisode, currentEpisodeIndex + 1);
    }
  };

  const playPreviousEpisode = () => {
    if (episodes.length > 0 && currentEpisodeIndex > 0) {
      const prevEpisode = episodes[currentEpisodeIndex - 1];
      onEpisodeChange?.(prevEpisode, currentEpisodeIndex - 1);
    }
  };

  const videoStyle = isFullscreen 
    ? styles.fullscreenVideo 
    : styles.normalVideo;

  const containerStyle = isFullscreen 
    ? styles.fullscreenContainer 
    : styles.normalContainer;

  if (error) {
    return (
      <View style={[containerStyle, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          setError(null);
          setLoading(true);
        }}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <TouchableOpacity 
        style={styles.videoWrapper}
        activeOpacity={1}
        onPress={onVideoPress}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={videoStyle}
          paused={paused}
          volume={volume}
          muted={muted}
          rate={rate}
          resizeMode="contain"
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onError}
          onBuffer={onBuffer}
          onEnd={() => {
            // Auto play next episode
            if (episodes.length > 0 && currentEpisodeIndex < episodes.length - 1) {
              playNextEpisode();
            }
          }}
          progressUpdateInterval={1000}
          bufferConfig={{
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
          }}
        />

        {/* Loading Indicator */}
        {(loading || buffering) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {loading ? 'Đang tải...' : 'Đang buffer...'}
            </Text>
          </View>
        )}

        {/* Video Controls */}
        {showControls && (
          <VideoControls
            paused={paused}
            currentTime={currentTime}
            duration={duration}
            isFullscreen={isFullscreen}
            volume={volume}
            muted={muted}
            rate={rate}
            title={title}
            hasNextEpisode={episodes.length > 0 && currentEpisodeIndex < episodes.length - 1}
            hasPreviousEpisode={episodes.length > 0 && currentEpisodeIndex > 0}
            onPlayPause={togglePlayPause}
            onSeek={onSeek}
            onSkip={skipTime}
            onFullscreen={toggleFullscreen}
            onVolumeChange={setVolume}
            onMute={toggleMute}
            onRateChange={changePlaybackRate}
            onGoBack={onGoBack}
            onNextEpisode={playNextEpisode}
            onPreviousEpisode={playPreviousEpisode}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  normalContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  normalVideo: {
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: screenHeight, // Rotate dimensions
    height: screenWidth,
    position: 'absolute',
    top: (screenHeight - screenWidth) / 2,
    left: (screenWidth - screenHeight) / 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;