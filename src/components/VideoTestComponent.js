import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import VideoPlayer from '../VideoPlayer';
import { colors } from '../../constants/colors';

const VideoTestComponent = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Test URLs (thay thế bằng URL thực tế)
  const testUrls = [
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
  ];

  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const testVideo = (urlIndex = 0) => {
    setCurrentUrlIndex(urlIndex);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Player Test</Text>
      
      {testUrls.map((url, index) => (
        <TouchableOpacity
          key={index}
          style={styles.testButton}
          onPress={() => testVideo(index)}
        >
          <Text style={styles.buttonText}>Test Video {index + 1}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.testButton, styles.m3u8Button]}
        onPress={() => {
          Alert.alert(
            'M3U8 Test',
            'Để test M3U8, cần URL stream thực tế từ API',
            [{ text: 'OK' }]
          );
        }}
      >
        <Text style={styles.buttonText}>Test M3U8 Stream</Text>
      </TouchableOpacity>

      {showVideo && (
        <VideoPlayer
          source={testUrls[currentUrlIndex]}
          onClose={closeVideo}
          title={`Test Video ${currentUrlIndex + 1}`}
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.darkBackground,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  m3u8Button: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoTestComponent;