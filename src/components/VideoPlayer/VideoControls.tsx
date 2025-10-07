// components/VideoPlayer/VideoControls.tsx - Video Controls với đầy đủ chức năng

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../../constants/colors';
import { formatTime } from '../../utils/timeHelper';

const { width: screenWidth } = Dimensions.get('window');

interface VideoControlsProps {
  paused: boolean;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
  volume: number;
  muted: boolean;
  rate: number;
  title: string;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onFullscreen: () => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onRateChange: () => void;
  onGoBack?: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  paused,
  currentTime,
  duration,
  isFullscreen,
  volume,
  muted,
  rate,
  title,
  hasNextEpisode,
  hasPreviousEpisode,
  onPlayPause,
  onSeek,
  onSkip,
  onFullscreen,
  onVolumeChange,
  onMute,
  onRateChange,
  onGoBack,
  onNextEpisode,
  onPreviousEpisode,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(currentTime);

  const onSliderStart = () => {
    setSeeking(true);
  };

  const onSliderChange = (value: number) => {
    setSeekTime(value);
  };

  const onSliderComplete = (value: number) => {
    setSeeking(false);
    onSeek(value);
  };

  const displayTime = seeking ? seekTime : currentTime;
  const progress = duration > 0 ? displayTime / duration : 0;

  return (
    <View style={styles.overlay}>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.controlIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.topRightControls}>
          <TouchableOpacity style={styles.rateButton} onPress={onRateChange}>
            <Text style={styles.rateText}>{rate}x</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Controls */}
      <View style={styles.centerControls}>
        {/* Previous Episode */}
        {hasPreviousEpisode && (
          <TouchableOpacity style={styles.episodeButton} onPress={onPreviousEpisode}>
            <Text style={styles.episodeIcon}>⏮</Text>
          </TouchableOpacity>
        )}

        {/* Skip Backward */}
        <TouchableOpacity style={styles.skipButton} onPress={() => onSkip(-10)}>
          <Text style={styles.skipIcon}>⏪</Text>
          <Text style={styles.skipText}>10s</Text>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
          <Text style={styles.playIcon}>
            {paused ? '▶' : '⏸'}
          </Text>
        </TouchableOpacity>

        {/* Skip Forward */}
        <TouchableOpacity style={styles.skipButton} onPress={() => onSkip(10)}>
          <Text style={styles.skipIcon}>⏩</Text>
          <Text style={styles.skipText}>10s</Text>
        </TouchableOpacity>

        {/* Next Episode */}
        {hasNextEpisode && (
          <TouchableOpacity style={styles.episodeButton} onPress={onNextEpisode}>
            <Text style={styles.episodeIcon}>⏭</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(displayTime)}</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.progressSlider}
              minimumValue={0}
              maximumValue={duration}
              value={displayTime}
              onSlidingStart={onSliderStart}
              onValueChange={onSliderChange}
              onSlidingComplete={onSliderComplete}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor={colors.primary}
            />
          </View>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Bottom Row Controls */}
        <View style={styles.bottomRow}>
          <View style={styles.leftControls}>
            {/* Volume Control */}
            <TouchableOpacity 
              style={styles.volumeButton}
              onPress={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              <Text style={styles.controlIcon}>
                {muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </Text>
            </TouchableOpacity>

            {/* Volume Slider */}
            {showVolumeSlider && (
              <View style={styles.volumeSliderContainer}>
                <Slider
                  style={styles.volumeSlider}
                  minimumValue={0}
                  maximumValue={1}
                  value={muted ? 0 : volume}
                  onValueChange={onVolumeChange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbTintColor={colors.primary}
                />
              </View>
            )}

            <TouchableOpacity style={styles.muteButton} onPress={onMute}>
              <Text style={styles.controlText}>
                {muted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightControls}>
            <TouchableOpacity style={styles.fullscreenButton} onPress={onFullscreen}>
              <Text style={styles.controlIcon}>
                {isFullscreen ? '⤡' : '⤢'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  controlIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  episodeButton: {
    padding: 15,
    marginHorizontal: 10,
  },
  episodeIcon: {
    color: '#fff',
    fontSize: 30,
  },
  skipButton: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 15,
  },
  skipIcon: {
    color: '#fff',
    fontSize: 24,
  },
  skipText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  playIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bottomControls: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 50,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  progressSlider: {
    width: '100%',
    height: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeButton: {
    padding: 8,
  },
  volumeSliderContainer: {
    width: 80,
    marginHorizontal: 10,
  },
  volumeSlider: {
    width: '100%',
    height: 20,
  },
  muteButton: {
    padding: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullscreenButton: {
    padding: 8,
  },
});

export default VideoControls;