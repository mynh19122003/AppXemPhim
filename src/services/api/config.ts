// services/api/config.ts - Cấu hình API endpoints theo tài liệu chính thức

export const API_CONFIG = {
  BASE_URL: 'https://phimapi.com',
  IMAGE_PROXY: 'https://phimapi.com/image.php',
  ENDPOINTS: {
    // Phim mới cập nhật - theo tài liệu
    NEW_MOVIES: '/danh-sach/phim-moi-cap-nhat',
    // Sử dụng API v1 tổng hợp theo tài liệu
    SINGLE_MOVIES: '/v1/api/danh-sach/phim-le',
    SERIES_MOVIES: '/v1/api/danh-sach/phim-bo', 
    ANIME_MOVIES: '/v1/api/danh-sach/hoat-hinh',
    // Phim theo quốc gia - sử dụng endpoint v1
    MOVIES_BY_COUNTRY: '/v1/api/quoc-gia',
    // Chi tiết phim
    MOVIE_DETAIL: '/phim',
    // Tìm kiếm phim
    SEARCH: '/v1/api/tim-kiem',
  },
  COUNTRIES: {
    US: 'au-my',
    UK: 'anh',
    KOREA: 'han-quoc',
    JAPAN: 'nhat-ban',
    CHINA: 'trung-quoc',
    THAILAND: 'thai-lan',
  },
  CATEGORIES: {
    ACTION: 'hanh-dong',
    COMEDY: 'hai-huoc',
    DRAMA: 'chinh-kich',
    HORROR: 'kinh-di',
    ROMANCE: 'tinh-cam',
    SCIFI: 'khoa-hoc-vien-tuong',
  }
};

export const DEFAULT_PARAMS = {
  page: 1,
  limit: 20,
};