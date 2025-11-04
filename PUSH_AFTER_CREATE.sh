#!/bin/bash

# Push to GitHub after repository is created

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Pushing Code to GitHub"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd /Users/siva-6452/money-expense-tracker

echo "📋 Attempting to push to GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ✅ SUCCESS! Code Pushed to GitHub"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📱 Next Steps to Get iOS App:"
    echo ""
    echo "1. Go to: https://github.com/sivaworkplace/money-expense-tracker/actions"
    echo ""
    echo "2. Click 'iOS Build' workflow"
    echo ""
    echo "3. Click 'Run workflow' button (top right)"
    echo ""
    echo "4. Click 'Run workflow' (green button)"
    echo ""
    echo "5. Wait 5-10 minutes for build"
    echo ""
    echo "6. Download IPA from 'Artifacts' section"
    echo ""
    echo "🌐 Opening GitHub Actions page..."
    open "https://github.com/sivaworkplace/money-expense-tracker/actions" 2>/dev/null || echo "Visit: https://github.com/sivaworkplace/money-expense-tracker/actions"
else
    echo ""
    echo "❌ Push failed!"
    echo ""
    echo "📋 Make sure you:"
    echo "   1. Created repository at: https://github.com/new"
    echo "   2. Named it: money-expense-tracker"
    echo "   3. Made it Public"
    echo "   4. Didn't add README/license"
    echo ""
    echo "Then run this script again!"
fi

