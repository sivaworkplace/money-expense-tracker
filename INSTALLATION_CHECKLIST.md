# ✅ Installation & Verification Checklist

Use this checklist to ensure your Expense Tracker is properly set up.

## 📋 Pre-Installation Checklist

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, for version control)

## 🔧 Installation Steps

### Step 1: Navigate to Project
```bash
cd /Users/siva-6452/money-expense-tracker
```
- [ ] Confirmed in correct directory

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] No errors during installation
- [ ] `node_modules` folder created
- [ ] All dependencies installed successfully

### Step 3: Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] URL shown (typically http://localhost:5173)
- [ ] No compilation errors in terminal

### Step 4: Open in Browser
- [ ] Opened http://localhost:5173
- [ ] App loads successfully
- [ ] No errors in browser console (F12)
- [ ] Dashboard page visible

## ✨ Feature Verification

### Navigation
- [ ] Desktop: Sidebar navigation visible (on wide screens)
- [ ] Mobile: Bottom tab bar visible (on narrow screens)
- [ ] Can navigate between all 5 pages:
  - [ ] Dashboard
  - [ ] Expenses
  - [ ] Reports
  - [ ] Budget
  - [ ] Settings

### Dashboard
- [ ] Summary cards display correctly
- [ ] Shows "No expenses yet" message initially
- [ ] Monthly total shows ₹0.00 (or your currency)
- [ ] Today's expenses shows ₹0.00

### Add Expense
- [ ] Floating Action Button (+) visible in bottom right
- [ ] Clicking opens "Add Expense" modal
- [ ] Form has all fields:
  - [ ] Amount (number input)
  - [ ] Category (dropdown with icons)
  - [ ] Description (text area)
  - [ ] Date & Time (datetime picker)
  - [ ] Payment Method (dropdown)
- [ ] Can submit form with valid data
- [ ] Validation works (try submitting empty form)
- [ ] New expense appears on Dashboard after adding

### Expenses Page
- [ ] Search box visible and functional
- [ ] Filters button shows/hides filter panel
- [ ] Can filter by:
  - [ ] Category
  - [ ] Date range
  - [ ] Amount range
- [ ] Can sort by different options
- [ ] Expenses grouped by date
- [ ] Can click expense to edit
- [ ] Can delete expense (tap twice for confirmation)

### Reports Page
- [ ] Date range selector works
- [ ] Shows "No expenses" initially
- [ ] After adding expenses:
  - [ ] Pie chart displays
  - [ ] Summary stats show
  - [ ] Top categories list appears

### Budget Page
- [ ] Can set monthly budget
- [ ] Can set category budgets
- [ ] Progress bars display correctly
- [ ] Color coding works (green/orange/red)
- [ ] Edit mode works
- [ ] Save/Cancel buttons functional

### Settings Page
- [ ] Currency dropdown works (INR/USD/EUR/GBP)
- [ ] Date format toggle works
- [ ] Theme toggle works
- [ ] Dark mode applies correctly
- [ ] Categories list displays
- [ ] Can add custom category
- [ ] Export/Import buttons present
- [ ] Clear data button present (with confirmation)

## 🎨 UI/UX Verification

### Responsive Design
- [ ] Works on desktop (1920px wide)
- [ ] Works on tablet (768px wide)
- [ ] Works on mobile (375px wide)
- [ ] No horizontal scrolling
- [ ] All text readable
- [ ] Buttons large enough to tap

### Dark Mode
- [ ] Toggle in Settings works
- [ ] All pages render correctly in dark mode
- [ ] Text is readable
- [ ] Colors have good contrast
- [ ] Charts visible in dark mode

### Accessibility
- [ ] Can navigate with Tab key
- [ ] Focus indicators visible
- [ ] Can close modals with Esc key
- [ ] All buttons have hover states
- [ ] Forms have proper labels
- [ ] Error messages display clearly

## 💾 Data Persistence

### Test Data Saving
1. Add an expense
2. Refresh the page
- [ ] Expense still appears after refresh
- [ ] Data persists across page refreshes

### Test Data Export
1. Add a few expenses
2. Go to Settings
3. Click "Export Data (JSON)"
- [ ] File downloads successfully
- [ ] File contains valid JSON
- [ ] All expenses in exported file

### Test Data Import
1. Click "Import Data" in Settings
2. Select `sample-data.json`
- [ ] Data imports successfully
- [ ] Sample expenses appear
- [ ] Categories and budgets imported

## 📱 Mobile Build Verification (Optional)

### Android Setup
- [ ] `npx cap add android` runs successfully
- [ ] `npm run sync:android` completes
- [ ] Android Studio opens without errors
- [ ] App builds successfully
- [ ] App runs on device/emulator

### iOS Setup (macOS only)
- [ ] `npx cap add ios` runs successfully
- [ ] `pod install` completes in ios/App
- [ ] `npm run sync:ios` completes
- [ ] Xcode opens without errors
- [ ] App builds successfully
- [ ] App runs on simulator/device

## 🐛 Common Issues Resolution

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 3000
```
- [ ] App starts on different port

### Issue: Dependencies fail to install
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```
- [ ] Dependencies install successfully

### Issue: TypeScript errors
**Solution:**
```bash
npm run build
```
- [ ] Build completes without errors

### Issue: Data not persisting
**Solution:**
- Check browser storage settings
- Try different browser
- Check console for errors
- [ ] Data persists after fix

### Issue: Charts not displaying
**Solution:**
- Ensure Recharts installed: `npm install recharts`
- Check console for errors
- Add some expenses first
- [ ] Charts display correctly

## 📊 Performance Verification

- [ ] App loads in < 2 seconds
- [ ] Page navigation is instant
- [ ] Search responds in < 300ms
- [ ] No lag when typing
- [ ] Smooth scrolling
- [ ] Charts render quickly
- [ ] No memory leaks (check DevTools)

## 🎯 Production Readiness

- [ ] No console errors
- [ ] No console warnings (or minimal)
- [ ] All features work as expected
- [ ] Responsive on all screen sizes
- [ ] Dark mode fully functional
- [ ] Data persists correctly
- [ ] Export/Import works
- [ ] Forms validate properly
- [ ] No broken links or buttons
- [ ] Accessible with keyboard
- [ ] Ready for deployment

## ✅ Final Verification

Run the build command:
```bash
npm run build
```

Expected output:
- [ ] Build completes successfully
- [ ] No errors
- [ ] `dist` folder created
- [ ] Files in `dist` folder

Preview production build:
```bash
npm run preview
```
- [ ] Preview server starts
- [ ] App works in production mode
- [ ] All features functional

## 🎉 Success Criteria

**Your installation is successful if:**

✅ All 5 pages load without errors  
✅ Can add, edit, and delete expenses  
✅ Data persists after refresh  
✅ Charts display with data  
✅ Dark mode works  
✅ Export/Import functional  
✅ No console errors  
✅ Responsive on mobile  

## 📝 Notes

**Tested On:**
- Date: _______________
- Node Version: _______________
- Browser: _______________
- Platform: _______________

**Issues Found:**
- _______________________________________________
- _______________________________________________

**Resolved:**
- _______________________________________________
- _______________________________________________

---

If all checkboxes are ✅, congratulations! Your Expense Tracker is ready to use! 🎉

For questions or issues, refer to:
- `README.md` - Main documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `QUICK_START.md` - Quick reference
- `PROJECT_SUMMARY.md` - Technical overview

