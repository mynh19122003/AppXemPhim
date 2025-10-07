// Test component để kiểm tra render errors đã được fix chưa
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getMovieDisplayInfo, getMovieTitle, getMovieGenres } from '../utils/movieHelper';

const TestRenderFix = () => {
  // Test data có thể gây render error
  const testMovie = {
    id: '1',
    name: 'Test Movie',
    year: 2024,
    category: [
      { id: '1', name: 'Action', slug: 'action' },
      { id: '2', name: 'Drama', slug: 'drama' }
    ],
    country: [
      { id: 'vn', name: 'Việt Nam', slug: 'viet-nam' }
    ],
    episode_current: '10/20',
    time: '120 phút'
  };

  const testBadMovie = {
    id: '2',
    category: { id: '1', name: 'Horror' }, // Object thay vì array
    country: { name: 'Japan' }, // Object thay vì array
    year: { value: 2023 }, // Object thay vì number
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#1a1a1a' }}>
      <Text style={{ color: 'white', fontSize: 20, marginBottom: 20 }}>
        🧪 Test Render Fix
      </Text>
      
      {/* Test good movie */}
      <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#333' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>✅ Good Movie:</Text>
        <Text style={{ color: 'white' }}>Title: {getMovieTitle(testMovie)}</Text>
        <Text style={{ color: 'white' }}>Display: {getMovieDisplayInfo(testMovie)}</Text>
        <Text style={{ color: 'white' }}>Genres: {getMovieGenres(testMovie).join(', ')}</Text>
      </View>
      
      {/* Test bad movie that could cause render error */}
      <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#333' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>⚠️ Bad Movie:</Text>
        <Text style={{ color: 'white' }}>Title: {getMovieTitle(testBadMovie as any)}</Text>
        <Text style={{ color: 'white' }}>Display: {getMovieDisplayInfo(testBadMovie as any)}</Text>
        <Text style={{ color: 'white' }}>Genres: {getMovieGenres(testBadMovie as any).join(', ')}</Text>
      </View>

      {/* Test category objects */}
      <View style={{ marginBottom: 20, padding: 10, backgroundColor: '#333' }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>📂 Category Test:</Text>
        {testMovie.category.map((cat, index) => (
          <Text key={`cat-${index}`} style={{ color: 'white' }}>
            {typeof cat === 'object' ? (cat.name || String(cat)) : String(cat)}
          </Text>
        ))}
      </View>

      <Text style={{ color: 'green', fontSize: 16, textAlign: 'center' }}>
        🎉 Nếu thấy text này, render fix đã thành công!
      </Text>
    </ScrollView>
  );
};

export default TestRenderFix;