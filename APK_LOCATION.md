# 📱 APK File Location Guide

## 🎯 **Current APK File**

### **✅ Debug APK (Existing):**
```
📁 Full Path:
/Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/debug/app-debug.apk

📊 File Size: ~4.0 MB
🔧 Type: Debug Build
```

---

## 📍 **APK Locations**

### **1. Debug APK** (For Testing)
```
Location: android/app/build/outputs/apk/debug/app-debug.apk
Size: ~4.0 MB
Type: Debug version (larger, includes debug symbols)
Use: Testing and development
```

### **2. Release APK** (For Production)
**After building in Android Studio:**
```
Location: android/app/build/outputs/apk/release/app-release.apk
Size: ~2-3 MB (smaller, optimized)
Type: Release version (optimized, signed)
Use: Distribution to users
```

---

## 🚀 **How to Build Release APK**

### **Option 1: Using Android Studio** (Recommended)

1. **Open Android Studio**
   - Project should already be open

2. **Build Release APK:**
   - Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Wait for build to complete (~2-5 minutes)

3. **Find the APK:**
   - Android Studio will show a notification: "APK(s) generated successfully"
   - Click "locate" in the notification
   - Or navigate to: `android/app/build/outputs/apk/release/app-release.apk`

### **Option 2: Using Command Line**

```bash
cd /Users/siva-6452/money-expense-tracker/android
./gradlew assembleRelease
```

**Output location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 📂 **Complete APK Directory Structure**

```
android/app/build/outputs/apk/
├── debug/
│   ├── app-debug.apk          ✅ Current file (4.0 MB)
│   └── output-metadata.json
└── release/
    ├── app-release.apk        ⏳ Will be generated here
    └── output-metadata.json
```

---

## 📱 **Install APK on Android Phone**

### **Method 1: Using ADB** (If phone connected via USB)
```bash
cd /Users/siva-6452/money-expense-tracker
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### **Method 2: Manual Transfer**
1. **Copy APK to phone:**
   - Use USB cable
   - Or upload to Google Drive/Dropbox
   - Or email to yourself

2. **Enable "Install from Unknown Sources":**
   - Settings → Security → Unknown Sources (enable)

3. **Install:**
   - Open file manager on phone
   - Navigate to APK location
   - Tap to install

---

## 🔍 **Finding APK in Finder (macOS)**

### **Quick Access:**
1. Open Finder
2. Press `Cmd + Shift + G`
3. Paste this path:
   ```
   /Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/debug
   ```
4. Press Enter

### **Or Navigate Manually:**
```
/Users/siva-6452/
  └── money-expense-tracker/
      └── android/
          └── app/
              └── build/
                  └── outputs/
                      └── apk/
                          └── debug/
                              └── app-debug.apk ✅ HERE
```

---

## 📊 **APK Details**

### **Current Debug APK:**
- **Name:** `app-debug.apk`
- **Size:** 4.0 MB
- **Location:** `android/app/build/outputs/apk/debug/`
- **Full Path:** `/Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/debug/app-debug.apk`
- **Build Type:** Debug (includes debug symbols)
- **Status:** ✅ Ready to install

### **Release APK (After Building):**
- **Name:** `app-release.apk`
- **Size:** ~2-3 MB (optimized)
- **Location:** `android/app/build/outputs/apk/release/`
- **Full Path:** `/Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/release/app-release.apk`
- **Build Type:** Release (optimized, smaller)
- **Status:** ⏳ Need to build in Android Studio

---

## ✅ **Quick Reference**

| APK Type | Path | Size | Status |
|----------|------|------|--------|
| **Debug** | `android/app/build/outputs/apk/debug/app-debug.apk` | 4.0 MB | ✅ **Ready** |
| **Release** | `android/app/build/outputs/apk/release/app-release.apk` | ~2-3 MB | ⏳ Need to build |

---

## 🎯 **Next Steps**

1. **To install current debug APK:**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **To build release APK:**
   - Open Android Studio
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Find at: `android/app/build/outputs/apk/release/app-release.apk`

---

**Your APK is ready at:**
```
/Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/debug/app-debug.apk
```

📱 **You can install this on your Android device right now!**

