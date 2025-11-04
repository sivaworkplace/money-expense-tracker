#!/bin/bash

# Build Android APK Script
# Author: Expense Tracker Team
# Description: Automated script to build Android APK

set -e  # Exit on error

echo "🚀 Starting Android APK Build Process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from project root directory${NC}"
    exit 1
fi

# Check Node.js
echo -e "${YELLOW}📦 Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: $(npm -v)${NC}"

# Check Java
echo -e "${YELLOW}☕ Checking Java JDK...${NC}"
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java is not installed${NC}"
    echo -e "${YELLOW}📖 Please install Java JDK 17 or higher${NC}"
    echo -e "${YELLOW}   macOS: brew install openjdk@17${NC}"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}❌ Java version must be 17 or higher (found: $JAVA_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Java: $(java -version 2>&1 | head -n 1)${NC}"

# Check Android SDK
echo -e "${YELLOW}📱 Checking Android SDK...${NC}"
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ ANDROID_HOME is not set${NC}"
    echo -e "${YELLOW}📖 Please set ANDROID_HOME environment variable${NC}"
    echo -e "${YELLOW}   Example: export ANDROID_HOME=\"\$HOME/Library/Android/sdk\"${NC}"
    exit 1
fi
if [ ! -d "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ Android SDK not found at: $ANDROID_HOME${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Android SDK: $ANDROID_HOME${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Build web assets
echo -e "${YELLOW}🔨 Building web assets...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Web build complete${NC}"

# Check if android platform exists
if [ ! -d "android" ]; then
    echo -e "${YELLOW}📱 Adding Android platform...${NC}"
    npx cap add android
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to add Android platform${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Android platform added${NC}"
else
    echo -e "${GREEN}✅ Android platform already exists${NC}"
fi

# Sync to Android
echo -e "${YELLOW}🔄 Syncing to Android...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Sync failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Sync complete${NC}"

# Ask user how to proceed
echo ""
echo -e "${GREEN}✅ Pre-build complete!${NC}"
echo ""
echo "Choose an option:"
echo "1) Open in Android Studio (recommended)"
echo "2) Build APK via command line"
echo "3) Exit"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}🚀 Opening Android Studio...${NC}"
        npx cap open android
        ;;
    2)
        echo -e "${YELLOW}🔨 Building APK via Gradle...${NC}"
        cd android
        ./gradlew assembleDebug
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ APK build successful!${NC}"
            echo ""
            echo -e "${GREEN}📦 APK Location:${NC}"
            echo "   android/app/build/outputs/apk/debug/app-debug.apk"
            echo ""
            echo -e "${YELLOW}📱 To install on device:${NC}"
            echo "   adb install -r app/build/outputs/apk/debug/app-debug.apk"
        else
            echo -e "${RED}❌ APK build failed${NC}"
            exit 1
        fi
        ;;
    3)
        echo -e "${YELLOW}👋 Exiting...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"

