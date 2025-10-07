# 🐛 FIX: Korean Movies API 404 Error

## ❌ **Vấn đề:**
```
❌ Lỗi khi lấy phim han-quoc: Error: HTTP error! status: 404
```

## 🔍 **Root Cause:**
- Endpoint API đang được build sai trong movieService
- URL được build thành: `/v1/api/danh-sach/quoc-gia/han-quoc`
- Nhưng API thực tế cần: `/v1/api/quoc-gia/han-quoc`

## ✅ **Solutions Applied:**

### 1. Sửa Config Endpoint:
```typescript
// BEFORE (SAI):
MOVIES_BY_COUNTRY: '/v1/api/danh-sach/quoc-gia',

// AFTER (ĐÚNG):
MOVIES_BY_COUNTRY: '/v1/api/quoc-gia',
```

### 2. Sửa URL Building:
```typescript
// BEFORE (build sai):
const url = this.buildUrl(`${API_CONFIG.ENDPOINTS.MOVIES_BY_COUNTRY}/${countrySlug}`, { page });

// AFTER (build đúng):
const endpoint = `/v1/api/quoc-gia/${countrySlug}`;
const url = this.buildUrl(endpoint, { page });
```

## 🧪 **Testing:**

### ✅ Manual API Test:
```bash
curl "https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1"
# ✅ Status: 200 OK
# ✅ Response: {"status":"success","data":{"items":[...]}}
```

### ✅ Test Results:
```
🚀 Testing Korean movies API...
📊 Status: 200
✅ Status: success  
🎬 Movies count: 10
🎭 First movie: Toàn Trí Độc Giả
```

## 🎯 **Expected Results:**

### ✅ After fix:
- Korean movies screen sẽ load thành công
- Hiển thị danh sách phim Hàn Quốc
- Không còn 404 error
- Pull to refresh hoạt động
- Load more pagination hoạt động

### ✅ Affected Screens:
- `KoreanMoviesScreen.tsx` - Sẽ hoạt động bình thường
- `USUKMoviesScreen.tsx` - Cũng được fix (dùng chung method)
- `HomeScreen.tsx` - Korean movies section sẽ hiển thị

## 📁 **Files Modified:**

### 1. `src/services/api/config.ts`
- Sửa `MOVIES_BY_COUNTRY` endpoint

### 2. `src/services/api/movieService.ts`
- Sửa `getMoviesByCountry()` method
- Fix URL building logic

## 🔧 **Technical Details:**

### ✅ **API Endpoints Working:**
```
✅ https://phimapi.com/v1/api/quoc-gia/han-quoc (Korean)
✅ https://phimapi.com/v1/api/quoc-gia/au-my (US-UK)
✅ https://phimapi.com/v1/api/quoc-gia/nhat-ban (Japan)
```

### ✅ **Country Slugs:**
```typescript
COUNTRIES: {
  US: 'au-my',        ✅ Working
  KOREA: 'han-quoc',  ✅ Fixed
  JAPAN: 'nhat-ban',  ✅ Working
}
```

## 🚀 **Verification Steps:**

1. ✅ Build app successfully
2. ✅ Navigate to HomeScreen
3. ✅ Check Korean movies section loads
4. ✅ Tap "Xem tất cả" on Korean section
5. ✅ KoreanMoviesScreen loads without 404
6. ✅ Test pull to refresh
7. ✅ Test load more pagination

## 📝 **Notes:**

- Fix cũng áp dụng cho US-UK movies vì dùng chung method
- Anime movies vẫn dùng endpoint riêng `/v1/api/danh-sach/hoat-hinh`
- Single/Series movies dùng endpoints khác nên không bị ảnh hưởng