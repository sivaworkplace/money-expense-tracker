#!/bin/bash

# Final APK Build Script - Dagger One Expense Tracker
# This script prepares and builds the APK

set -e

echo "🚀 Building Dagger One APK..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

echo "📦 Step 1: Building production web assets..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Production build complete!"
echo ""

echo "🔄 Step 2: Syncing to Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Sync failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "✅ Android sync complete!"
echo ""

echo "📱 Step 3: Opening Android Studio..."
echo ""
echo "⏳ Waiting for Android Studio to open..."
echo ""
echo "📋 Next steps in Android Studio:"
echo "   1. Wait for Gradle sync to complete"
echo "   2. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   3. Wait for build (~3-5 minutes)"
echo "   4. Click 'locate' in notification to find APK"
echo ""
echo "📁 APK will be at:"
echo "   android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "✅ Or use debug APK at:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""

# Open Android Studio
npx cap open android

echo ""
echo "🎉 Ready for APK build in Android Studio!"

