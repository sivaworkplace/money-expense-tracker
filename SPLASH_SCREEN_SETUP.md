# 🎨 Dagger One Splash Screen Setup Guide

## ✅ App Name Updated!

The app name has been changed to **"Dagger One"** throughout the application:
- ✅ Capacitor config updated
- ✅ PWA manifest updated  
- ✅ HTML title updated
- ✅ App ID changed to `com.daggerone.expensetracker`
- ✅ Splash screen background set to yellow (#F5DD61)

---

## 🎯 Splash Screen Image Requirements

Based on your reference image, here's what we need to create:

### **Design Specifications:**
- **Background:** Yellow (#F5DD61) - like in your reference
- **Logo:** Circular design with:
  - Black circle in center
  - Notepad/checklist icon (white) in the center
  - Colorful gradient rings around it (orange, pink, purple, blue)
- **Optional Text:** "DAGGER ONE" below the logo
- **Display Duration:** 2 seconds (already configured)

---

## 📐 Required Image Sizes for Android

You need to create splash screen images in these sizes:

| Density | Folder | Size (pixels) | 
|---------|--------|---------------|
| **MDPI** | `drawable-mdpi` | 320 x 480 |
| **HDPI** | `drawable-hdpi` | 480 x 800 |
| **XHDPI** | `drawable-xhdpi` | 720 x 1280 |
| **XXHDPI** | `drawable-xxhdpi` | 1080 x 1920 |
| **XXXHDPI** | `drawable-xxxhdpi` | 1440 x 2560 |

---

## 🎨 Step 1: Create the Splash Screen Image

### **Option A: Using Online Tools (Easiest)**

1. **Use Figma** (Free): https://figma.com
   - Create a new file with dimensions 1080 x 1920px (XXHDPI)
   - Set background to yellow (#F5DD61)
   - Recreate the logo:
     - Draw a black circle
     - Add the notepad icon (or similar) in white
     - Add colorful gradient circles/rings around it
   - Add "DAGGER ONE" text if desired
   - Export as PNG at different sizes

2. **Use Canva** (Free): https://canva.com
   - Create custom size: 1080 x 1920px
   - Yellow background
   - Add shapes and icons to recreate the logo
   - Download in different sizes

3. **Use Image Resizer** (After creating one size):
   - Create the largest size first (1440 x 2560px)
   - Use https://www.iloveimg.com/resize-image to create other sizes

### **Option B: Use AI Image Generators**

1. **DALL-E, Midjourney, or Stable Diffusion**:
   ```
   Prompt: "A mobile app splash screen with yellow background (#F5DD61), 
   featuring a circular logo with a black center circle containing a white 
   notepad/checklist icon, surrounded by colorful gradient rings in orange, 
   pink, purple, and blue. Text 'DAGGER ONE' in bold black below the logo. 
   Clean, modern, professional design. Portrait orientation 9:16 ratio."
   ```

2. **Leonardo AI** or **Bing Image Creator** (Free)

### **Option C: Hire on Fiverr**
- Search for "splash screen design"
- Provide your reference image
- Cost: $5-$20
- Turnaround: 1-2 days

---

## 📁 Step 2: Prepare Image Files

Once you have your images, name them:
- `splash.png` (all sizes)

You should have 5 files total (one for each density).

---

## 📂 Step 3: Place Images in Android Project

Place the splash screen images in these folders:

```
/Users/siva-6452/money-expense-tracker/android/app/src/main/res/
├── drawable-mdpi/
│   └── splash.png (320 x 480)
├── drawable-hdpi/
│   └── splash.png (480 x 800)
├── drawable-xhdpi/
│   └── splash.png (720 x 1280)
├── drawable-xxhdpi/
│   └── splash.png (1080 x 1920)
└── drawable-xxxhdpi/
    └── splash.png (1440 x 2560)
```

**Note:** These folders don't exist yet. I'll create them for you next.

---

## 🛠️ Step 4: What I'll Do for You

I will:
1. ✅ Create all the necessary drawable folders
2. ✅ Create a placeholder splash.xml configuration file
3. ✅ Update colors.xml with the yellow background
4. ✅ Rebuild the APK once you provide the images

---

## 🎯 Quick Summary

**What You Need to Do:**
1. Create the splash screen images (5 sizes) based on your reference
2. Save them as `splash.png`
3. Place them in the drawable folders (I'll create these)
4. Let me know when ready, and I'll rebuild the APK

**What's Already Done:**
- ✅ App renamed to "Dagger One"
- ✅ Splash screen duration set to 2 seconds
- ✅ Background color set to yellow
- ✅ Splash screen configuration updated

---

## 💡 Temporary Solution (Optional)

If you want to test the app now without the logo:
- The splash will show a yellow background for 2 seconds
- You can add the logo images later and rebuild

---

## 🆘 Need Help?

If you need me to:
1. Generate a simple logo using text/shapes
2. Create the drawable folders now
3. Provide more detailed instructions

Just let me know! I'm ready to help you create the perfect splash screen! 🚀

