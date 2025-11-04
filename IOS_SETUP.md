# 📱 iOS App Setup Guide - Dagger One Expense Tracker

## ✅ iOS Platform Added Successfully!

Your React + Capacitor expense tracker app is now configured for iOS!

**Status**: iOS project created at `ios/App/`

**Note**: CocoaPods installation will be required when you first open the project in Xcode. Xcode will prompt you to install pods automatically, or you can run:
```bash
cd ios/App
pod install
```

---

## 📋 Prerequisites

Before building the iOS app, ensure you have:

1. **macOS** - iOS development requires a Mac
2. **Xcode** - Install from Mac App Store (latest version recommended)
3. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
4. **CocoaPods** (if not already installed):
   ```bash
   sudo gem install cocoapods
   ```

---

## 🚀 Quick Start

### 1. Install Dependencies (if needed)
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync to iOS
```bash
npx cap sync ios
```

### 4. Open in Xcode
```bash
npx cap open ios
```

---

## 🔧 iOS Configuration

### App Information
- **Bundle ID**: `com.daggerone.expensetracker`
- **App Name**: `Dagger One`
- **Minimum iOS Version**: 13.0+

### Permissions Required
The app requires the following permissions (already configured):
- **Camera** - For capturing expense photos
- **Photo Library** - For selecting photos from gallery
- **Filesystem** - For storing data locally

---

## 📱 Building for iOS

### Development Build (Simulator)

1. Open Xcode:
   ```bash
   npx cap open ios
   ```

2. In Xcode:
   - Select a simulator (e.g., iPhone 14 Pro)
   - Click the Play button or press `Cmd + R`
   - Wait for the app to build and launch

### Production Build (Device)

1. **Open Xcode**:
   ```bash
   npx cap open ios
   ```

2. **Configure Signing**:
   - Select the "App" target in the left sidebar
   - Go to "Signing & Capabilities"
   - Select your Development Team
   - Xcode will automatically manage provisioning

3. **Connect iOS Device**:
   - Connect your iPhone/iPad via USB
   - Trust the computer on your device
   - Select your device in Xcode's device selector

4. **Build & Run**:
   - Click the Play button or press `Cmd + R`
   - The app will install on your device

### App Store Build (IPA)

1. **Archive the App**:
   - In Xcode: Product → Archive
   - Wait for the archive to complete

2. **Distribute**:
   - Click "Distribute App"
   - Choose distribution method:
     - **App Store Connect** - For App Store submission
     - **Ad Hoc** - For testing on specific devices
     - **Development** - For internal testing
     - **Enterprise** - For enterprise distribution

---

## 🎨 iOS-Specific Features

### App Icon
- Location: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Replace the placeholder icons with your app icon
- Required sizes: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt (all @2x and @3x)

### Splash Screen
- Configured in `capacitor.config.json`
- Background color: `#F5DD61` (yellow)
- Duration: 2 seconds
- Auto-hide: Enabled

### Status Bar
- Style: Dark
- Background: `#F5DD61`

---

## 📂 iOS Project Structure

```
ios/
├── App/
│   ├── App/
│   │   ├── Assets.xcassets/    # App icons and images
│   │   ├── Info.plist           # App configuration
│   │   └── ViewController.swift # Main view controller
│   └── App.xcodeproj/           # Xcode project file
├── Podfile                      # CocoaPods dependencies
└── Pods/                        # Installed pods (generated)
```

---

## 🔄 Updating the App

Whenever you make changes to your React code:

1. **Build web assets**:
   ```bash
   npm run build
   ```

2. **Sync to iOS**:
   ```bash
   npx cap sync ios
   ```

3. **In Xcode**, rebuild and run

---

## 🐛 Troubleshooting

### "No such module 'Capacitor'"
```bash
cd ios/App
pod install
```

### Build Errors
- Clean build folder: `Cmd + Shift + K`
- Clean derived data: `Cmd + Shift + Option + K`
- Restart Xcode

### Pod Installation Issues
```bash
cd ios/App
pod deintegrate
pod install
```

### Signing Issues
- Ensure you have a valid Apple Developer account
- Check Signing & Capabilities in Xcode
- Verify Bundle ID matches your developer account

---

## 📝 Notes

- The iOS app uses the same codebase as Android
- All features (expenses, incomes, investments, accounts, etc.) work on iOS
- Photo attachments work with iOS camera and photo library
- Data is stored locally using Capacitor Filesystem
- App works offline (PWA capabilities)

---

## ✅ Next Steps

1. ✅ iOS platform added
2. ✅ Dependencies installed
3. ✅ Project synced
4. ⏳ Open in Xcode and configure signing
5. ⏳ Build and test on simulator/device
6. ⏳ Submit to App Store (if desired)

---

**Ready to build!** Open Xcode and start developing:
```bash
npx cap open ios
```
