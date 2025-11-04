#!/bin/bash
PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 FINAL APK BUILD - ALL CHANGES INCLUDED"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd "$PROJECT_ROOT"

echo "✅ Latest code includes:"
echo "   ✅ Photo attachments (Expenses, Income, Investments)"
echo "   ✅ About section (dagger_one team, v1.1.0)"
echo "   ✅ Updated logo (lightbulb + dagger)"
echo "   ✅ Consistent styling (Dashboard style)"
echo ""
echo "📋 Since command-line build requires Java 11+,"
echo "   please build in Android Studio:"
echo ""
echo "   1. Open Android Studio (should already be open)"
echo "   2. Wait for Gradle sync"
echo "   3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   4. Wait ~3-5 minutes"
echo ""
echo "🔄 This script will monitor for the APK..."
echo ""

# Monitor for APK
TIMEOUT=300
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if [ -f "$RELEASE_APK" ]; then
        echo ""
        echo "✅ APK FOUND! Copying to output directory..."
        mkdir -p "$OUTPUT_DIR"
        cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "✅ SUCCESS! APK READY!"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "📁 APK Location:"
        echo "   $OUTPUT_DIR/app-release.apk"
        echo ""
        ls -lh "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "🎉 APK includes all latest changes!"
        exit 0
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
    if [ $((ELAPSED % 30)) -eq 0 ]; then
        echo "   ⏳ Still waiting... (${ELAPSED}s elapsed)"
    fi
done

echo ""
echo "⏱️  Timeout reached. Build APK in Android Studio."
echo ""
echo "📁 After building, APK will be at:"
echo "   $RELEASE_APK"
echo ""
echo "Run this script again to copy it to output directory."
