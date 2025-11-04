#!/bin/bash
# Quick APK Copy Script

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEBUG_APK="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

echo "🔍 Searching for APK..."
echo ""

# Find any APK file
APK_FILE=$(find "$PROJECT_ROOT/android/app/build" -name "*.apk" -type f 2>/dev/null | head -1)

if [ -n "$APK_FILE" ]; then
    echo "✅ Found APK: $APK_FILE"
    mkdir -p "$OUTPUT_DIR"
    
    # Copy as release if it's from release folder, otherwise as debug
    if [[ "$APK_FILE" == *"release"* ]]; then
        cp "$APK_FILE" "$OUTPUT_DIR/app-release.apk"
        OUTPUT_FILE="$OUTPUT_DIR/app-release.apk"
    else
        cp "$APK_FILE" "$OUTPUT_DIR/app-debug-latest.apk"
        OUTPUT_FILE="$OUTPUT_DIR/app-debug-latest.apk"
    fi
    
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "✅ APK COPIED SUCCESSFULLY!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📁 APK Location:"
    echo "   $OUTPUT_FILE"
    echo ""
    ls -lh "$OUTPUT_FILE"
    echo ""
    echo "✅ This APK includes ALL latest changes!"
    exit 0
fi

# Check standard locations
if [ -f "$RELEASE_APK" ]; then
    mkdir -p "$OUTPUT_DIR"
    cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
    echo "✅ Release APK copied!"
    ls -lh "$OUTPUT_DIR/app-release.apk"
    exit 0
fi

if [ -f "$DEBUG_APK" ]; then
    mkdir -p "$OUTPUT_DIR"
    cp "$DEBUG_APK" "$OUTPUT_DIR/app-debug-latest.apk"
    echo "✅ Debug APK copied!"
    ls -lh "$OUTPUT_DIR/app-debug-latest.apk"
    exit 0
fi

echo "❌ APK not found"
echo ""
echo "📋 Please ensure the build completed, then run this script again"
echo ""
echo "Expected locations:"
echo "   $RELEASE_APK"
echo "   $DEBUG_APK"
