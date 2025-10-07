# Cập nhật Chức năng Anime 🎌

## Tổng quan
Đã cập nhật MovieService với chức năng lấy anime chuyên biệt theo yêu cầu:
- **Anime = Hoạt hình từ Nhật Bản**
- Sử dụng API phimapi.com v1 với filter country=nhat-ban và category=hoat-hinh

## Các method mới được thêm

### 1. `getJapaneseAnime(page, options)`
```typescript
// Lấy anime Nhật Bản với options tùy chỉnh
const anime = await movieService.getJapaneseAnime(1, {
  sort_lang: 'vietsub',
  year: 2024
});
```

**Features:**
- ✅ Dual strategy: Thử hoạt hình Nhật trước, sau đó fallback sang phim Nhật + filter hoạt hình
- ✅ Support options: sort_lang, year
- ✅ Logging chi tiết để debug
- ✅ Xử lý lỗi robust

### 2. `getMoviesWithFilters(options)`
```typescript
// Method tổng quát để lấy phim với filter tùy chỉnh
const movies = await movieService.getMoviesWithFilters({
  type: 'hoat-hinh',
  country: 'nhat-ban', 
  category: 'action',
  sort_lang: 'vietsub',
  year: 2023,
  page: 1,
  limit: 20
});
```

**Supported options:**
- `type`: 'phim-bo' | 'phim-le' | 'tv-shows' | 'hoat-hinh' | 'phim-vietsub' | 'phim-thuyet-minh' | 'phim-long-tieng'
- `page`: số trang
- `sort_field`: 'modified.time' | '_id' | 'year'
- `sort_type`: 'desc' | 'asc'
- `sort_lang`: 'vietsub' | 'thuyet-minh' | 'long-tieng'
- `category`: string (thể loại)
- `country`: string (quốc gia)
- `year`: number (năm)
- `limit`: number (số lượng)

### 3. `getAnimeMovies(page)` - Đã cập nhật
```typescript
// Method đơn giản để lấy anime (sử dụng getJapaneseAnime)
const anime = await movieService.getAnimeMovies(1);
```

## API Endpoints được sử dụng

### Strategy 1 (Primary):
```
GET /v1/api/danh-sach/hoat-hinh?country=nhat-ban&page={page}&sort_field=modified.time&sort_type=desc&limit=20
```

### Strategy 2 (Fallback):
```
GET /v1/api/quoc-gia/nhat-ban?category=hoat-hinh&page={page}&sort_field=modified.time&sort_type=desc&limit=20
```

## Cách sử dụng trong Component

```typescript
import movieService from '../services/api/movieService';

// Trong component
const [animeMovies, setAnimeMovies] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadAnime = async () => {
    try {
      const result = await movieService.getAnimeMovies(1);
      if (result?.data?.items) {
        setAnimeMovies(result.data.items);
      }
    } catch (error) {
      console.error('Lỗi load anime:', error);
    } finally {
      setLoading(false);
    }
  };

  loadAnime();
}, []);
```

## Files đã cập nhật

1. **src/services/api/movieService.ts**
   - ✅ Thêm method `getJapaneseAnime()`
   - ✅ Thêm method `getMoviesWithFilters()`
   - ✅ Cập nhật method `getAnimeMovies()`

2. **src/test/animeService.test.ts** (Mới)
   - ✅ Test functions cho các anime methods

3. **src/demo/animeUsage.ts** (Mới)
   - ✅ Demo các cách sử dụng anime API

## Lưu ý quan trọng

- ❌ **KHÔNG sử dụng** PhimAPIService cho anime nữa
- ✅ **SỬ DỤNG** MovieService.getAnimeMovies() hoặc getJapaneseAnime()
- 🎯 Anime = **Hoạt hình từ Nhật Bản** (theo yêu cầu cụ thể)
- 🔄 Có fallback strategy nếu endpoint chính không trả về dữ liệu
- 📝 Logging chi tiết để debug

## Testing

```bash
# Kiểm tra TypeScript
npx tsc --noEmit

# Build project
npm run build

# Run development
npm start
```

## Kết quả
- ✅ Tất cả TypeScript errors đã được fix
- ✅ Anime filtering theo đúng yêu cầu (Nhật Bản + Hoạt hình)
- ✅ Method chuyên biệt với options tùy chỉnh
- ✅ Fallback strategy cho reliability
- ✅ Code clean và có documentation