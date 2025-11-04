# 🚀 Quick Start Guide - New Features

## ✨ What's New in v2.0

Your Expense Tracker has been upgraded with powerful new features:

1. **💰 Income Tracking** - Track all your income sources
2. **🏷️ Tags System** - Organize transactions with custom tags
3. **📊 Enhanced Categories** - Categories now support both income and expenses
4. **₹ Rupees Display** - Proper Indian Rupee symbol throughout the app
5. **📈 Better Dashboard** - See income, expenses, and net income at a glance

---

## 🌐 Access Your App

**The development server is running!**

Open your browser and navigate to:
- **Local URL:** http://localhost:5173/
- **Network URL:** Check terminal for network address (if using --host)

---

## 📖 Quick Tutorial

### 1. Adding Your First Income

1. Click on **"Incomes"** tab (💰) in the navigation
2. Click the **"+ Add Income"** button
3. Fill in the details:
   - **Amount:** Enter amount in Rupees (e.g., 50000)
   - **Category:** Select from Salary, Freelance, Business, etc.
   - **Description:** e.g., "Monthly Salary"
   - **Date:** Select the date you received the income
   - **Source:** Choose the income source
   - **Account:** (Optional) Link to a bank account
4. **Add Tags** (Optional):
   - Type a tag name (e.g., "recurring", "taxable")
   - Press Enter or click "Add Tag"
5. Click **"Add income"**

### 2. Using Tags

Tags help you organize transactions beyond categories:

**Common Tag Examples:**
- `recurring` - For regular income/expenses
- `urgent` - For priority items
- `taxable` - For tax-deductible items
- `business` - For business-related transactions
- `personal` - For personal expenses
- `deductible` - For tax deductions

**How to Use:**
- Type a new tag name in any transaction form
- Click "Add Tag" to create it
- Once created, tags appear as quick-add buttons
- Filter transactions by tags using the dropdown

### 3. Enhanced Dashboard

Your dashboard now shows 4 key metrics:

**📊 New Dashboard Cards:**

1. **💸 Expenses This Month** (Red Card)
   - Total amount spent this month
   - Number of expense entries

2. **💰 Income This Month** (Green Card)
   - Total income received this month
   - Number of income entries

3. **📈 Net Income** (Blue Card)
   - Income minus Expenses
   - Green if positive, Red if negative
   - Shows your actual savings/deficit

4. **🎯 Budget Remaining** (Purple Card)
   - Only visible if you've set a monthly budget
   - Shows progress bar

### 4. Managing Categories

Categories can now be income-specific, expense-specific, or both:

**To Create a Category:**
1. Go to **Settings** → Scroll to **Categories**
2. Click **"+ Add Category"**
3. Enter:
   - **Name:** e.g., "Rental Income"
   - **Icon:** Pick an emoji
   - **Color:** Choose a color
   - **Type:** Select "Income", "Expense", or "Both"
4. Click **"Save"**

**Predefined Income Categories:**
- 💵 Salary
- 💼 Freelance
- 🏢 Business
- 📈 Investment Returns
- 🏠 Rental Income
- 🎁 Gift/Bonus

**Predefined Expense Categories:**
- 🍔 Food & Dining
- 🚗 Transport
- 🛍️ Shopping
- 📱 Bills
- ❤️ Health
- 🎬 Entertainment
- And more...

### 5. Filtering & Searching

**On Incomes Page:**
- **Search:** Type keywords to find specific incomes
- **Filter by Category:** Dropdown to filter by income categories
- **Filter by Source:** Dropdown to filter by source (Salary, Freelance, etc.)
- **Filter by Tag:** Dropdown to filter by tags
- **Date Range:** Set start and end dates
- **Sort:** By date or amount

**On Expenses Page:**
- Similar filters available for expenses

### 6. Bank Accounts & Savings (Previously Added)

You can link transactions to bank accounts:

**To Add a Bank Account:**
1. Go to **"Accounts"** tab
2. Click **"+ Add Account"**
3. Enter account details
4. Link expenses/incomes to this account when creating them

**Savings Goals:**
- Set savings targets
- Track progress visually
- Deadline reminders

---

## 🎨 Visual Guide

### Color Coding:
- **🔴 Red** - Expenses, negative balance
- **🟢 Green** - Income, positive balance
- **🔵 Blue** - Net income, general info
- **🟣 Purple** - Budget tracking
- **🎨 Custom** - Category colors

### Navigation:

**Desktop (Sidebar):**
```
🏠 Dashboard
💸 Expenses
💰 Incomes ← NEW
📊 Reports
🏦 Accounts
📈 Budget
⚙️ Settings
```

**Mobile (Bottom Bar):**
```
🏠     💸     💰     📊     ⚙️
Home  Expenses Incomes Reports Settings
```

---

## 💡 Pro Tips

1. **Use Tags Wisely:** Create a consistent tagging system (e.g., all recurring items get "recurring" tag)
2. **Set Up Categories:** Customize categories to match your lifestyle
3. **Link Accounts:** Link transactions to accounts for better tracking
4. **Regular Updates:** Update your incomes and expenses regularly
5. **Check Dashboard:** Start each day by checking your dashboard
6. **Use Filters:** Use date range filters to analyze spending patterns
7. **Budget Alerts:** Set budgets to get alerts when you're close to limits

---

## 📱 Mobile Usage

The app is fully responsive and works great on mobile:
- Bottom navigation for easy thumb access
- Swipe-friendly interface
- Large touch targets
- Optimized for small screens

---

## 🔐 Data & Privacy

- ✅ **100% Local Storage** - No cloud, no server
- ✅ **Offline First** - Works without internet
- ✅ **Your Data Stays Yours** - Never leaves your device
- ✅ **IndexedDB (Web)** - Fast and reliable
- ✅ **Filesystem (Mobile)** - Native storage on phones

---

## 🐛 Troubleshooting

**Server Not Starting?**
```bash
cd /Users/siva-6452/money-expense-tracker
npm run dev
```

**Build Errors?**
```bash
npm run build
```

**Clear Data and Start Fresh?**
```bash
# Go to Settings → Data Management → Clear All Data
```

**Check Browser Console:**
- Press F12 (Chrome/Firefox)
- Look for any error messages
- Take a screenshot if you need help

---

## 🎯 Next Steps

1. **Add Some Test Data:**
   - Add 2-3 income entries
   - Add 5-10 expense entries
   - Create some custom tags
   - View the dashboard

2. **Explore Features:**
   - Try filtering by tags
   - Check the Reports page
   - Set up bank accounts
   - Create a savings goal

3. **Customize:**
   - Add your own categories
   - Adjust your budget
   - Change theme (light/dark)
   - Set your preferred date format

4. **Daily Use:**
   - Record expenses as they happen
   - Track income when received
   - Review weekly reports
   - Adjust budgets monthly

---

## 📚 Full Documentation

For complete technical details, see:
- `INCOME_TAGS_FEATURES.md` - Detailed feature documentation
- `BANK_ACCOUNTS_FEATURES.md` - Bank accounts documentation
- `README.md` - Project overview
- `QUICK_START.md` - Original quick start guide

---

## 🤝 Support

Having issues? Check:
1. Browser console (F12) for errors
2. Terminal output for build errors
3. This quick start guide for usage tips

---

**Enjoy your upgraded Expense Tracker! 🎉**

Start tracking your finances better with income tracking, tags, and enhanced categories!

---

**Version:** 2.0.0
**Updated:** November 2, 2025

