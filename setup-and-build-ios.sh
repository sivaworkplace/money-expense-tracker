#!/bin/bash

# Setup and Build iOS App Script
# For GitHub user: sivaworkplace

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Setup GitHub & Build iOS App"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd /Users/siva-6452/money-expense-tracker

# Check if repo exists
echo "📋 Checking repository status..."
if git ls-remote --heads origin main &>/dev/null; then
    echo "✅ Repository exists on GitHub"
    echo ""
    echo "🚀 Pushing code..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "  ✅ CODE PUSHED SUCCESSFULLY!"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "📱 Next: Build iOS App"
        echo ""
        echo "1. Go to: https://github.com/sivaworkplace/money-expense-tracker/actions"
        echo "2. Click 'iOS Build' workflow"
        echo "3. Click 'Run workflow' → 'Run workflow'"
        echo "4. Wait 5-10 minutes"
        echo "5. Download IPA from Artifacts section"
        echo ""
        echo "🌐 Opening GitHub repository in browser..."
        open "https://github.com/sivaworkplace/money-expense-tracker" 2>/dev/null || echo "Please visit: https://github.com/sivaworkplace/money-expense-tracker"
    else
        echo ""
        echo "❌ Push failed. Repository may not exist yet."
        echo ""
        echo "📋 Please create repository first:"
        echo "   1. Go to: https://github.com/new"
        echo "   2. Name: money-expense-tracker"
        echo "   3. Public"
        echo "   4. Don't add README/license"
        echo "   5. Click 'Create repository'"
        echo ""
        echo "Then run this script again!"
    fi
else
    echo "⚠️  Repository not found on GitHub"
    echo ""
    echo "📋 Please create repository first:"
    echo ""
    echo "STEP 1: Create Repository"
    echo "   → Go to: https://github.com/new"
    echo "   → Owner: sivaworkplace"
    echo "   → Name: money-expense-tracker"
    echo "   → Visibility: Public"
    echo "   → ⚠️  Don't check README/license"
    echo "   → Click 'Create repository'"
    echo ""
    echo "STEP 2: Run this script again"
    echo "   ./setup-and-build-ios.sh"
    echo ""
    echo "🌐 Opening GitHub new repository page..."
    open "https://github.com/new" 2>/dev/null || echo "Please visit: https://github.com/new"
fi

