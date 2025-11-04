# 📱 Build Release APK in Android Studio - Step-by-Step Guide

## ✅ **Everything is Ready!**

Production build and sync are complete. Follow these steps:

---

## 🎯 **Step-by-Step Instructions:**

### **Step 1: Open Android Studio**
- Android Studio should already be opening
- If not, run: `cd /Users/siva-6452/money-expense-tracker && npx cap open android`

### **Step 2: Wait for Gradle Sync**
- Android Studio will automatically start Gradle sync
- Look at the bottom right corner for sync progress
- Wait for "Gradle sync finished" message (~1-2 minutes)
- **Important:** Don't proceed until sync is complete!

### **Step 3: Build Release APK**

**Method 1: Via Menu (Recommended)**
1. Click **`Build`** in the top menu bar
2. Select **`Build Bundle(s) / APK(s)`**
3. Click **`Build APK(s)`**
4. Wait for build to complete (~3-5 minutes)
5. Notification will appear: **"APK(s) generated successfully"**

**Method 2: Via Build Variants**
1. Click **`Build`** → **`Select Build Variant...`**
2. Select **`release`** for app module
3. Click **`Build`** → **`Build Bundle(s) / APK(s)`** → **`Build APK(s)`**

### **Step 4: Locate APK**
- Click **"locate"** button in the notification
- **OR** navigate manually to:
  ```
  /Users/siva-6452/money-expense-tracker/android/app/build/outputs/apk/release/app-release.apk
  ```

### **Step 5: Auto-Copy to Output**
- The monitoring script will automatically detect the APK
- It will copy to: `/Users/siva-6452/money-expense-tracker/APK_OUTPUT/app-release.apk`
- Check terminal output for confirmation

---

## 🔍 **Troubleshooting:**

### **If Gradle Sync Fails:**
1. Click **`File`** → **`Sync Project with Gradle Files`**
2. Wait for sync to complete
3. Check for error messages in "Build" tab

### **If Build Fails:**
1. Check "Build" tab at bottom for error messages
2. Common issues:
   - Gradle sync incomplete → Re-sync
   - Java version issue → Android Studio handles this automatically
   - Missing dependencies → Check error message

### **If APK Not Found:**
1. Check if build actually completed (look for "BUILD SUCCESSFUL")
2. Manually navigate to: `android/app/build/outputs/apk/release/`
3. Run copy script manually:
   ```bash
   cd /Users/siva-6452/money-expense-tracker
   ./auto-build-and-copy-apk.sh
   ```

---

## 📋 **Visual Guide:**

```
Android Studio Menu:
┌─────────────────────────────────┐
│ File  Edit  View  Navigate  Code │
│ Build  Run  Tools  VCS  Window  │
│          ↓                       │
│    Build Bundle(s) / APK(s)     │
│          ↓                       │
│      Build APK(s)  ← Click Here │
└─────────────────────────────────┘
```

---

## ✅ **What to Look For:**

### **During Build:**
- Bottom status bar shows: "Building..."
- Build tab shows progress
- No red error messages

### **After Build:**
- Notification: "APK(s) generated successfully"
- Build tab shows: "BUILD SUCCESSFUL"
- File exists at: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎯 **Quick Checklist:**

- [ ] Android Studio is open
- [ ] Gradle sync finished (no errors)
- [ ] Clicked `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- [ ] Build completed successfully
- [ ] APK exists at release path
- [ ] Auto-copy script detected and copied APK

---

## 📁 **Final APK Location:**

After successful build and auto-copy:
```
/Users/siva-6452/money-expense-tracker/APK_OUTPUT/app-release.apk
```

---

## 🚀 **Ready to Build!**

Follow the steps above in Android Studio. The auto-monitor script is running and will copy the APK automatically when it's ready!

