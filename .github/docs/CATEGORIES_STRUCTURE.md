# Cấu trúc Folder Categories

## Tổng quan
Đã tạo cấu trúc folder riêng biệt cho từng loại phim để dễ quản lý, debug và mở rộng.

## Cấu trúc folder categories

```
src/screens/categories/
├── index.ts                    # Export tất cả category screens
├── NewMovies/
│   └── NewMoviesScreen.tsx     # Màn hình phim mới nhất
├── SingleMovies/
│   └── SingleMoviesScreen.tsx  # Màn hình phim lẻ  
├── SeriesMovies/
│   └── SeriesMoviesScreen.tsx  # Màn hình phim bộ
├── Anime/
│   └── AnimeScreen.tsx         # Màn hình Anime
├── USUKMovies/
│   └── USUKMoviesScreen.tsx    # Màn hình phim US-UK
└── KoreanMovies/
    └── KoreanMoviesScreen.tsx  # Màn hình phim Hàn Quốc
```

## Tính năng của mỗi Category Screen

### ✅ Các tính năng chung:
- **Load more**: Tự động load thêm phim khi scroll đến cuối
- **Pull to refresh**: Kéo xuống để refresh danh sách
- **Loading states**: Hiển thị loading khi đang tải
- **Error handling**: Xử lý lỗi và cho phép retry
- **Grid layout**: Hiển thị phim theo lưới 2 cột
- **TypeScript**: Hoàn toàn TypeScript với type safety

### 🎯 Navigation từ HomeScreen:
- **Nút "Xem tất cả"**: Ở mỗi section có nút điều hướng đến category tương ứng
- **Routes đã setup**:
  - `NewMovies` → NewMoviesScreen
  - `SingleMovies` → SingleMoviesScreen  
  - `SeriesMovies` → SeriesMoviesScreen
  - `Anime` → AnimeScreen
  - `USUKMovies` → USUKMoviesScreen
  - `KoreanMovies` → KoreanMoviesScreen

## API Integration

### 📡 Service Layer:
Mỗi screen sử dụng service methods tương ứng:
- `movieService.getNewMovies(page)`
- `movieService.getSingleMovies(page)`
- `movieService.getSeriesMovies(page)`
- `movieService.getAnimeMovies(page)`
- `movieService.getUSUKMovies(page)`
- `movieService.getKoreanMovies(page)`

### 🔄 Pagination Logic:
```typescript
// Load page đầu tiên
loadMovies(1);

// Load more khi scroll đến cuối
if (!loadingMore && hasMore) {
  loadMovies(page + 1);
}

// Refresh - reset về page 1
setPage(1);
setHasMore(true);
loadMovies(1, true);
```

## Component Updates

### 🔧 MovieSection Component:
- **Thêm prop**: `onSeeAllPress?: () => void`
- **UI mới**: Header với title và nút "Xem tất cả →"
- **Navigation**: Điều hướng đến category screen tương ứng

### 🎨 Styling:
- **Responsive**: Grid layout 2 cột cho mobile
- **Consistent**: Giống style của HomeScreen
- **Professional**: Loading states và error handling đẹp

## Benefits của cấu trúc này

### ✅ Debugging:
- **Dễ trace lỗi**: Mỗi category có file riêng
- **Isolated logic**: Logic riêng biệt cho từng loại phim
- **Clear separation**: Tách biệt rõ ràng giữa các concerns

### ✅ Maintainability:
- **Modular**: Dễ maintain và extend
- **Reusable patterns**: Cùng pattern cho tất cả categories
- **TypeScript**: Type safety đầy đủ

### ✅ User Experience:
- **Performance**: Load more thay vì load hết
- **Responsive**: Pull to refresh và error retry
- **Intuitive**: Navigation flow tự nhiên

## Cách sử dụng

### 🚀 Từ HomeScreen:
1. User thấy preview các phim theo category
2. Nhấn "Xem tất cả" để vào category screen
3. Trong category screen có thể:
   - Scroll để xem thêm phim
   - Pull down để refresh
   - Nhấn phim để xem chi tiết

### 🔧 Để thêm category mới:
1. Tạo folder mới trong `src/screens/categories/`
2. Tạo screen component theo pattern có sẵn
3. Thêm service method trong `movieService`
4. Export trong `categories/index.ts`
5. Thêm route trong `AppNavigator.js`
6. Thêm section trong `HomeScreen.tsx`

## Error Troubleshooting

### 🐛 Nếu có lỗi API:
- Check service method có đúng endpoint không
- Verify network connection
- Check response format từ phimapi.com

### 🐛 Nếu có lỗi Navigation:
- Verify route name đã đúng chưa
- Check screen đã được import và register chưa
- Verify navigation params

### 🐛 Nếu có lỗi TypeScript:
- Check types/movie.ts có đúng interface không
- Verify component props interface
- Check import/export statements