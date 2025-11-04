#!/bin/bash

# Complete iOS Setup - sivaworkplace
# This script will guide you through the entire process

echo "═══════════════════════════════════════════════════════════"
echo "  📱 Complete iOS App Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd /Users/siva-6452/money-expense-tracker

# Check if repo exists
echo "🔍 Checking if repository exists..."
if git ls-remote --heads origin main &>/dev/null 2>&1; then
    echo "✅ Repository exists!"
    echo ""
    echo "📤 Pushing code..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "  ✅ SUCCESS! Code Pushed!"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "🌐 Opening GitHub Actions..."
        open "https://github.com/sivaworkplace/money-expense-tracker/actions" 2>/dev/null
        
        echo ""
        echo "📱 Next Steps:"
        echo "   1. Click 'iOS Build' workflow"
        echo "   2. Click 'Run workflow' → 'Run workflow'"
        echo "   3. Wait 5-10 minutes"
        echo "   4. Download IPA from Artifacts"
        echo ""
    else
        echo ""
        echo "❌ Push failed. Check your authentication."
        echo ""
        echo "💡 Use Personal Access Token:"
        echo "   https://github.com/settings/tokens"
        echo ""
    fi
else
    echo "⚠️  Repository not found on GitHub"
    echo ""
    echo "📋 STEP 1: Create Repository"
    echo ""
    echo "   👉 Opening: https://github.com/new"
    echo ""
    open "https://github.com/new" 2>/dev/null || echo "Visit: https://github.com/new"
    
    echo "   Fill in:"
    echo "   • Owner: sivaworkplace"
    echo "   • Repository name: money-expense-tracker"
    echo "   • Visibility: Public ⭐"
    echo "   • ⚠️  Uncheck: README, .gitignore, license"
    echo "   • Click 'Create repository'"
    echo ""
    echo "   ⏸️  Press Enter after creating the repository..."
    read -p "   (Press Enter to continue)"
    
    echo ""
    echo "📤 STEP 2: Pushing code..."
    git push -u origin main 2>&1
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Code pushed successfully!"
        echo ""
        echo "🌐 Opening GitHub Actions..."
        open "https://github.com/sivaworkplace/money-expense-tracker/actions" 2>/dev/null
        
        echo ""
        echo "📱 STEP 3: Build iOS App"
        echo "   1. Click 'iOS Build' workflow"
        echo "   2. Click 'Run workflow' → 'Run workflow'"
        echo "   3. Wait 5-10 minutes"
        echo "   4. Download IPA from Artifacts"
        echo ""
    else
        echo ""
        echo "❌ Push failed. You may need to authenticate."
        echo ""
        echo "💡 Get Personal Access Token:"
        echo "   https://github.com/settings/tokens"
        echo "   • Generate new token (classic)"
        echo "   • Select 'repo' scope"
        echo "   • Use token as password when pushing"
        echo ""
        echo "   Then run: git push -u origin main"
        echo ""
    fi
fi
