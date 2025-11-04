import { Category, Settings, Budget, BankAccount, SavingsGoal, Tag, InvestmentType } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense Categories
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍔',
    color: '#FF6B6B',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚗',
    color: '#4ECDC4',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#95E1D3',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#F38181',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '💊',
    color: '#AA96DA',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#FCBAD3',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#A8D8EA',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'personal',
    name: 'Personal Care',
    icon: '💄',
    color: '#FFD93D',
    isCustom: false,
    type: 'expense'
  },
  {
    id: 'others',
    name: 'Others',
    icon: '📦',
    color: '#A0A0A0',
    isCustom: false,
    type: 'both'
  },
  // Income Categories
  {
    id: 'salary',
    name: 'Salary',
    icon: '💰',
    color: '#10B981',
    isCustom: false,
    type: 'income'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💼',
    color: '#3B82F6',
    isCustom: false,
    type: 'income'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '🏢',
    color: '#8B5CF6',
    isCustom: false,
    type: 'income'
  },
  {
    id: 'investment',
    name: 'Investment Returns',
    icon: '📈',
    color: '#F59E0B',
    isCustom: false,
    type: 'income'
  },
  {
    id: 'rental',
    name: 'Rental Income',
    icon: '🏠',
    color: '#EC4899',
    isCustom: false,
    type: 'income'
  },
  {
    id: 'gift',
    name: 'Gift/Bonus',
    icon: '🎁',
    color: '#14B8A6',
    isCustom: false,
    type: 'income'
  }
];

export const DEFAULT_TAGS: Tag[] = [];

export const DEFAULT_SETTINGS: Settings = {
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  colorTheme: 'purple'
};

export const DEFAULT_BUDGET: Budget = {
  monthly: 0,
  categories: {}
};

export const DEFAULT_ACCOUNTS: BankAccount[] = [
  {
    id: 'default_cash',
    name: 'Cash',
    type: 'cash',
    balance: 0,
    currency: 'INR',
    icon: '💵',
    color: '#10B981',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [];

export const ACCOUNT_TYPES = [
  { id: 'savings', name: 'Savings Account', icon: '🏦' },
  { id: 'checking', name: 'Checking Account', icon: '💳' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'investment', name: 'Investment', icon: '📈' },
  { id: 'other', name: 'Other', icon: '💰' }
];

export const INCOME_SOURCES = [
  { id: 'salary', name: 'Salary', icon: '💰' },
  { id: 'freelance', name: 'Freelance Work', icon: '💼' },
  { id: 'business', name: 'Business Income', icon: '🏢' },
  { id: 'investment', name: 'Investment Returns', icon: '📈' },
  { id: 'rental', name: 'Rental Income', icon: '🏠' },
  { id: 'bonus', name: 'Bonus/Commission', icon: '🎁' },
  { id: 'gift', name: 'Gift/Present', icon: '🎁' },
  { id: 'refund', name: 'Refund', icon: '💸' },
  { id: 'other', name: 'Other Income', icon: '💵' }
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'other', name: 'Other', icon: '💰' }
];

export const INVESTMENT_TYPES: Array<{ id: InvestmentType; name: string; icon: string; color: string }> = [
  { id: 'stocks', name: 'Stocks', icon: '📈', color: '#22C55E' },
  { id: 'mutual_funds', name: 'Mutual Funds', icon: '💼', color: '#3B82F6' },
  { id: 'bonds', name: 'Bonds', icon: '📊', color: '#8B5CF6' },
  { id: 'real_estate', name: 'Real Estate', icon: '🏠', color: '#F59E0B' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿', color: '#F97316' },
  { id: 'gold', name: 'Gold', icon: '🥇', color: '#EAB308' },
  { id: 'fd', name: 'Fixed Deposit', icon: '🏦', color: '#06B6D4' },
  { id: 'other', name: 'Other', icon: '💰', color: '#6B7280' }
];

export const INVESTMENT_PLATFORMS = [
  { id: 'zerodha', name: 'Zerodha', icon: '📊' },
  { id: 'groww', name: 'Groww', icon: '🌱' },
  { id: 'upstox', name: 'Upstox', icon: '📈' },
  { id: 'paytm_money', name: 'Paytm Money', icon: '💰' },
  { id: 'angel_one', name: 'Angel One', icon: '😇' },
  { id: 'icici_direct', name: 'ICICI Direct', icon: '🏦' },
  { id: 'hdfc_securities', name: 'HDFC Securities', icon: '🏦' },
  { id: 'sbi', name: 'SBI', icon: '🏦' },
  { id: 'wazirx', name: 'WazirX', icon: '₿' },
  { id: 'coinbase', name: 'Coinbase', icon: '₿' },
  { id: 'other', name: 'Other', icon: '📱' }
];

export const STORAGE_KEY = 'expense_tracker_data';
export const DB_NAME = 'ExpenseTrackerDB';
export const DB_VERSION = 3; // Incremented for new object store: investments
export const EXPENSE_STORE = 'expenses';
export const CATEGORY_STORE = 'categories';
export const SETTINGS_STORE = 'settings';
export const BUDGET_STORE = 'budgets';

