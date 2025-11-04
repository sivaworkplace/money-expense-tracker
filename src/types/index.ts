export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'upi' | 'bank_transfer' | 'other';

export type CategoryId = 'food' | 'transport' | 'shopping' | 'bills' | 'health' | 'entertainment' | 'education' | 'personal' | 'others' | string;

export type AccountType = 'savings' | 'checking' | 'credit_card' | 'cash' | 'investment' | 'other';

export type InvestmentType = 'stocks' | 'mutual_funds' | 'bonds' | 'real_estate' | 'crypto' | 'gold' | 'fd' | 'other';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number; // Invested amount
  currentValue: number; // Current market value
  quantity?: number; // For stocks, crypto, etc.
  purchaseDate: string;
  platform?: string; // Where it's invested (e.g., "Zerodha", "Groww")
  notes?: string;
  tags?: string[];
  imagePath?: string; // Path to attached photo (certificate/statement)
  returns: number; // Calculated: currentValue - amount
  returnsPercentage: number; // Calculated: ((currentValue - amount) / amount) * 100
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  fromAccountId?: string;
  toAccountId?: string;
  category?: CategoryId;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
  accountId?: string; // Link to bank account
  tags?: string[]; // Tags for expense
  imagePath?: string; // Path to attached photo (bill/receipt)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Income {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO string
  source: string; // Income source (salary, freelance, etc)
  accountId?: string; // Link to bank account
  tags?: string[]; // Tags for income
  imagePath?: string; // Path to attached photo (receipt/documents)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type CategoryType = 'expense' | 'income' | 'both';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  isCustom: boolean;
  type: CategoryType; // expense, income, or both
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Budget {
  monthly: number;
  categories: Record<string, number>;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';
export type Theme = 'light' | 'dark';
export type ColorTheme = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red' | 'indigo' | 'teal';

export interface Settings {
  currency: Currency;
  dateFormat: DateFormat;
  theme: Theme;
  colorTheme: ColorTheme;
}

export interface AppData {
  expenses: Expense[];
  incomes: Income[];
  investments: Investment[];
  categories: Category[];
  budgets: Budget;
  settings: Settings;
  accounts: BankAccount[];
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
  tags: Tag[];
}

export interface FilterOptions {
  searchTerm?: string;
  categoryId?: CategoryId;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'category';

export interface ExpenseStats {
  total: number;
  count: number;
  average: number;
  byCategory: Record<string, number>;
  byPaymentMethod: Record<string, number>;
}

export interface MonthlyStats {
  month: string;
  total: number;
  count: number;
  byCategory: Record<string, number>;
}

export interface BudgetAlert {
  type: 'warning' | 'exceeded';
  category?: string;
  message: string;
  percentage: number;
}

