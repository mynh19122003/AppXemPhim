# 📁 Folder Structure Documentation

## 🎯 Organized Architecture for Easy Debugging

### 📂 `/src/api/` - API Layer
```
src/api/
├── config.js           # API configuration & endpoints
├── client.js           # HTTP client với error handling
├── index.js            # Main exports
├── endpoints/          # API endpoint services
│   ├── latestMovies.js   # 🔥 Phim mới nhất
│   ├── singleMovies.js   # 🎬 Phim lẻ  
│   ├── seriesMovies.js   # 📺 Phim bộ
│   └── animationMovies.js # 🎌 Hoạt hình
└── categories/         # Category filters
    ├── anime.js          # Anime filters
    ├── usUk.js          # US-UK filters  
    └── korean.js        # Korean filters
```

### 📂 `/src/hooks/` - React Hooks
```
src/hooks/
└── useMovieCategories.js # Custom hook cho movie data
```

### 📂 `/src/components/ui/` - UI Components
```
src/components/ui/
├── MovieCard.js       # Movie card component
└── MovieSection.js    # Movie section component
```

### 📂 `/src/helpers/` - Utility Functions
```
src/helpers/
└── movieHelpers.js    # Movie utility functions
```

### 📂 `/src/utils/` - Utilities (existing)
```
src/utils/
├── imageUtils.js      # Image optimization
└── imageLogger.js     # Performance logging
```

## 🔍 Debugging Strategy

### 🔥 **API Issues**
1. Check `src/api/client.js` - HTTP errors, timeouts
2. Check specific endpoint in `src/api/endpoints/` 
3. Check `src/api/config.js` - Base URLs, endpoints

### 🎬 **Category Issues**  
1. Check `src/api/categories/` - Filter logic
2. Check `src/hooks/useMovieCategories.js` - Data loading
3. Check console logs với request IDs

### 🖼️ **UI Issues**
1. Check `src/components/ui/MovieCard.js` - Card layout
2. Check `src/components/ui/MovieSection.js` - Section layout
3. Check `src/screens/HomeScreen.js` - Main layout

### 📱 **Data Issues**
1. Check `src/helpers/movieHelpers.js` - Data processing
2. Check `src/hooks/useMovieCategories.js` - State management
3. Check network tab in debugger

## 🔧 **Debug Tools**

### **Console Logging**
- `🌐 [requestId]` - API request
- `📡 [requestId]` - API response  
- `✅ [requestId]` - Success
- `💥 [requestId]` - Error
- `🔥/🎬/📺/🎌/🇺🇸/🇰🇷` - Category specific

### **Error Handling**
- HTTP client với timeout & retry
- Fallback mechanisms  
- Detailed error messages
- Request ID tracking

### **Performance Monitoring**
- Image optimization logs
- API response times
- Data filtering metrics

## 🚀 **Benefits**

### ✅ **Maintainability**
- Single responsibility principle
- Clear separation of concerns
- Easy to add new categories
- Modular architecture

### ✅ **Debugging**
- Isolated error sources
- Clear logging strategy
- Request ID tracking
- Component-specific issues

### ✅ **Scalability**  
- Easy to add new endpoints
- Reusable components
- Custom hooks for logic
- Centralized configuration

### ✅ **Developer Experience**
- IntelliSense support
- Clear import paths
- Documented functions
- Error boundaries

## 📋 **Usage Examples**

### Import API Service
```javascript
import { latestMoviesService } from '../api/endpoints/latestMovies';
```

### Import Category Filter
```javascript
import AnimeCategory from '../api/categories/anime';
```

### Use Custom Hook
```javascript
import { useMovieCategories } from '../hooks/useMovieCategories';
```

### Use UI Component
```javascript
import MovieSection from '../components/ui/MovieSection';
```

This structure makes debugging much easier - you know exactly where to look for specific issues! 🎯