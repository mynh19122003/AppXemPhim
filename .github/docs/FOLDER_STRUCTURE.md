# 📁 Cấu trúc thư mục đã được tổ chức

## 🎯 **Mục đích**
Tổ chức lại code thành các folder riêng biệt để:
- ✅ **Dễ debug**: Biết được lỗi xảy ra ở phần nào
- ✅ **Dễ maintain**: Code được tách biệt rõ ràng
- ✅ **Tuân thủ best practices**: Theo chuẩn React Native + TypeScript
- ✅ **Type-safe**: Sử dụng TypeScript cho toàn bộ code

## 📂 **Cấu trúc thư mục mới**

```
src/
├── 🎯 types/           # Định nghĩa kiểu dữ liệu
│   └── movie.ts        # Types cho Movie, API Response
│
├── 🌐 services/        # Layer xử lý API
│   └── api/
│       ├── config.ts   # Cấu hình endpoints, constants
│       ├── movieService.ts  # Service gọi API phim
│       └── index.ts    # Export tổng hợp
│
├── 🔧 utils/           # Các hàm tiện ích
│   ├── imageHelper.ts  # Xử lý URL ảnh
│   └── movieHelper.ts  # Xử lý dữ liệu phim
│
├── 🪝 hooks/           # Custom React Hooks
│   └── useMovies.ts    # Hook quản lý state phim
│
├── 🎨 components/      # UI Components tái sử dụng
│   ├── MovieCard.tsx   # Component thẻ phim
│   ├── MovieSection.tsx # Component section phim
│   ├── FeaturedMovie.tsx # Component phim nổi bật
│   └── index.ts        # Export tổng hợp
│
└── 📱 screens/         # Màn hình
    ├── HomeScreen.js   # File cũ (đã backup)
    ├── HomeScreen.new.tsx # File mới với cấu trúc tốt
    └── HomeScreen.backup.js # File backup
```

## 🚀 **Cách sử dụng cấu trúc mới**

### 1. **Types & Interfaces** (`src/types/`)
```typescript
// Sử dụng types đã định nghĩa
import { Movie, ApiResponse } from '../types/movie';

const movie: Movie = {
  _id: '123',
  name: 'Phim hay',
  // ... other properties
};
```

### 2. **API Services** (`src/services/api/`)
```typescript
// Gọi API thông qua service layer
import movieService from '../services/api/movieService';

// Lấy phim mới
const newMovies = await movieService.getNewMovies();

// Lấy phim lẻ  
const singleMovies = await movieService.getSingleMovies();

// Tìm kiếm phim
const searchResults = await movieService.searchMovies('Avengers');
```

### 3. **Utility Functions** (`src/utils/`)
```typescript
// Xử lý ảnh
import { getMovieImageUrl } from '../utils/imageHelper';
const imageUrl = getMovieImageUrl(movie);

// Xử lý thông tin phim
import { getMovieDisplayInfo } from '../utils/movieHelper';
const displayInfo = getMovieDisplayInfo(movie, true);
```

### 4. **Custom Hooks** (`src/hooks/`)
```typescript
// Sử dụng hook trong component
import { useMovies } from '../hooks/useMovies';

const MyComponent = () => {
  const { newMovies, loading, onRefresh } = useMovies();
  // ... component logic
};
```

### 5. **Components** (`src/components/`)
```typescript
// Import components
import { MovieCard, MovieSection } from '../components';

// Sử dụng trong render
<MovieSection
  title="Phim mới"
  movies={movies}
  onMoviePress={handlePress}
/>
```

## 🐛 **Debug dễ dàng**

### **Khi có lỗi, bạn sẽ biết ngay:**

- 🌐 **API Error**: Kiểm tra `src/services/api/movieService.ts`
- 🎨 **UI Error**: Kiểm tra `src/components/`
- 🔧 **Logic Error**: Kiểm tra `src/utils/` hoặc `src/hooks/`
- 📱 **Screen Error**: Kiểm tra `src/screens/`
- 🎯 **Type Error**: Kiểm tra `src/types/`

### **Console logs có prefix rõ ràng:**
```
🌐 Đang gọi API: https://phimapi.com/...
✅ API response thành công
📽️ Lấy được 20 phim mới
❌ Lỗi khi lấy phim bộ: Network error
```

## 📋 **Checklist migration**

### ✅ **Đã hoàn thành:**
- ✅ Tạo cấu trúc folder mới
- ✅ Định nghĩa types cho Movie, API Response
- ✅ Tạo movieService với đầy đủ endpoints
- ✅ Tạo utility functions cho image, movie data
- ✅ Tạo custom hook useMovies
- ✅ Tạo components MovieCard, MovieSection, FeaturedMovie
- ✅ Tạo HomeScreen.new.tsx với cấu trúc mới
- ✅ Backup file cũ

### 🔄 **Cần làm tiếp:**
- 🔄 Test HomeScreen.new.tsx
- 🔄 Update navigation để sử dụng file mới
- 🔄 Migrate các screens khác
- 🔄 Add unit tests

## 🎯 **Lợi ích đạt được**

1. **Code dễ đọc hơn**: Mỗi file có một nhiệm vụ cụ thể
2. **Debug nhanh hơn**: Console log rõ ràng, biết lỗi ở đâu
3. **Maintain dễ hơn**: Thay đổi logic chỉ cần sửa một chỗ
4. **Type-safe**: TypeScript catch lỗi ngay khi code
5. **Reusable**: Components có thể dùng lại nhiều nơi
6. **Performance**: API calls được optimize, state management tốt hơn

## 🔧 **Commands để test**

```bash
# Test compilation
npx tsc --noEmit

# Test app with new structure  
npx react-native run-android

# Check for errors
npx react-native log-android
```
