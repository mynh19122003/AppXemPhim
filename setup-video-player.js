#!/usr/bin/env node

/**
 * Video Player Setup Script
 * Tự động cài đặt và cấu hình video player cho ứng dụng
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎬 Setting up Video Player...\n');

// 1. Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install react-native-video react-native-orientation-locker', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// 2. Check Android configuration
console.log('🤖 Checking Android configuration...');
const androidManifestPath = './android/app/src/main/AndroidManifest.xml';

if (fs.existsSync(androidManifestPath)) {
  const manifestContent = fs.readFileSync(androidManifestPath, 'utf8');
  
  const requiredPermissions = [
    'android.permission.INTERNET',
    'android.permission.ACCESS_NETWORK_STATE',
    'android.permission.WAKE_LOCK'
  ];
  
  let needsUpdate = false;
  requiredPermissions.forEach(permission => {
    if (!manifestContent.includes(permission)) {
      console.log(`⚠️  Missing permission: ${permission}`);
      needsUpdate = true;
    }
  });
  
  if (needsUpdate) {
    console.log('⚠️  Please update AndroidManifest.xml with required permissions');
  } else {
    console.log('✅ AndroidManifest.xml has all required permissions');
  }
} else {
  console.log('⚠️  AndroidManifest.xml not found');
}

// 3. Check file structure
console.log('\n📁 Checking file structure...');
const requiredFiles = [
  './src/components/VideoPlayer.js',
  './src/components/ui/EpisodeSelector.js',
  './src/screens/WatchMovieScreen.js',
  './src/api/endpoints/movieDetail.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
  }
});

// 4. Create test file if not exists
const testFile = './testVideoPlayer.js';
if (!fs.existsSync(testFile)) {
  console.log('\n⚠️  Test file not found, please create testVideoPlayer.js');
}

// 5. Final instructions
console.log('\n🎉 Video Player setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run android (to build and run on device)');
console.log('2. Navigate to any movie detail page');
console.log('3. Tap "Phát phim" to test video player');
console.log('4. For debugging, navigate to VideoTestScreen');
console.log('\n📖 Check VIDEO_PLAYER_GUIDE.md for detailed documentation');

// 6. Check for common issues
console.log('\n🔍 Common troubleshooting:');
console.log('- If video doesn\'t play: Check network connectivity and video URL');
console.log('- If orientation doesn\'t work: Rebuild the app after installing dependencies');
console.log('- If build fails: Run `npm run clean` then `npm run android`');

console.log('\n✨ Happy coding! 🎬');
