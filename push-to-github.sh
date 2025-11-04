#!/bin/bash

# Push to GitHub Script - Dagger One Expense Tracker

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Push to GitHub for FREE iOS Builds"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📦 Initializing git repository..."
  git init
fi

# Check if remote exists
if ! git remote get-url origin &>/dev/null; then
  echo ""
  echo "⚠️  GitHub remote not configured!"
  echo ""
  echo "Please run these commands manually:"
  echo ""
  echo "1. Create repository at: https://github.com/new"
  echo "   - Name: money-expense-tracker"
  echo "   - Choose: Public"
  echo "   - Don't add README/license"
  echo ""
  echo "2. Then run:"
  echo "   git remote add origin https://github.com/YOUR_USERNAME/money-expense-tracker.git"
  echo "   git branch -M main"
  echo ""
  echo "3. Then run this script again!"
  exit 1
fi

echo "✅ Git repository ready"
echo ""

# Add all files
echo "📝 Adding files..."
git add .

# Check if there are changes
if git diff --staged --quiet; then
  echo "ℹ️  No changes to commit"
else
  # Commit
  echo "💾 Committing changes..."
  git commit -m "Update: Dagger One Expense Tracker with iOS build support"
fi

# Push
echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "  ✅ SUCCESS! Code pushed to GitHub"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "📱 Next Steps:"
  echo "   1. Go to: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1\/\2/')/actions"
  echo "   2. Click 'iOS Build' workflow"
  echo "   3. Click 'Run workflow'"
  echo "   4. Wait 5-10 minutes"
  echo "   5. Download IPA from Artifacts"
  echo ""
else
  echo ""
  echo "❌ Push failed. Check your GitHub credentials and remote URL"
  echo ""
fi
