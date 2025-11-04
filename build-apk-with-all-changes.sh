#!/bin/bash

# Build APK with All Changes - Dagger One Expense Tracker
# This script builds the production APK with all latest updates

set -e

echo "🚀 Building Dagger One APK with All Changes..."
echo ""

# Navigate to project root
PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
cd "$PROJECT_ROOT"

# Define output paths
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"
RELEASE_APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"

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

echo "📱 Step 3: Preparing for APK build..."
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "📋 Build Instructions:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ⚠️  COMMAND LINE BUILD HAS JAVA VERSION ISSUES"
echo ""
echo "  ✅ SOLUTION: Build in Android Studio"
echo ""
echo "  1. Android Studio should already be open"
echo "  2. Wait for Gradle sync to complete"
echo "  3. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "  4. Wait for build (~3-5 minutes)"
echo "  5. After build, the APK will be copied to:"
echo ""
echo "     $OUTPUT_DIR/app-release.apk"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Android Studio is needed
echo "🔍 Checking if Android Studio build is needed..."
echo ""

if [ -f "$RELEASE_APK_PATH" ]; then
    echo "✅ Release APK found! Copying to output directory..."
    cp "$RELEASE_APK_PATH" "$OUTPUT_DIR/app-release.apk"
    
    echo ""
    echo "✅ APK copied successfully!"
    echo ""
    echo "📁 APK Location:"
    echo "   $OUTPUT_DIR/app-release.apk"
    echo ""
    ls -lh "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "🎉 APK is ready with all changes!"
else
    echo "⚠️  Release APK not found yet."
    echo ""
    echo "📱 Next Steps:"
    echo "   1. Build APK in Android Studio (instructions above)"
    echo "   2. After build completes, run this script again"
    echo "   3. Script will automatically copy APK to:"
    echo "      $OUTPUT_DIR/app-release.apk"
    echo ""
    
    # Open Android Studio if not already open
    echo "🔄 Opening Android Studio..."
    npx cap open android &
    
    echo ""
    echo "✅ Android Studio opening..."
    echo "   Follow the build instructions above."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

