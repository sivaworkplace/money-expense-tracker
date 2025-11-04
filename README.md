# 💰 Expense Tracker

A cross-platform expense tracking application built with React, TypeScript, and Capacitor. Track your expenses offline on web, Android, and iOS with beautiful charts and analytics.

## ✨ Features

- **📊 Dashboard** - Quick overview of your monthly and daily expenses
- **📝 Expense Management** - Add, edit, and delete expenses with validation
- **🔍 Search & Filter** - Find expenses quickly with advanced filters
- **📈 Reports & Analytics** - Visualize spending patterns with interactive charts
- **💰 Budget Tracking** - Set monthly and category budgets with alerts
- **🎨 Category Management** - Customize categories with icons and colors
- **📥 Export/Import** - Export to JSON/CSV and import data
- **🌙 Dark Mode** - Full dark mode support
- **📱 Offline First** - Works completely offline on all platforms
- **🔒 Privacy First** - All data stored locally on your device

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- For Android: Android Studio
- For iOS: Xcode (macOS only)

### Installation

1. **Clone or navigate to the project directory:**
```bash
cd /Users/siva-6452/money-expense-tracker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run in development mode (Web):**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Building for Production

#### Web (PWA)
```bash
npm run build
npm run preview
```

#### Mobile (Android & iOS)

1. **Build the web assets:**
```bash
npm run build
```

2. **Sync with Capacitor:**
```bash
npm run sync
```

3. **Open in native IDE:**

For Android:
```bash
npm run open:android
```

For iOS (macOS only):
```bash
npm run open:ios
```

4. **Build and run from Android Studio or Xcode**

## 📱 Platform Support

- ✅ Web Browsers (Chrome, Firefox, Safari, Edge)
- ✅ Progressive Web App (PWA)
- ✅ Android 5.0+ (API 21+)
- ✅ iOS 13.0+

## 🛠️ Technology Stack

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Mobile
- **Capacitor 5** - Native bridge
- **Capacitor Filesystem** - Local storage on mobile
- **Capacitor Share** - Native sharing

### Storage
- **IndexedDB** - Web storage (via idb)
- **Filesystem API** - Mobile storage (JSON files)

### Visualization
- **Recharts** - Charts and graphs
- **Date-fns** - Date formatting

## 📁 Project Structure

```
money-expense-tracker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   ├── Modal.tsx
│   │   ├── Navigation.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   ├── contexts/            # React contexts
│   │   └── AppContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.ts
│   │   └── useExpenses.ts
│   ├── pages/               # Page components
│   │   ├── Budget.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Expenses.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/            # Business logic
│   │   ├── export.ts
│   │   └── storage.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── calculations.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── android/                 # Android native project (generated)
├── ios/                     # iOS native project (generated)
├── capacitor.config.json    # Capacitor configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## 💾 Data Storage

### Web Platform
- Primary: IndexedDB (via idb library)
- Fallback: localStorage
- Location: Browser storage

### Mobile Platforms
- Storage: JSON files via Capacitor Filesystem API
- Location: App documents directory
- File: `expenses_data.json`

### Data Format
```json
{
  "expenses": [
    {
      "id": "uuid",
      "amount": 250.50,
      "category": "food",
      "description": "Grocery shopping",
      "date": "2025-11-02T10:30:00Z",
      "paymentMethod": "credit_card",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "categories": [...],
  "budgets": {...},
  "settings": {...}
}
```

## 🎨 Customization

### Adding Custom Categories
1. Go to Settings page
2. Click "Add Category"
3. Enter name, select icon and color
4. Save

### Theme
Toggle between light and dark mode in Settings.

### Currency
Support for INR, USD, EUR, GBP. Change in Settings.

## 📊 Features in Detail

### Budget Tracking
- Set monthly budget limit
- Set category-wise budgets
- Visual progress bars
- Alerts at 80% and 100% usage

### Reports
- Date range selection
- Category breakdown (pie chart)
- Spending trend (line chart)
- Payment method analysis (bar chart)
- Daily/monthly averages

### Export/Import
- Export to JSON (full data backup)
- Export to CSV (for Excel/Google Sheets)
- Import from JSON (restore backup)
- Share functionality on mobile

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run sync` - Sync web assets with native projects
- `npm run sync:android` - Sync Android only
- `npm run sync:ios` - Sync iOS only
- `npm run open:android` - Open Android Studio
- `npm run open:ios` - Open Xcode

### Adding New Features

1. Create components in `src/components/`
2. Add pages in `src/pages/`
3. Update types in `src/types/`
4. Add utilities in `src/utils/`
5. Update storage service if needed

## 🐛 Troubleshooting

### App won't load
- Clear browser cache and IndexedDB
- Check console for errors
- Ensure all dependencies are installed

### Data not saving
- Check browser storage permissions
- On mobile, check app permissions
- Try export/import to backup data

### Build errors
- Run `npm install` to update dependencies
- Clear `node_modules` and reinstall
- Check Node.js version (16+ required)

### Mobile build issues
- Ensure Android Studio / Xcode is properly installed
- Run `npm run sync` before opening native IDE
- Check Capacitor documentation for platform-specific issues

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📮 Support

For issues and questions, please create an issue on the GitHub repository.

## 🙏 Acknowledgments

- Built with React and Capacitor
- Icons from Unicode emoji set
- Charts powered by Recharts
- Styling with Tailwind CSS

---

Made with ❤️ for tracking expenses offline

