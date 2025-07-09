# React Native Development Setup Guide

## Prerequisites

### 1. Install Node.js
- Download and install Node.js 18.x or later from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version` and `npm --version`

### 2. Install Java Development Kit (JDK)
- Install JDK 17 or later
- Set JAVA_HOME environment variable

### 3. Install Android Studio
1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Install Android Studio with the default settings
3. Open Android Studio and complete the setup wizard
4. Install the following in SDK Manager:
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.0
   - Android Emulator
   - Android SDK Platform-Tools

### 4. Set Environment Variables
Add the following to your system environment variables:

**Windows:**
```
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot (or your JDK path)
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 5. Create Android Virtual Device (AVD)
1. Open Android Studio
2. Go to Tools > AVD Manager
3. Create a new virtual device
4. Choose a device definition (e.g., Pixel 4)
5. Select a system image (API level 33 recommended)
6. Finish the setup

## Running the App

### 1. Install Dependencies
```bash
cd EcoterraApp
npm install
```

### 2. Start Metro Bundler
```bash
npx react-native start
```

### 3. Run on Android (new terminal)
```bash
npx react-native run-android
```

### 4. Run on iOS (macOS only)
```bash
npx react-native run-ios
```

## Troubleshooting

### Common Issues:

1. **SDK location not found**
   - Make sure ANDROID_HOME is set correctly
   - Check if `android/local.properties` exists with correct sdk.dir path

2. **Build failed with react-native-reanimated**
   - Make sure you're using version 3.5.4 compatible with RN 0.72.x
   - Run: `npm install react-native-reanimated@3.5.4`

3. **Metro cache issues**
   - Run: `npx react-native start --reset-cache`

4. **Android build issues**
   - Clean build: `cd android && ./gradlew clean`
   - Rebuild: `npx react-native run-android`

### Verify Setup
Run this command to check your environment:
```bash
npx react-native doctor
```

## Additional Tools

### Useful Commands:
```bash
# Reset everything
npx react-native start --reset-cache

# Clean builds
cd android && ./gradlew clean

# List available devices
adb devices

# Check React Native info
npx react-native info
```
