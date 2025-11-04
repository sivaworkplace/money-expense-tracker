#!/bin/bash
# Force rebuild APK with all latest changes

PROJECT_ROOT="/Users/siva-6452/money-expense-tracker"
cd "$PROJECT_ROOT"

echo "🔄 Force Rebuilding APK with ALL Latest Changes..."
echo ""

# Step 1: Clean and rebuild
echo "📦 Step 1: Building fresh production assets..."
npm run build

echo ""
echo "🔄 Step 2: Syncing to Android..."
npx cap sync android

echo ""
echo "✅ All latest changes synced to Android!"
echo ""
echo "📱 Next: Build APK in Android Studio"
echo "   The latest code (photos, About section) is now synced"
echo ""
