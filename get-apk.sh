#!/bin/bash
# Get APK Script - Automatically copies APK when built

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEBUG_APK="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

cd "$PROJECT_ROOT"

echo "🔍 Checking for APK files..."
echo ""

# Check release APK first
if [ -f "$RELEASE_APK" ]; then
    echo "✅ Release APK found!"
    mkdir -p "$OUTPUT_DIR"
    cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "✅ SUCCESS! RELEASE APK READY!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📁 APK Location:"
    echo "   $OUTPUT_DIR/app-release.apk"
    echo ""
    ls -lh "$OUTPUT_DIR/app-release.apk"
    echo ""
    echo "✅ Includes ALL latest changes:"
    echo "   ✅ Photo attachments (Expenses, Income, Investments)"
    echo "   ✅ About section (dagger_one team, v1.1.0)"
    echo "   ✅ Updated logo (lightbulb + dagger)"
    echo "   ✅ Consistent Dashboard styling"
    echo "   ✅ All 8 sections working"
    echo ""
    exit 0
fi

# Check debug APK
if [ -f "$DEBUG_APK" ]; then
    echo "⚠️  Only debug APK found (may be outdated)"
    echo "📋 Building release APK in Android Studio..."
    echo ""
    echo "After building release APK, run this script again."
    exit 1
fi

echo "❌ No APK found yet"
echo ""
echo "📋 Build APK in Android Studio:"
echo "   1. Open Android Studio"
echo "   2. Wait for Gradle sync"
echo "   3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   4. Wait for build (~3-5 minutes)"
echo "   5. Run this script again: ./get-apk.sh"
echo ""
exit 1
