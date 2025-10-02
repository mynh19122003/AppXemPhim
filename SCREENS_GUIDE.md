# Chi tiết các màn hình - App MovieFlix

## 📱 1. Màn hình chào mừng (WelcomeScreen)

**File:** `src/screens/WelcomeScreen.js`

### Tính năng:

- Hiển thị logo ứng dụng (🎬)
- Tên ứng dụng: MOVIEFLIX
- Slogan: "Xem phim không giới hạn"
- Nút "Đăng nhập" với gradient đỏ
- Nút "Đăng ký" với viền trắng

### Gradient sử dụng:

- Background: Đen gradient (#000000 -> #1A1A1A)
- Button: Đỏ gradient (#E50914 -> #B20710)

### Navigation:

- Đăng nhập → LoginScreen
- Đăng ký → RegisterScreen

---

## 🔐 2. Màn hình đăng nhập (LoginScreen)

**File:** `src/screens/LoginScreen.js`

### Tính năng:

- Form đăng nhập với email và mật khẩu
- Link "Quên mật khẩu?"
- Nút "Đăng nhập" với gradient
- Link chuyển sang màn hình đăng ký
- Keyboard avoiding view cho UX tốt hơn

### Input fields:

- Email (email-address keyboard type)
- Password (secure text entry)

### Navigation:

- Đăng nhập thành công → HomeScreen
- Chưa có tài khoản → RegisterScreen

---

## 📝 3. Màn hình đăng ký (RegisterScreen)

**File:** `src/screens/RegisterScreen.js`

### Tính năng:

- Form đăng ký với các trường:
  - Họ và tên
  - Email
  - Số điện thoại
  - Mật khẩu
  - Xác nhận mật khẩu
- Nút "Đăng ký" với gradient
- Link chuyển sang màn hình đăng nhập
- Scroll view cho form dài

### Validation:

- Email format
- Phone number format
- Password match
- Required fields

### Navigation:

- Đăng ký thành công → OTPScreen (với phone number)
- Đã có tài khoản → LoginScreen

---

## 🔢 4. Màn hình OTP (OTPScreen)

**File:** `src/screens/OTPScreen.js`

### Tính năng:

- 6 ô nhập OTP
- Tự động focus ô tiếp theo khi nhập
- Hiển thị số điện thoại đã đăng ký
- Link "Gửi lại" OTP
- Nút "Xác nhận"
- Nút "Quay lại"

### UX Features:

- Auto focus next input
- Backspace để quay lại ô trước
- Number pad keyboard
- Visual feedback khi nhập

### Navigation:

- Xác thực thành công → HomeScreen
- Quay lại → RegisterScreen

---

## 🏠 5. Trang chủ (HomeScreen)

**File:** `src/screens/HomeScreen.js`

### Tính năng:

- Header với logo và icon profile
- Featured movie banner lớn
  - Hiển thị title, genre
  - Nút "Xem ngay"
  - Gradient overlay
- Danh sách phim theo thể loại:
  - Phim đề xuất
  - Phim hành động
  - Phim khoa học viễn tưởng
- Scroll ngang cho từng danh mục
- Movie cards với rating

### Components:

- Featured banner (500px height)
- Movie cards (140x210px)
- Genre tags
- Rating badges

### Navigation:

- Click movie card → MovieDetailScreen
- Click profile icon → ProfileScreen
- Click "Xem ngay" → MovieDetailScreen

### Data:

- Sử dụng `moviesData` từ `constants/movies.js`
- Filter theo genre

---

## 🎥 6. Màn hình chi tiết phim (MovieDetailScreen)

**File:** `src/screens/MovieDetailScreen.js`

### Tính năng:

- Banner phim full width (300px height)
- Nút back về trang chủ
- Thông tin phim:
  - Title
  - Rating (⭐)
  - Year
  - Duration
  - Genres (chips)
- Nút "Phát phim" với gradient
- Action buttons:
  - Thêm vào danh sách (➕)
  - Thích (👍)
  - Chia sẻ (📤)
- Mô tả phim chi tiết
- Danh sách phim tương tự (scroll ngang)

### Layout:

- Scroll view cho nội dung dài
- Gradient overlay trên banner
- Card style cho similar movies

### Navigation:

- Back button → Quay lại
- Similar movie → MovieDetailScreen khác

### Props:

- Nhận `movie` object từ navigation params

---

## 👤 7. Trang cá nhân (ProfileScreen)

**File:** `src/screens/ProfileScreen.js`

### Tính năng:

- Header với nút back và title
- Avatar với gradient
- Thông tin user:
  - Tên: Nguyễn Văn A
  - Email: nguyenvana@email.com
- Nút "Chỉnh sửa hồ sơ"
- Stats cards:
  - Đã xem: 42
  - Yêu thích: 18
  - Danh sách: 5
- Menu options:
  - Phim đã xem (🎬)
  - Yêu thích (❤️)
  - Danh sách của tôi (📋)
  - Tải xuống (⏬)
  - Cài đặt (⚙️)
  - Gói thành viên (💳)
  - Trợ giúp (❓)
  - Giới thiệu (ℹ️)
- Nút "Đăng xuất"
- Footer với version

### Components:

- Avatar với gradient circular
- Stats horizontal cards
- Options list với icons và arrows
- Logout button với border đỏ

### Navigation:

- Back button → HomeScreen
- Đăng xuất → WelcomeScreen

---

## 🎨 Design System

### Colors (constants/colors.js):

```javascript
primary: '#E50914'; // Netflix red
secondary: '#B20710'; // Dark red
background: '#141414'; // Dark gray
darkBackground: '#000000'; // Black
cardBackground: '#1F1F1F'; // Card gray
text: '#FFFFFF'; // White
textSecondary: '#B3B3B3'; // Gray
```

### Gradients:

```javascript
gradientStart: ['#000000', '#1A1A1A'];
gradientPrimary: ['#E50914', '#B20710'];
gradientOverlay: ['transparent', 'rgba(0,0,0,0.9)'];
```

### Typography:

- Header: 32px, bold
- Title: 24-28px, bold
- Body: 16px, regular
- Caption: 12-14px, regular

### Spacing:

- Padding: 20px standard
- Margin between sections: 20-30px
- Card radius: 8px
- Button radius: 8px

---

## 🔄 Navigation Flow

```
WelcomeScreen
├── → LoginScreen → HomeScreen
│                     ├── → MovieDetailScreen
│                     └── → ProfileScreen
│                           └── → WelcomeScreen (logout)
└── → RegisterScreen → OTPScreen → HomeScreen
```

---

## 📦 Components (constants/movies.js)

### Movie Object Structure:

```javascript
{
  id: number,
  title: string,
  description: string,
  genre: array,
  rating: number,
  year: number,
  duration: string,
  thumbnail: string,
  banner: string
}
```

### Sample Movies:

- The Dark Knight (Action, Crime, Drama)
- Inception (Action, Sci-Fi, Thriller)
- Interstellar (Adventure, Drama, Sci-Fi)
- The Matrix (Action, Sci-Fi)
- Pulp Fiction (Crime, Drama)

---

## 🚀 Performance Tips

1. **Images**: Sử dụng placeholder khi load
2. **Lists**: FlatList cho danh sách dài
3. **Navigation**: Stack navigation cho smooth transitions
4. **Gradients**: react-native-linear-gradient (native)
5. **Gestures**: react-native-gesture-handler

---

## 📱 Responsive Design

- Sử dụng `Dimensions.get('window')` cho kích thước động
- Flex layout cho adaptive UI
- ScrollView cho nội dung dài
- Safe area insets cho notch/status bar

---

## 🎯 Future Enhancements

- [ ] Video player integration
- [ ] Search functionality
- [ ] Filter by genre
- [ ] User authentication API
- [ ] Favorites persistence
- [ ] Download functionality
- [ ] Push notifications
- [ ] Social sharing
- [ ] Comments và ratings
- [ ] Watchlist management
