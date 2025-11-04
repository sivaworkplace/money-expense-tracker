# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **For Android Development:**
   - Android Studio: https://developer.android.com/studio
   - Java Development Kit (JDK) 11 or higher
   - Android SDK (API 21 or higher)

4. **For iOS Development (macOS only):**
   - Xcode: https://developer.apple.com/xcode/
   - Xcode Command Line Tools
   - CocoaPods: `sudo gem install cocoapods`

## Initial Setup

### 1. Install Dependencies

Navigate to the project directory and install npm packages:

```bash
cd /Users/siva-6452/money-expense-tracker
npm install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- Vite
- Capacitor
- Tailwind CSS
- And all other dependencies

### 2. Development Mode (Web)

To run the app in development mode on web:

```bash
npm run dev
```

The app will start at `http://localhost:5173`

Open your browser and navigate to the URL. You should see the Expense Tracker app running.

## Building for Production

### Web/PWA Build

1. Build the production bundle:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

3. Deploy the `dist` folder to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Mobile Setup

### Android Setup

1. **First-time setup:**

Build the web assets:
```bash
npm run build
```

Add Android platform (first time only):
```bash
npx cap add android
```

2. **Sync web assets with Android:**
```bash
npm run sync:android
```

3. **Open in Android Studio:**
```bash
npm run open:android
```

4. **Build and Run:**
   - In Android Studio, wait for Gradle sync to complete
   - Connect an Android device or start an emulator
   - Click the "Run" button (green play icon)
   - The app will be installed and launched on your device/emulator

5. **Build APK:**
   - In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Find APK in: `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS Setup (macOS only)

1. **First-time setup:**

Build the web assets:
```bash
npm run build
```

Add iOS platform (first time only):
```bash
npx cap add ios
```

2. **Sync web assets with iOS:**
```bash
npm run sync:ios
```

3. **Install CocoaPods dependencies:**
```bash
cd ios/App
pod install
cd ../..
```

4. **Open in Xcode:**
```bash
npm run open:ios
```

5. **Build and Run:**
   - In Xcode, select a simulator or connected device
   - Click the "Play" button to build and run
   - The app will be installed and launched

6. **Build for App Store:**
   - Configure signing & capabilities in Xcode
   - Product → Archive
   - Follow App Store Connect upload process

## Configuration

### App Configuration

Edit `capacitor.config.json` to customize:
- `appId`: Your unique app identifier (e.g., com.yourcompany.expensetracker)
- `appName`: Display name of your app
- Splash screen settings
- Status bar settings

### Theme and Branding

1. **Colors**: Edit `tailwind.config.js` to customize the primary color palette
2. **App Name**: Change in `capacitor.config.json` and `index.html`
3. **Icons**: Replace icons in `public/` folder

### Environment Variables

Create `.env` file in root for environment-specific settings:
```
VITE_APP_NAME=Expense Tracker
VITE_API_URL=your_api_url_if_needed
```

## Troubleshooting

### Common Issues

**1. Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**2. Build errors:**
```bash
npm run build
```
Check console for specific errors and ensure all TypeScript types are correct.

**3. Capacitor sync issues:**
```bash
npx cap sync --force
```

**4. Android build fails:**
- Ensure Android SDK is properly installed
- Check Java version: `java -version` (should be 11+)
- Clean build: Android Studio → Build → Clean Project

**5. iOS build fails:**
- Run `pod install` in `ios/App` directory
- Clean build: Xcode → Product → Clean Build Folder
- Ensure Xcode command line tools are installed: `xcode-select --install`

**6. App doesn't save data:**
- Check browser console for storage errors
- On mobile, check app permissions in device settings
- Try clearing app data and reinstalling

### Development Tips

1. **Hot Reload**: Changes to React components will hot reload in browser
2. **TypeScript Errors**: Fix TypeScript errors before building for production
3. **Console Logging**: Use browser DevTools or Xcode/Android Studio console
4. **Storage Inspection**: 
   - Web: Browser DevTools → Application → IndexedDB
   - Android: Device File Explorer in Android Studio
   - iOS: Xcode → Window → Devices and Simulators

## Testing

### Web Testing
1. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test responsive design (mobile, tablet, desktop)
3. Test offline functionality (disable network in DevTools)

### Mobile Testing
1. Test on real devices (recommended)
2. Test with different screen sizes
3. Test app permissions (file system access)
4. Test deep linking and app switching
5. Test background/foreground behavior

## Deployment Checklist

### Before Going Live

- [ ] Test all features thoroughly
- [ ] Verify data persistence
- [ ] Test export/import functionality
- [ ] Check performance with large datasets (1000+ expenses)
- [ ] Test on different devices and screen sizes
- [ ] Verify offline functionality
- [ ] Update app version numbers
- [ ] Prepare app store assets (icons, screenshots, descriptions)
- [ ] Configure proper app signing
- [ ] Test budget alerts and notifications
- [ ] Verify all forms have proper validation
- [ ] Check accessibility (keyboard navigation, screen readers)

### App Store Submission

**For Google Play:**
1. Create a Google Play Developer account
2. Prepare app assets (icon, screenshots, description)
3. Build signed APK or AAB (Android App Bundle)
4. Upload to Google Play Console
5. Fill in all required metadata
6. Submit for review

**For Apple App Store:**
1. Create an Apple Developer account
2. Prepare app assets (icon, screenshots, description)
3. Archive and upload via Xcode
4. Fill in all required metadata in App Store Connect
5. Submit for review

## Next Steps

1. Customize the app with your branding
2. Add more categories or features as needed
3. Test thoroughly on all target platforms
4. Gather user feedback and iterate
5. Submit to app stores

## Support

For issues or questions:
- Check the main README.md
- Review Capacitor documentation: https://capacitorjs.com/docs
- Check React documentation: https://react.dev
- Review Tailwind CSS documentation: https://tailwindcss.com/docs

Happy expense tracking! 💰

