#!/bin/bash
# Build and Monitor APK Script

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

echo "🚀 Building APK with All Latest Changes..."
echo ""

cd "$PROJECT_ROOT"

# Step 1: Build web assets
echo "📦 Step 1: Building production web assets..."
npm run build > /dev/null 2>&1
echo "✅ Production build complete"

# Step 2: Sync to Android
echo "🔄 Step 2: Syncing to Android..."
npx cap sync android > /dev/null 2>&1
echo "✅ Android sync complete"

# Step 3: Try to build APK
echo ""
echo "📱 Step 3: Attempting to build APK..."
cd android

# Check if we can use Android Studio's Gradle
AS_GRADLE=$(find ~/Library/Application\ Support/Google/AndroidStudio* -name "gradle" -type d 2>/dev/null | head -1)

if [ -d "$AS_GRADLE" ]; then
    echo "✅ Found Android Studio Gradle"
    export PATH="$AS_GRADLE/bin:$PATH"
fi

# Try to find Java 11+
JAVA_11=$(/usr/libexec/java_home -V 2>&1 | grep -i "java.*11" | head -1 | awk '{print $NF}' || echo "")
if [ -n "$JAVA_11" ]; then
    export JAVA_HOME="$JAVA_11"
    echo "✅ Using Java 11+: $JAVA_HOME"
    "$JAVA_HOME/bin/java" -version 2>&1 | head -1
fi

# Try building
echo ""
echo "⏳ Building release APK..."
./gradlew clean assembleRelease --no-daemon --warning-mode none 2>&1 | tail -20

if [ -f "$RELEASE_APK" ]; then
    echo ""
    echo "✅ BUILD SUCCESSFUL!"
    mkdir -p "$OUTPUT_DIR"
    cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "📁 APK Location:"
    echo "   $OUTPUT_DIR/app-release.apk"
    ls -lh "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "🎉 APK ready with all changes!"
else
    echo ""
    echo "⚠️  Build failed or APK not found"
    echo "📋 Please build APK in Android Studio:"
    echo "   1. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "   2. Then run this script again to copy APK"
fi
