#!/bin/bash

# Monitor iOS Build and Download IPA

TOKEN="${GITHUB_TOKEN:-}"
REPO="sivaworkplace/money-expense-tracker"
WORKFLOW="ios-build.yml"

echo "═══════════════════════════════════════════════════════════"
echo "  📱 Monitoring iOS Build"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "🔍 Checking build status..."
echo ""

MAX_ATTEMPTS=60  # 10 minutes (10 second intervals)
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    # Get latest workflow run
    RESPONSE=$(curl -s -H "Authorization: token $TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO/actions/runs?per_page=1")
    
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    CONCLUSION=$(echo "$RESPONSE" | grep -o '"conclusion":"[^"]*"' | head -1 | cut -d'"' -f4)
    RUN_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    if [ -n "$RUN_ID" ]; then
        if [ "$STATUS" = "completed" ]; then
            if [ "$CONCLUSION" = "success" ]; then
                echo "✅ Build completed successfully!"
                echo ""
                echo "📥 Downloading IPA artifact..."
                
                # Get artifacts
                ARTIFACTS=$(curl -s -H "Authorization: token $TOKEN" \
                    -H "Accept: application/vnd.github.v3+json" \
                    "https://api.github.com/repos/$REPO/actions/runs/$RUN_ID/artifacts")
                
                ARTIFACT_ID=$(echo "$ARTIFACTS" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
                
                if [ -n "$ARTIFACT_ID" ]; then
                    mkdir -p IOS_OUTPUT
                    
                    # Download artifact
                    curl -L -H "Authorization: token $TOKEN" \
                        -H "Accept: application/vnd.github.v3+json" \
                        "https://api.github.com/repos/$REPO/actions/artifacts/$ARTIFACT_ID/zip" \
                        -o IOS_OUTPUT/ios-app.zip 2>&1
                    
                    if [ $? -eq 0 ]; then
                        echo ""
                        echo "═══════════════════════════════════════════════════════════"
                        echo "  ✅ iOS APP DOWNLOADED!"
                        echo "═══════════════════════════════════════════════════════════"
                        echo ""
                        echo "📁 Location: $(realpath IOS_OUTPUT/ios-app.zip)"
                        echo ""
                        ls -lh IOS_OUTPUT/ios-app.zip
                        echo ""
                        echo "📦 Extracting..."
                        cd IOS_OUTPUT
                        unzip -q ios-app.zip 2>&1
                        cd ..
                        echo ""
                        echo "✅ iOS app ready!"
                        echo "   📁 $(find IOS_OUTPUT -name "*.ipa" 2>/dev/null | head -1)"
                        echo ""
                        exit 0
                    fi
                fi
                
                echo ""
                echo "📋 Build successful! Download IPA manually:"
                echo "   https://github.com/$REPO/actions/runs/$RUN_ID"
                echo ""
                exit 0
            else
                echo "❌ Build failed with conclusion: $CONCLUSION"
                echo ""
                echo "Check logs: https://github.com/$REPO/actions/runs/$RUN_ID"
                exit 1
            fi
        else
            echo "⏳ Build in progress... ($STATUS) - Attempt $((ATTEMPT+1))/$MAX_ATTEMPTS"
            sleep 10
        fi
    else
        echo "⏳ Waiting for build to start... - Attempt $((ATTEMPT+1))/$MAX_ATTEMPTS"
        sleep 10
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
done

echo ""
echo "⏱️  Timeout reached. Check build status manually:"
echo "   https://github.com/$REPO/actions"
echo ""
