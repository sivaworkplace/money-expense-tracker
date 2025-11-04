#!/bin/bash
# Monitor and Copy APK Script

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
RELEASE_APK="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
DEBUG_APK="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_DIR="$PROJECT_ROOT/APK_OUTPUT"

cd "$PROJECT_ROOT"

echo "🔍 Monitoring for APK build..."
echo ""

TIMEOUT=300  # 5 minutes
ELAPSED=0
CHECK_INTERVAL=3

while [ $ELAPSED -lt $TIMEOUT ]; do
    # Check release APK first
    if [ -f "$RELEASE_APK" ]; then
        echo ""
        echo "✅ Release APK found!"
        mkdir -p "$OUTPUT_DIR"
        cp "$RELEASE_APK" "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "✅ SUCCESS! APK COPIED!"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "📁 APK Location:"
        echo "   $OUTPUT_DIR/app-release.apk"
        echo ""
        ls -lh "$OUTPUT_DIR/app-release.apk"
        echo ""
        echo "✅ Includes ALL latest changes!"
        exit 0
    fi
    
    # Check debug APK as fallback
    if [ -f "$DEBUG_APK" ]; then
        APK_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$DEBUG_APK" 2>/dev/null)
        CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")
        
        # Check if APK is newer than 5 minutes ago
        if [ "$APK_TIME" \> "$(date -v-5M '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -d '5 minutes ago' '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo 'old')" ]; then
            echo ""
            echo "✅ Debug APK found (recently built)!"
            mkdir -p "$OUTPUT_DIR"
            cp "$DEBUG_APK" "$OUTPUT_DIR/app-debug-latest.apk"
            echo ""
            echo "📁 APK Location:"
            echo "   $OUTPUT_DIR/app-debug-latest.apk"
            echo ""
            ls -lh "$OUTPUT_DIR/app-debug-latest.apk"
            echo ""
            echo "⚠️  Note: This is a debug APK, but includes all latest changes"
            exit 0
        fi
    fi
    
    sleep $CHECK_INTERVAL
    ELAPSED=$((ELAPSED + CHECK_INTERVAL))
    
    if [ $((ELAPSED % 15)) -eq 0 ]; then
        echo "   ⏳ Checking... (${ELAPSED}s)"
    fi
done

echo ""
echo "⏱️  Timeout. Checking for any APK files..."
find android/app/build -name "*.apk" -type f 2>/dev/null | head -3

echo ""
echo "📋 If APK was built, please specify the exact path"
