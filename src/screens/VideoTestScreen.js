import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../constants/colors';
import VideoPlayer from '../components/VideoPlayer';

const VideoTestScreen = ({ navigation }) => {
  const [testUrl, setTestUrl] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sample video URLs for testing
  const sampleUrls = [
    {
      name: 'Sample MP4',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    {
      name: 'Big Buck Bunny',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      name: 'Test M3U8',
      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    }
  ];

  const playVideo = (url) => {
    setTestUrl(url);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setTestUrl('');
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  return (
    <LinearGradient colors={colors.gradientStart} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBackground} />
      
      {/* Video Player */}
      {showVideo && testUrl && (
        <VideoPlayer
          source={testUrl}
          onClose={closeVideo}
          title="Test Video"
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
        />
      )}

      {/* Content */}
      {!isFullscreen && (
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Video Player Test</Text>
          </View>

          {/* Custom URL Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Video URL</Text>
            <TextInput
              style={styles.urlInput}
              placeholder="Nhập URL video (MP4, M3U8, etc.)"
              placeholderTextColor={colors.textSecondary}
              value={testUrl}
              onChangeText={setTestUrl}
              multiline={false}
            />
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                if (testUrl.trim()) {
                  playVideo(testUrl.trim());
                } else {
                  Alert.alert('Lỗi', 'Vui lòng nhập URL video');
                }
              }}
            >
              <Text style={styles.playButtonText}>▶ Phát Video Custom</Text>
            </TouchableOpacity>
          </View>

          {/* Sample Videos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sample Videos</Text>
            {sampleUrls.map((sample, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sampleButton}
                onPress={() => playVideo(sample.url)}
              >
                <Text style={styles.sampleButtonText}>{sample.name}</Text>
                <Text style={styles.sampleUrl} numberOfLines={1}>
                  {sample.url}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hướng dẫn Test</Text>
            <Text style={styles.instructionText}>
              1. Nhập URL video hoặc chọn sample video{'\n'}
              2. Nhấn Play để test video player{'\n'}
              3. Test các controls: play/pause, seek, fullscreen{'\n'}
              4. Test orientation khi fullscreen{'\n'}
              5. Test với các format khác nhau (MP4, M3U8)
            </Text>
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  urlInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    color: colors.text,
    fontSize: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  playButtonText: {
    color: colors.darkBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sampleButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  sampleButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  sampleUrl: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  instructionText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
});

export default VideoTestScreen;