/**
 * Performance Monitor Component
 * Theo hướng dẫn copilot-instructions.md để đảm bảo performance
 */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getImageCacheSize, getImageStats, printImageSummary} from '../utils/imageUtils';

const PerformanceMonitor = () => {
  const [stats, setStats] = useState({
    imagesCached: 0,
    webpRatio: 0,
    cacheRatio: 0,
    totalRequests: 0,
    errors: 0,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateStats = () => {
    const imageStats = getImageStats();
    setStats({
      imagesCached: getImageCacheSize(),
      webpRatio: parseFloat(imageStats.webpRatio || 0),
      cacheRatio: parseFloat(imageStats.cacheRatio || 0),
      totalRequests: imageStats.totalRequests || 0,
      errors: imageStats.errors || 0,
    });
  };

  useEffect(() => {
    // Cập nhật stats mỗi 3 giây
    const interval = setInterval(updateStats, 3000);
    updateStats(); // Chạy ngay lập tức

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      printImageSummary(); // Print chi tiết vào console
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>🚀 Performance</Text>
      <Text style={styles.stat}>📸 Cache: {stats.imagesCached}</Text>
      <Text style={styles.stat}>🔧 Req: {stats.totalRequests}</Text>
      
      {isExpanded && (
        <>
          <Text style={styles.stat}>🔄 WebP: {stats.webpRatio}%</Text>
          <Text style={styles.stat}>⚡ Cache Hit: {stats.cacheRatio}%</Text>
          <Text style={styles.stat}>❌ Errors: {stats.errors}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    minWidth: 100,
  },
  title: {
    color: '#00ff00',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  stat: {
    color: '#fff',
    fontSize: 9,
    marginBottom: 1,
  },
});

export default PerformanceMonitor;