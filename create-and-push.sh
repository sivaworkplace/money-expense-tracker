#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Setup GitHub & Build iOS App"
echo "═══════════════════════════════════════════════════════════"
echo ""

REPO_URL="https://github.com/sivaworkplace/money-expense-tracker.git"
REPO_NAME="money-expense-tracker"
USERNAME="sivaworkplace"

echo "📋 Step 1: Create GitHub Repository"
echo ""
echo "Please create the repository first:"
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: $REPO_NAME"
echo "  3. Choose: Public (for free builds)"
echo "  4. DO NOT add README, .gitignore, or license"
echo "  5. Click 'Create repository'"
echo ""
read -p "Press Enter after you've created the repository..."

echo ""
echo "📦 Step 2: Pushing code to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  git init
fi

# Add remote
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

# Add all files
git add .

# Commit
git commit -m "Initial commit - Dagger One Expense Tracker with iOS build support" 2>/dev/null || echo "Already committed"

# Set branch
git branch -M main

# Push
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "  ✅ SUCCESS! Code pushed to GitHub"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "📱 Next: Build iOS App"
  echo ""
  echo "1. Go to: https://github.com/$USERNAME/$REPO_NAME/actions"
  echo "2. Click 'iOS Build' workflow"
  echo "3. Click 'Run workflow' button"
  echo "4. Wait 5-10 minutes"
  echo "5. Download IPA from Artifacts section"
  echo ""
else
  echo ""
  echo "❌ Push failed. Please check:"
  echo "   - Repository exists at: https://github.com/$USERNAME/$REPO_NAME"
  echo "   - You're logged into GitHub"
  echo "   - You have write access to the repository"
  echo ""
fi
