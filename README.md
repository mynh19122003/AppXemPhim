# 🎬 AppXemPhim - React Native Movie App

Ứng dụng xem phim di động được xây dựng bằng React Native và TypeScript, tích hợp API từ phimapi.com.

> 📚 **[📖 Xem tài liệu đầy đủ](.github/README.md)** | 🏗️ **[Cấu trúc dự án](.github/docs/FOLDER_STRUCTURE.md)** | ⚙️ **[Development Guidelines](.github/copilot-instructions.md)**

## 📱 Tính năng chính

- ✅ **Xem danh sách phim** theo danh mục (mới nhất, phim lẻ, phim bộ, anime, US-UK, Hàn Quốc)
- ✅ **Chi tiết phim** với thông tin đầy đủ
- ✅ **Tìm kiếm phim** theo tên
- ✅ **UI/UX đẹp** với gradient và animations
- ✅ **Tối ưu hình ảnh** với WEBP conversion
- ✅ **TypeScript** cho type safety

## 🏗️ Kiến trúc dự án

### 📂 Cấu trúc thư mục
```
src/
├── 🎯 types/           # TypeScript type definitions
├── 🌐 services/        # API services layer  
├── 🔧 utils/           # Utility functions
├── 🪝 hooks/           # Custom React Hooks
├── 🎨 components/      # Reusable UI components
├── � screens/         # App screens
├── 🧭 navigation/      # Navigation setup
├── 🎨 constants/       # App constants (colors, etc.)
└── 📦 assets/          # Static assets
```

### 🎯 Phân tách trách nhiệm
- **Services**: Xử lý API calls và data fetching
- **Components**: UI components tái sử dụng
- **Hooks**: Business logic và state management  
- **Utils**: Helper functions cho image, data processing
- **Types**: TypeScript interfaces và types
- 🎥 Chi tiết phim với mô tả đầy đủ
- 👤 Trang cá nhân người dùng

## Cài đặt

### Yêu cầu

- Node.js >= 18
- React Native CLI
- Android Studio (cho Android)
- JDK 17

## Chạy ứng dụng

### Android

1. Khởi động Metro Bundler:

```sh
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
