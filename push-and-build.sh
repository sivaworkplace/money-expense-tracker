#!/bin/bash
# Auto Push and Build iOS App

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Auto Push & Build iOS App"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd /Users/siva-6452/money-expense-tracker

echo "📤 Pushing code to GitHub..."
echo ""

# Try to push
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ CODE PUSHED SUCCESSFULLY!"
    echo ""
    echo "🌐 Opening GitHub Actions..."
    open "https://github.com/sivaworkplace/money-expense-tracker/actions" 2>/dev/null
    echo ""
    echo "📋 Next: Click 'iOS Build' → 'Run workflow'"
else
    echo ""
    echo "⚠️  Repository not found. Please create it first:"
    echo ""
    echo "👉 https://github.com/new"
    echo "   • Name: money-expense-tracker"
    echo "   • Public"
    echo "   • Don't add README/license"
    echo ""
    open "https://github.com/new" 2>/dev/null
fi
