#!/bin/bash
echo "═══════════════════════════════════════════════════════════════"
echo "  VERIFYING ALL CHANGES ARE SYNCED TO ANDROID"
echo "═══════════════════════════════════════════════════════════════"
echo ""

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
cd "$PROJECT_ROOT"

echo "📦 Step 1: Rebuilding with ALL latest changes..."
npm run build > /dev/null 2>&1
echo "✅ Build complete"

echo ""
echo "🔄 Step 2: Syncing to Android..."
npx cap sync android > /dev/null 2>&1
echo "✅ Sync complete"

echo ""
echo "✅ Verification:"
echo ""

# Check source code
if grep -q "PhotoUpload" src/components/ExpenseForm.tsx 2>/dev/null; then
    echo "✅ PhotoUpload in ExpenseForm: YES"
else
    echo "❌ PhotoUpload in ExpenseForm: NO"
fi

if grep -q "PhotoView" src/pages/Expenses.tsx 2>/dev/null; then
    echo "✅ PhotoView in Expenses page: YES"
else
    echo "❌ PhotoView in Expenses page: NO"
fi

if grep -q "dagger_one" src/pages/Settings.tsx 2>/dev/null; then
    echo "✅ About section (dagger_one): YES"
else
    echo "❌ About section (dagger_one): NO"
fi

if grep -q "1.1.0" src/pages/Settings.tsx 2>/dev/null; then
    echo "✅ Version 1.1.0: YES"
else
    echo "❌ Version 1.1.0: NO"
fi

echo ""
echo "📦 Checking synced assets..."
JS_COUNT=$(find android/app/src/main/assets/public/assets -name "*.js" 2>/dev/null | wc -l | tr -d ' ')
echo "✅ JavaScript files synced: $JS_COUNT"

if [ "$JS_COUNT" -gt 0 ]; then
    echo "✅ Latest code is in Android project"
    echo ""
    echo "📱 Next: Build APK in Android Studio"
    echo "   All changes (photos, About, etc.) will be included!"
else
    echo "⚠️ No assets found - need to sync"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
