# Video Player Feature - Tính năng xem phim

## Tổng quan

Tính năng xem phim được xây dựng với React Native Video, hỗ trợ phát video từ link M3U8 và embed, với khả năng xoay màn hình và điều khiển video đầy đủ.

## Cài đặt Dependencies

```bash
npm install react-native-video react-native-orientation-locker
```

## Cấu trúc Files

### API Services

- `src/api/endpoints/movieDetail.js` - Service để lấy thông tin phim và episodes
- Các method chính:
  - `getMovieDetail(slug)` - Lấy chi tiết phim
  - `getEpisodes(slug)` - Lấy danh sách tập phim
  - `getEpisodeStreamUrl(slug, episode)` - Lấy link stream video

### Components

- `src/components/VideoPlayer.js` - Component video player chính
- `src/components/ui/EpisodeSelector.js` - Component chọn tập phim
- `src/components/VideoTestComponent.js` - Component test video player

### Screens

- `src/screens/WatchMovieScreen.js` - Màn hình xem phim chính
- `src/screens/VideoTestScreen.js` - Màn hình test video player

## Tính năng Video Player

### Điều khiển cơ bản

- ▶️ Play/Pause
- ⏪ Tua lùi 10 giây
- ⏩ Tua tới 10 giây
- 🔄 Fullscreen toggle
- ✕ Đóng video

### Tính năng nâng cao

- Auto-hide controls sau 3 giây
- Loading indicator
- Buffering indicator
- Error handling
- Progress bar tương tác
- Orientation locking (portrait/landscape)

### Video Formats hỗ trợ

- MP4
- M3U8 (HLS)
- WebM
- Các format khác mà React Native Video hỗ trợ

## Cách sử dụng

### 1. Từ MovieDetailScreen

```javascript
// Nhấn nút "Phát phim"
// - Phim lẻ: Chuyển thẳng tới WatchMovieScreen
// - Phim bộ: Hiển thị EpisodeSelector để chọn tập
```

### 2. Navigation

```javascript
// Chuyển tới màn hình xem phim
navigation.navigate('WatchMovie', {
  movie: movieData,
  episodeSlug: 'tap-1', // Optional - cho phim bộ
});
```

### 3. API Response Structure

```javascript
{
  movie: {
    name: "Tên phim",
    episodes: [
      {
        server_name: "Server 1",
        server_data: [
          {
            name: "Tập 1",
            slug: "tap-1",
            link_m3u8: "https://example.com/video.m3u8",
            link_embed: "https://example.com/embed"
          }
        ]
      }
    ]
  }
}
```

## Cấu hình Android

### AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### MainActivity Configuration

```xml
android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
android:screenOrientation="portrait"
```

## Testing

### Chạy test video player

```bash
# Test API endpoints
node testVideoPlayer.js

# Test trong app
# Navigate to VideoTestScreen để test với sample videos
```

### Test URLs mẫu

- Sample MP4: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`
- Big Buck Bunny: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`

## Lỗi thường gặp

### 1. Video không phát được

- Kiểm tra URL video có hợp lệ
- Kiểm tra permissions trong AndroidManifest.xml
- Kiểm tra network connection

### 2. Orientation không hoạt động

- Đảm bảo đã cài react-native-orientation-locker
- Kiểm tra configChanges trong AndroidManifest.xml

### 3. Video bị lag/buffer

- Kiểm tra bufferConfig trong VideoPlayer
- Tối ưu network connection
- Sử dụng video quality phù hợp

## Performance Tips

### 1. Memory Management

- Giải phóng video player khi component unmount
- Không giữ nhiều video instances cùng lúc

### 2. Network Optimization

- Sử dụng bufferConfig phù hợp
- Implement adaptive bitrate nếu có

### 3. UX Improvements

- Hiển thị loading states
- Graceful error handling
- Auto-retry mechanisms

## Roadmap

### Tính năng sẽ phát triển

- [ ] Subtitle support
- [ ] Multiple video quality options
- [ ] Picture-in-Picture mode
- [ ] Chromecast support
- [ ] Download for offline viewing
- [ ] Watch history
- [ ] Resume playback from last position

## Troubleshooting

### Debug Steps

1. Check network connectivity
2. Verify video URL accessibility
3. Check Android permissions
4. Review React Native Video documentation
5. Test with sample videos first

### Common Issues

- CORS issues with some video hosts
- DRM protected content not supported
- Some M3U8 streams may require additional headers
