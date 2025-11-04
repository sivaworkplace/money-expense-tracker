#!/bin/bash

# Setup and Push to GitHub Script

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Setup GitHub and Push Code"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
  echo "✅ GitHub CLI found!"
  echo ""
  echo "📋 Choose an option:"
  echo ""
  echo "1. Create new GitHub repository and push (recommended)"
  echo "2. Just show commands to run manually"
  echo ""
  read -p "Enter choice (1 or 2): " choice
  
  if [ "$choice" == "1" ]; then
    echo ""
    read -p "Enter repository name (default: money-expense-tracker): " repo_name
    repo_name=${repo_name:-money-expense-tracker}
    
    echo ""
    echo "Creating repository: $repo_name"
    gh repo create "$repo_name" --public --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
      echo ""
      echo "═══════════════════════════════════════════════════════════"
      echo "  ✅ SUCCESS! Repository created and pushed!"
      echo "═══════════════════════════════════════════════════════════"
      echo ""
      REPO_URL=$(gh repo view --json url -q .url)
      echo "📱 Repository URL: $REPO_URL"
      echo ""
      echo "🚀 Next Steps:"
      echo "   1. Go to: $REPO_URL/actions"
      echo "   2. Click 'iOS Build' workflow"
      echo "   3. Click 'Run workflow'"
      echo "   4. Wait 5-10 minutes"
      echo "   5. Download IPA from Artifacts"
      echo ""
    else
      echo "❌ Failed to create repository. Check GitHub authentication."
      echo "Run: gh auth login"
    fi
    exit 0
  fi
fi

# Manual instructions
echo ""
echo "📋 Manual Setup Instructions:"
echo ""
echo "1. Create repository at: https://github.com/new"
echo "   - Name: money-expense-tracker"
echo "   - Public"
echo "   - Don't add README/license"
echo ""
echo "2. Then run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/money-expense-tracker.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
