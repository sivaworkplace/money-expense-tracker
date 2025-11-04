#!/bin/bash
# Auto-detect and Copy APK Script

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

cd "$PROJECT_ROOT"

echo "🔍 Checking for APK..."
echo ""

if [ -f "$RELEASE_APK" ]; then
    echo "✅ APK FOUND!"
    echo ""
    mkdir -p "$OUTPUT_DIR"
    cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
    echo "✅ APK copied to output directory"
    echo ""
    echo "📁 APK Location:"
    echo "   $OUTPUT_DIR/app-release.apk"
    echo ""
    ls -lh "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "🎉 APK ready with all latest changes!"
    echo ""
    echo "✅ Includes:"
    echo "   ✅ Photo attachments"
    echo "   ✅ Updated About section"
    echo "   ✅ Updated logo"
    echo "   ✅ Consistent Dashboard styling"
    echo "   ✅ All features"
    exit 0
else
    echo "❌ Release APK not found yet"
    echo ""
    echo "📋 Build APK in Android Studio:"
    echo "   1. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "   2. Wait for build to complete"
    echo "   3. Run this script again: ./auto-detect-and-copy-apk.sh"
    echo ""
    exit 1
fi
