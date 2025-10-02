# Hướng dẫn Build và Chạy App MovieFlix

## 🚀 Bước 1: Chuẩn bị môi trường

### Yêu cầu hệ thống:

- Node.js >= 18
- JDK 17
- Android Studio
- Android SDK (API Level 33 trở lên)

### Kiểm tra cài đặt:

```bash
node --version
java -version
```

## 📱 Bước 2: Cài đặt dependencies

Đã được cài đặt sẵn. Nếu cần cài lại:

```bash
cd AppXemPhim
npm install
```

## 🏃 Bước 3: Chạy ứng dụng trên Android

### Phương pháp 1: Sử dụng npm script (Khuyên dùng)

1. Khởi động Metro Bundler trong một terminal:

```bash
npm start
```

2. Mở terminal mới và chạy:

```bash
npm run android
```

### Phương pháp 2: Chạy trực tiếp

```bash
npx react-native run-android
```

## 🔧 Troubleshooting

### Lỗi "SDK location not found"

Tạo file `android/local.properties` với nội dung:

```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Lỗi Metro Bundler

```bash
npx react-native start --reset-cache
```

### Lỗi build Android

```bash
cd android
gradlew clean
cd ..
npm run android
```

### Lỗi "Unable to load script"

1. Đảm bảo Metro Bundler đang chạy
2. Thử reload app: Nhấn R hai lần trên Android

## 📦 Build APK Production

### Debug APK:

```bash
cd android
.\gradlew assembleDebug
```

File APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK:

1. Tạo keystore:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Build:

```bash
cd android
.\gradlew assembleRelease
```

File APK: `android/app/build/outputs/apk/release/app-release.apk`

## 🎨 Tính năng đã hoàn thành

✅ Màn hình chào mừng (Welcome Screen)
✅ Màn hình đăng nhập (Login Screen)
✅ Màn hình đăng ký (Register Screen)
✅ Màn hình OTP (OTP Screen)
✅ Trang chủ với danh sách phim (Home Screen)
✅ Màn hình chi tiết phim (Movie Detail Screen)
✅ Trang cá nhân (Profile Screen)
✅ Navigation giữa các màn hình
✅ Gradient UI giống Netflix
✅ Responsive design

## 📂 Cấu trúc Project

```
AppXemPhim/
├── src/
│   ├── components/        # Components tái sử dụng
│   │   └── MovieCard.js
│   ├── constants/         # Hằng số, dữ liệu
│   │   ├── colors.js
│   │   └── movies.js
│   ├── navigation/        # Cấu hình navigation
│   │   └── AppNavigator.js
│   └── screens/           # Các màn hình
│       ├── WelcomeScreen.js
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── OTPScreen.js
│       ├── HomeScreen.js
│       ├── MovieDetailScreen.js
│       └── ProfileScreen.js
├── android/               # Native Android code
├── App.tsx                # Root component
└── index.js               # Entry point
```

## 🎨 Theme Colors

- Primary Red: #E50914
- Dark Background: #000000
- Card Background: #1F1F1F
- Text White: #FFFFFF
- Text Gray: #B3B3B3

## 📱 Tương thích

- Android: API Level 23+ (Android 6.0+)
- Màn hình: Hỗ trợ mọi kích thước

## 🔄 Workflow đề xuất

1. **Phát triển**: Sử dụng `npm start` và `npm run android`
2. **Kiểm tra lỗi**: `npm run lint`
3. **Build test**: `cd android && .\gradlew assembleDebug`
4. **Build production**: `cd android && .\gradlew assembleRelease`

## 💡 Tips

- Sử dụng Hot Reload: Nhấn R R trên Android
- Debug menu: Shake thiết bị hoặc Ctrl+M
- Inspect element: Nhấn I trong debug menu
- Performance monitor: Nhấn P trong debug menu

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. Metro Bundler có đang chạy không
2. Android emulator/device có kết nối không
3. Port 8081 có bị chiếm dụng không

## 🎉 Hoàn thành!

App của bạn đã sẵn sàng. Hãy chạy và trải nghiệm! 🎬
