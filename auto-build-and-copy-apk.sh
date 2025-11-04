#!/bin/bash

# Auto-build and Copy APK Script
# Monitors Android Studio build and copies APK when ready

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK_SOURCE="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEBUG_APK_SOURCE="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

echo "🚀 Auto-Build APK Script - Dagger One"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Build web assets
echo "📦 Step 1: Building production web assets..."
cd "$PROJECT_ROOT"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Production build complete"
else
    echo "❌ Build failed"
    exit 1
fi

# Step 2: Sync to Android
echo "🔄 Step 2: Syncing to Android..."
npx cap sync android > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Android sync complete"
else
    echo "❌ Sync failed"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Step 3: Check if APK already exists
echo ""
echo "🔍 Checking for existing APK..."

if [ -f "$RELEASE_APK_SOURCE" ]; then
    echo "✅ Release APK found!"
    echo "📋 Copying to output directory..."
    cp "$RELEASE_APK_SOURCE" "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "✅ APK copied successfully!"
    echo ""
    echo "📁 Final APK Location:"
    echo "   $OUTPUT_DIR/app-release.apk"
    echo ""
    ls -lh "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "🎉 APK is ready with all changes!"
    exit 0
fi

if [ -f "$DEBUG_APK_SOURCE" ]; then
    echo "⚠️  Only debug APK found (may be outdated)"
    echo "📋 Copying debug APK as fallback..."
    cp "$DEBUG_APK_SOURCE" "$OUTPUT_DIR/app-debug.apk"
    echo ""
    echo "📁 Debug APK Location:"
    echo "   $OUTPUT_DIR/app-debug.apk"
    echo ""
    ls -lh "$OUTPUT_DIR/app-debug.apk"
    echo ""
    echo "⚠️  Note: This is a debug APK. Build release APK in Android Studio for production."
fi

# Step 4: Open Android Studio and monitor
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Opening Android Studio..."
echo ""
echo "⏳ Instructions:"
echo "   1. Wait for Gradle sync (~1-2 minutes)"
echo "   2. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   3. Wait for build (~3-5 minutes)"
echo ""
echo "🔄 This script will monitor and copy APK automatically..."
echo ""

npx cap open android > /dev/null 2>&1 &

# Monitor for APK file
echo "⏳ Waiting for APK to be built..."
echo "   (Checking every 5 seconds for up to 10 minutes)"
echo ""

TIMEOUT=600  # 10 minutes
ELAPSED=0
CHECK_INTERVAL=5

while [ $ELAPSED -lt $TIMEOUT ]; do
    if [ -f "$RELEASE_APK_SOURCE" ]; then
        echo ""
        echo "✅ Release APK detected!"
        echo "📋 Copying to output directory..."
        cp "$RELEASE_APK_SOURCE" "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ SUCCESS! APK copied to output directory"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📁 Final APK Location:"
        echo "   $OUTPUT_DIR/app-release.apk"
        echo ""
        ls -lh "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "🎉 APK is ready with all changes!"
        exit 0
    fi
    
    sleep $CHECK_INTERVAL
    ELAPSED=$((ELAPSED + CHECK_INTERVAL))
    
    # Show progress every 30 seconds
    if [ $((ELAPSED % 30)) -eq 0 ]; then
        echo "   ⏳ Still waiting... (${ELAPSED}s elapsed)"
    fi
done

echo ""
echo "⏱️  Timeout reached. APK not built yet."
echo ""
echo "📋 Manual Steps:"
echo "   1. Build APK in Android Studio"
echo "   2. Run this script again: ./auto-build-and-copy-apk.sh"
echo "   3. Script will copy APK automatically"
echo ""

