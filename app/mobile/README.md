# ItoMcovertor - Mobile App

Cross-platform mobile application built with [Capacitor](https://capacitorjs.com/) for iOS and Android.

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- **For Android**: [Android Studio](https://developer.android.com/studio) with SDK 24+
- **For iOS**: [Xcode](https://developer.apple.com/xcode/) 14+ (macOS only)

## Setup

```bash
# Install dependencies
npm install

# Add Android platform
npx cap add android

# Add iOS platform (macOS only)
npx cap add ios

# Sync web files to native projects
npm run sync
```

## Development

```bash
# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Open in Android Studio
npm run open:android

# Open in Xcode
npm run open:ios
```

## Project Structure

```
mobile/
├── package.json            # Node.js config
├── capacitor.config.ts     # Capacitor configuration
├── www/                    # Web source files
│   ├── index.html          # Main HTML
│   ├── css/
│   │   └── styles.css      # Mobile-optimized styles
│   └── js/
│       ├── app.js          # App logic with native plugins
│       └── converter.js    # Conversion engine
├── android/                # Android Studio project (after cap add)
└── ios/                    # Xcode project (after cap add)
```

## Features

- 120+ unit conversions across 12 categories
- Light/Dark theme with system preference detection
- Touch-optimized UI with 44px minimum tap targets
- Haptic feedback on interactions
- Safe area support for notched devices
- Conversion history (persisted locally)

## Native Plugins

This app uses the following Capacitor plugins:

- **StatusBar**: Customizes status bar appearance
- **Keyboard**: Handles keyboard resize behavior
- **Haptics**: Provides tactile feedback

## Building for Production

### Android APK

```bash
npm run sync
npm run open:android
# In Android Studio: Build > Generate Signed Bundle/APK
```

### iOS IPA

```bash
npm run sync
npm run open:ios
# In Xcode: Product > Archive
```

## Testing on Device

### Android

1. Enable USB debugging on your device
2. Connect via USB
3. Run `npm run android`

### iOS

1. Connect your iOS device
2. Open Xcode with `npm run open:ios`
3. Select your device and click Run
