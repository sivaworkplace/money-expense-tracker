# 🚀 Quick Start Guide

Get your Expense Tracker up and running in minutes!

## 1. Install Dependencies (First Time Only)

```bash
cd /Users/siva-6452/money-expense-tracker
npm install
```

⏱️ This takes 2-3 minutes

## 2. Run the App

```bash
npm run dev
```

🎉 Open http://localhost:5173 in your browser

## 3. Start Tracking!

### Add Your First Expense
1. Click the **+** button (bottom right)
2. Fill in the details:
   - Amount: e.g., 500
   - Category: Food & Dining
   - Description: Grocery shopping
   - Date & Time: (defaults to now)
   - Payment Method: Credit Card
3. Click "Add Expense"

### Set a Budget
1. Click **Budget** in navigation
2. Click "Edit Budget"
3. Set your monthly budget: e.g., 30000
4. Set category budgets as needed
5. Click "Save Changes"

### View Reports
1. Click **Reports** in navigation
2. See your spending visualized in charts
3. Change date range to analyze different periods

### Customize Settings
1. Click **Settings** in navigation
2. Change currency (INR/USD/EUR/GBP)
3. Toggle dark mode
4. Add custom categories

## Test with Sample Data

Want to see the app with data already loaded?

1. Go to **Settings**
2. Click "Import Data"
3. Select `sample-data.json` from the project folder
4. Click to import

Now you'll have 10 sample expenses to explore!

## Build for Mobile

### Android
```bash
npm run build
npx cap add android
npm run sync:android
npm run open:android
```

### iOS (macOS only)
```bash
npm run build
npx cap add ios
npm run sync:ios
npm run open:ios
```

## Key Features to Try

✅ **Dashboard** - See your monthly overview  
✅ **Add Expense** - Quick entry with validation  
✅ **Search & Filter** - Find expenses by category, date, amount  
✅ **Charts** - Pie chart, line chart, bar chart  
✅ **Budget Alerts** - Get warned at 80% and 100%  
✅ **Export CSV** - Download for Excel/Sheets  
✅ **Dark Mode** - Easy on the eyes  
✅ **Offline** - Works without internet  

## Keyboard Shortcuts

- Focus search: Just start typing on Expenses page
- Close modal: `Esc`
- Navigate forms: `Tab` and `Shift+Tab`
- Submit form: `Enter`

## Tips

💡 **Swipe to delete** - On mobile, swipe expense cards left to delete  
💡 **Click to edit** - Click any expense to edit it  
💡 **Budget warnings** - Set budgets to get alerts when you're overspending  
💡 **Export regularly** - Backup your data by exporting to JSON  
💡 **Custom categories** - Add your own categories with custom icons  

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Dependencies issue?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Need help?** Check `SETUP_INSTRUCTIONS.md` for detailed setup

---

Happy expense tracking! 💰✨

