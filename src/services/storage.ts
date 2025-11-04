import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { AppData, Expense, Income, Investment, Category, Budget, Settings, BankAccount, SavingsGoal, Tag } from '@/types';
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_BUDGET, DEFAULT_ACCOUNTS, DEFAULT_SAVINGS_GOALS, DEFAULT_TAGS, DB_NAME, DB_VERSION, EXPENSE_STORE, CATEGORY_STORE, SETTINGS_STORE, BUDGET_STORE } from '@/utils/constants';

interface ExpenseTrackerDB extends DBSchema {
  expenses: {
    key: string;
    value: Expense;
    indexes: { 'by-date': string; 'by-category': string };
  };
  incomes: {
    key: string;
    value: Income;
    indexes: { 'by-date': string; 'by-category': string };
  };
  investments: {
    key: string;
    value: Investment;
    indexes: { 'by-purchase-date': string; 'by-type': string };
  };
  categories: {
    key: string;
    value: Category;
  };
  settings: {
    key: string;
    value: Settings;
  };
  budgets: {
    key: string;
    value: Budget;
  };
  accounts: {
    key: string;
    value: BankAccount;
  };
  savingsGoals: {
    key: string;
    value: SavingsGoal;
  };
  tags: {
    key: string;
    value: Tag;
  };
}

class StorageService {
  private db: IDBPDatabase<ExpenseTrackerDB> | null = null;
  private isNative = Capacitor.isNativePlatform();
  private readonly FILENAME = 'expenses_data.json';
  private preferredDirectory: Directory = Directory.Data;

  async initialize(): Promise<void> {
    if (this.isNative) {
      await this.initializeFileSystem();
    } else {
      await this.initializeIndexedDB();
    }
  }

  private async initializeIndexedDB(): Promise<void> {
    try {
      this.db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
          console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
          
          // Create expenses store
          if (!db.objectStoreNames.contains(EXPENSE_STORE)) {
            const expenseStore = db.createObjectStore(EXPENSE_STORE, { keyPath: 'id' });
            expenseStore.createIndex('by-date', 'date');
            expenseStore.createIndex('by-category', 'category');
          }

          // Create categories store
          if (!db.objectStoreNames.contains(CATEGORY_STORE)) {
            db.createObjectStore(CATEGORY_STORE, { keyPath: 'id' });
          }

          // Create settings store
          if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
            db.createObjectStore(SETTINGS_STORE);
          }

          // Create budgets store
          if (!db.objectStoreNames.contains(BUDGET_STORE)) {
            db.createObjectStore(BUDGET_STORE);
          }

          // Create accounts store (version 2+)
          if (oldVersion < 2 && !db.objectStoreNames.contains('accounts')) {
            db.createObjectStore('accounts', { keyPath: 'id' });
          }

          // Create savings goals store (version 2+)
          if (oldVersion < 2 && !db.objectStoreNames.contains('savingsGoals')) {
            db.createObjectStore('savingsGoals', { keyPath: 'id' });
          }

          // Create incomes store (version 2+)
          if (oldVersion < 2 && !db.objectStoreNames.contains('incomes')) {
            const incomeStore = db.createObjectStore('incomes', { keyPath: 'id' });
            incomeStore.createIndex('by-date', 'date');
            incomeStore.createIndex('by-category', 'category');
          }

          // Create tags store (version 2+)
          if (oldVersion < 2 && !db.objectStoreNames.contains('tags')) {
            db.createObjectStore('tags', { keyPath: 'id' });
          }

          // Create investments store (version 3+)
          if (oldVersion < 3 && !db.objectStoreNames.contains('investments')) {
            const investmentStore = db.createObjectStore('investments', { keyPath: 'id' });
            investmentStore.createIndex('by-purchase-date', 'purchaseDate');
            investmentStore.createIndex('by-type', 'type');
            console.log('Created investments store');
          }
        },
        blocked() {
          console.warn('Database upgrade blocked - another tab might be open');
        },
        blocking() {
          console.warn('Database upgrade blocking - closing other connections');
        },
      });
      console.log('IndexedDB initialized successfully');
      
      // Initialize with defaults if empty
      const existingSettings = await this.db.get(SETTINGS_STORE, 'settings');
    if (!existingSettings) {
      await this.db.put(SETTINGS_STORE, DEFAULT_SETTINGS, 'settings');
    }

    const existingBudget = await this.db.get(BUDGET_STORE, 'budget');
    if (!existingBudget) {
      await this.db.put(BUDGET_STORE, DEFAULT_BUDGET, 'budget');
    }

    const existingCategories = await this.db.getAll(CATEGORY_STORE);
    if (existingCategories.length === 0) {
      for (const category of DEFAULT_CATEGORIES) {
        await this.db.put(CATEGORY_STORE, category);
      }
    }

    const existingAccounts = await this.db.getAll('accounts');
    if (existingAccounts.length === 0) {
      for (const account of DEFAULT_ACCOUNTS) {
        await this.db.put('accounts', account);
      }
    }
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
      throw error;
    }
  }

  private async initializeFileSystem(): Promise<void> {
    try {
      const data = await this.loadFromFile();
      if (!data) {
        // Initialize with defaults
        await this.saveToFile({
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        });
      } else {
        // Ensure categories are initialized even if data exists but categories are empty
        if (!data.categories || data.categories.length === 0) {
          data.categories = DEFAULT_CATEGORIES;
          await this.saveToFile(data);
        }
        // Ensure accounts are initialized
        if (!data.accounts || data.accounts.length === 0) {
          data.accounts = DEFAULT_ACCOUNTS;
          await this.saveToFile(data);
        }
      }
    } catch (error) {
      console.error('Error initializing file system:', error);
      // Initialize with defaults if file doesn't exist
      await this.saveToFile({
        expenses: [],
        investments: [],
        incomes: [],
        categories: DEFAULT_CATEGORIES,
        budgets: DEFAULT_BUDGET,
        settings: DEFAULT_SETTINGS,
        accounts: DEFAULT_ACCOUNTS,
        savingsGoals: DEFAULT_SAVINGS_GOALS,
        transactions: [],
        tags: DEFAULT_TAGS
      });
    }
  }

  // Expense operations
  async getAllExpenses(): Promise<Expense[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.expenses || [];
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.getAll(EXPENSE_STORE);
    }
  }

  async getExpenseById(id: string): Promise<Expense | undefined> {
    if (this.isNative) {
      const expenses = await this.getAllExpenses();
      return expenses.find(e => e.id === id);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.get(EXPENSE_STORE, id);
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      if (this.isNative) {
        let data = await this.loadFromFile();
        if (!data) {
          // Initialize with defaults if file doesn't exist
          data = {
            expenses: [],
            incomes: [],
            investments: [],
            categories: DEFAULT_CATEGORIES,
            budgets: DEFAULT_BUDGET,
            settings: DEFAULT_SETTINGS,
            accounts: DEFAULT_ACCOUNTS,
            savingsGoals: DEFAULT_SAVINGS_GOALS,
            transactions: [],
            tags: DEFAULT_TAGS
          };
        }
        data.expenses.push(expense);
        await this.saveToFile(data);
        console.log('Expense saved successfully:', expense.id);
      } else {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put(EXPENSE_STORE, expense);
        console.log('Expense saved to IndexedDB:', expense.id);
      }
    } catch (error: any) {
      console.error('Error in addExpense:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      throw new Error(`Failed to save expense: ${error?.message || 'Unknown error'}`);
    }
  }

  async updateExpense(expense: Expense): Promise<void> {
    try {
      if (this.isNative) {
        let data = await this.loadFromFile();
        if (!data) {
          throw new Error('Cannot update expense: data file not found');
        }
        const index = data.expenses.findIndex(e => e.id === expense.id);
        if (index !== -1) {
          data.expenses[index] = expense;
          await this.saveToFile(data);
          console.log('Expense updated successfully:', expense.id);
        } else {
          throw new Error(`Expense with id ${expense.id} not found`);
        }
      } else {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put(EXPENSE_STORE, expense);
        console.log('Expense updated in IndexedDB:', expense.id);
      }
    } catch (error: any) {
      console.error('Error in updateExpense:', error);
      throw new Error(`Failed to update expense: ${error?.message || 'Unknown error'}`);
    }
  }

  async deleteExpense(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.expenses = data.expenses.filter(e => e.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete(EXPENSE_STORE, id);
    }
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    let categories: Category[];
    
    if (this.isNative) {
      const data = await this.loadFromFile();
      categories = data?.categories || [];
      
      // If categories array is empty, initialize with defaults
      if (categories.length === 0) {
        categories = DEFAULT_CATEGORIES;
        // Save defaults to file
        if (data) {
          data.categories = DEFAULT_CATEGORIES;
          await this.saveToFile(data);
        } else {
          await this.saveToFile({
            expenses: [],
            incomes: [],
            investments: [],
            categories: DEFAULT_CATEGORIES,
            budgets: DEFAULT_BUDGET,
            settings: DEFAULT_SETTINGS,
            accounts: DEFAULT_ACCOUNTS,
            savingsGoals: DEFAULT_SAVINGS_GOALS,
            transactions: [],
            tags: DEFAULT_TAGS
          });
        }
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      categories = await this.db.getAll(CATEGORY_STORE);
      
      // If no categories in IndexedDB, initialize with defaults
      if (categories.length === 0) {
        for (const category of DEFAULT_CATEGORIES) {
          await this.db.put(CATEGORY_STORE, category);
        }
        categories = DEFAULT_CATEGORIES;
      }
    }

    // Migration: Add type field to categories that don't have it
    let needsUpdate = false;
    const migratedCategories = categories.map(cat => {
      if (!cat.type) {
        needsUpdate = true;
        // Default to 'both' for existing categories without type
        return { ...cat, type: 'both' as const };
      }
      return cat;
    });

    // Save migrated categories back to storage
    if (needsUpdate && migratedCategories.length > 0) {
      for (const cat of migratedCategories) {
        await this.updateCategory(cat);
      }
    }

    // Always return categories (migrated or defaults)
    if (migratedCategories.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    
    return migratedCategories;
  }

  async addCategory(category: Category): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.categories.push(category);
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put(CATEGORY_STORE, category);
    }
  }

  async updateCategory(category: Category): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        const index = data.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          data.categories[index] = category;
          await this.saveToFile(data);
        }
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put(CATEGORY_STORE, category);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.categories = data.categories.filter(c => c.id !== id);
        // Ensure we don't delete all default categories - re-add defaults if empty
        if (data.categories.length === 0) {
          data.categories = DEFAULT_CATEGORIES;
        }
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete(CATEGORY_STORE, id);
      
      // Ensure we don't delete all default categories - re-add defaults if empty
      const remainingCategories = await this.db.getAll(CATEGORY_STORE);
      if (remainingCategories.length === 0) {
        for (const category of DEFAULT_CATEGORIES) {
          await this.db.put(CATEGORY_STORE, category);
        }
      }
    }
  }

  // Budget operations
  async getBudget(): Promise<Budget> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.budgets || DEFAULT_BUDGET;
    } else {
      if (!this.db) throw new Error('Database not initialized');
      const budget = await this.db.get(BUDGET_STORE, 'budget');
      return budget || DEFAULT_BUDGET;
    }
  }

  async updateBudget(budget: Budget): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.budgets = budget;
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put(BUDGET_STORE, budget, 'budget');
    }
  }

  // Settings operations
  async getSettings(): Promise<Settings> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      const settings = data?.settings || DEFAULT_SETTINGS;
      
      // Migration: Add colorTheme if missing
      if (!settings.colorTheme) {
        settings.colorTheme = 'purple';
        if (data) {
          data.settings = settings;
          await this.saveToFile(data);
        }
      }
      
      return settings;
    } else {
      if (!this.db) throw new Error('Database not initialized');
      const settings = await this.db.get(SETTINGS_STORE, 'settings');
      const finalSettings = settings || DEFAULT_SETTINGS;
      
      // Migration: Add colorTheme if missing
      if (!finalSettings.colorTheme) {
        finalSettings.colorTheme = 'purple';
        await this.db.put(SETTINGS_STORE, finalSettings, 'settings');
      }
      
      return finalSettings;
    }
  }

  async updateSettings(settings: Settings): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.settings = settings;
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put(SETTINGS_STORE, settings, 'settings');
    }
  }

  // Account operations
  async getAllAccounts(): Promise<BankAccount[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.accounts || DEFAULT_ACCOUNTS;
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.getAll('accounts');
    }
  }

  async addAccount(account: BankAccount): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.accounts.push(account);
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('accounts', account);
    }
  }

  async updateAccount(account: BankAccount): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        const index = data.accounts.findIndex(a => a.id === account.id);
        if (index !== -1) {
          data.accounts[index] = account;
          await this.saveToFile(data);
        }
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('accounts', account);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.accounts = data.accounts.filter(a => a.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete('accounts', id);
    }
  }

  // Savings Goal operations
  async getAllSavingsGoals(): Promise<SavingsGoal[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.savingsGoals || DEFAULT_SAVINGS_GOALS;
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.getAll('savingsGoals');
    }
  }

  async addSavingsGoal(goal: SavingsGoal): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.savingsGoals.push(goal);
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('savingsGoals', goal);
    }
  }

  async updateSavingsGoal(goal: SavingsGoal): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        const index = data.savingsGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          data.savingsGoals[index] = goal;
          await this.saveToFile(data);
        }
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('savingsGoals', goal);
    }
  }

  async deleteSavingsGoal(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.savingsGoals = data.savingsGoals.filter(g => g.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete('savingsGoals', id);
    }
  }

  // Income operations
  async getAllIncomes(): Promise<Income[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.incomes || [];
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.getAll('incomes');
    }
  }

  async addIncome(income: Income): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        // Initialize with defaults if file doesn't exist
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.incomes.push(income);
      await this.saveToFile(data);
      console.log('Income saved successfully:', income.id);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('incomes', income);
      console.log('Income saved to IndexedDB:', income.id);
    }
  }

  async updateIncome(income: Income): Promise<void> {
    try {
      if (this.isNative) {
        let data = await this.loadFromFile();
        if (!data) {
          throw new Error('Cannot update income: data file not found');
        }
        const index = data.incomes.findIndex(i => i.id === income.id);
        if (index !== -1) {
          data.incomes[index] = income;
          await this.saveToFile(data);
          console.log('Income updated successfully:', income.id);
        } else {
          throw new Error(`Income with id ${income.id} not found`);
        }
      } else {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.put('incomes', income);
        console.log('Income updated in IndexedDB:', income.id);
      }
    } catch (error: any) {
      console.error('Error in updateIncome:', error);
      throw new Error(`Failed to update income: ${error?.message || 'Unknown error'}`);
    }
  }

  async deleteIncome(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.incomes = data.incomes.filter(i => i.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete('incomes', id);
    }
  }

  // Investment operations
  async getAllInvestments(): Promise<Investment[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.investments || [];
    } else {
      if (!this.db) throw new Error('Database not initialized');
      // Check if investments store exists (for database migration)
      if (!this.db.objectStoreNames.contains('investments')) {
        console.warn('Investments store not found - returning empty array');
        return [];
      }
      return await this.db.getAll('investments');
    }
  }

  async addInvestment(investment: Investment): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        // Initialize with defaults if file doesn't exist
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.investments.push(investment);
      await this.saveToFile(data);
      console.log('Investment saved successfully:', investment.id);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('investments', investment);
      console.log('Investment saved to IndexedDB:', investment.id);
    }
  }

  async updateInvestment(investment: Investment): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        throw new Error('Cannot update investment: data file not found');
      }
      const index = data.investments.findIndex(inv => inv.id === investment.id);
      if (index !== -1) {
        data.investments[index] = investment;
        await this.saveToFile(data);
        console.log('Investment updated successfully:', investment.id);
      } else {
        throw new Error(`Investment with id ${investment.id} not found`);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('investments', investment);
      console.log('Investment updated in IndexedDB:', investment.id);
    }
  }

  async deleteInvestment(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.investments = data.investments.filter(inv => inv.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete('investments', id);
    }
  }

  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data?.tags || DEFAULT_TAGS;
    } else {
      if (!this.db) throw new Error('Database not initialized');
      return await this.db.getAll('tags');
    }
  }

  async addTag(tag: Tag): Promise<void> {
    if (this.isNative) {
      let data = await this.loadFromFile();
      if (!data) {
        data = {
          expenses: [],
          incomes: [],
          investments: [],
          categories: DEFAULT_CATEGORIES,
          budgets: DEFAULT_BUDGET,
          settings: DEFAULT_SETTINGS,
          accounts: DEFAULT_ACCOUNTS,
          savingsGoals: DEFAULT_SAVINGS_GOALS,
          transactions: [],
          tags: DEFAULT_TAGS
        };
      }
      data.tags.push(tag);
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.put('tags', tag);
    }
  }

  async deleteTag(id: string): Promise<void> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      if (data) {
        data.tags = data.tags.filter(t => t.id !== id);
        await this.saveToFile(data);
      }
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.delete('tags', id);
    }
  }

  // Export/Import operations
  async exportData(): Promise<AppData> {
    if (this.isNative) {
      const data = await this.loadFromFile();
      return data || {
        expenses: [],
        incomes: [],
        investments: [],
        categories: DEFAULT_CATEGORIES,
        budgets: DEFAULT_BUDGET,
        settings: DEFAULT_SETTINGS,
        accounts: DEFAULT_ACCOUNTS,
        savingsGoals: DEFAULT_SAVINGS_GOALS,
        transactions: [],
        tags: DEFAULT_TAGS
      };
    } else {
      if (!this.db) throw new Error('Database not initialized');
      const expenses = await this.db.getAll(EXPENSE_STORE);
      const incomes = await this.db.getAll('incomes');
      const investments = await this.db.getAll('investments');
      const categories = await this.db.getAll(CATEGORY_STORE);
      const budgets = (await this.db.get(BUDGET_STORE, 'budget')) || DEFAULT_BUDGET;
      const settings = (await this.db.get(SETTINGS_STORE, 'settings')) || DEFAULT_SETTINGS;
      const accounts = await this.db.getAll('accounts');
      const savingsGoals = await this.db.getAll('savingsGoals');
      const tags = await this.db.getAll('tags');
      
      return { expenses, incomes, investments, categories, budgets, settings, accounts, savingsGoals, transactions: [], tags };
    }
  }

  async importData(data: AppData): Promise<void> {
    if (this.isNative) {
      await this.saveToFile(data);
    } else {
      if (!this.db) throw new Error('Database not initialized');
      
      // Clear existing data
      await this.db.clear(EXPENSE_STORE);
      await this.db.clear('incomes');
      await this.db.clear('investments');
      await this.db.clear(CATEGORY_STORE);
      await this.db.clear('accounts');
      await this.db.clear('savingsGoals');
      await this.db.clear('tags');
      
      // Import new data
      for (const expense of data.expenses) {
        await this.db.put(EXPENSE_STORE, expense);
      }
      if (data.incomes) {
        for (const income of data.incomes) {
          await this.db.put('incomes', income);
        }
      }
      if (data.investments) {
        for (const investment of data.investments) {
          await this.db.put('investments', investment);
        }
      }
      for (const category of data.categories) {
        await this.db.put(CATEGORY_STORE, category);
      }
      if (data.accounts) {
        for (const account of data.accounts) {
          await this.db.put('accounts', account);
        }
      }
      if (data.savingsGoals) {
        for (const goal of data.savingsGoals) {
          await this.db.put('savingsGoals', goal);
        }
      }
      if (data.tags) {
        for (const tag of data.tags) {
          await this.db.put('tags', tag);
        }
      }
      await this.db.put(BUDGET_STORE, data.budgets, 'budget');
      await this.db.put(SETTINGS_STORE, data.settings, 'settings');
    }
  }

  async clearAllData(): Promise<void> {
    if (this.isNative) {
      await this.saveToFile({
        expenses: [],
        incomes: [],
        investments: [],
        categories: DEFAULT_CATEGORIES,
        budgets: DEFAULT_BUDGET,
        settings: DEFAULT_SETTINGS,
        accounts: DEFAULT_ACCOUNTS,
        savingsGoals: DEFAULT_SAVINGS_GOALS,
        transactions: [],
        tags: DEFAULT_TAGS
      });
    } else {
      if (!this.db) throw new Error('Database not initialized');
      await this.db.clear(EXPENSE_STORE);
      await this.db.clear('incomes');
      await this.db.clear('investments');
      await this.db.clear(CATEGORY_STORE);
      await this.db.clear('accounts');
      await this.db.clear('savingsGoals');
      await this.db.clear('tags');
      await this.db.put(BUDGET_STORE, DEFAULT_BUDGET, 'budget');
      await this.db.put(SETTINGS_STORE, DEFAULT_SETTINGS, 'settings');
      
      // Re-add default categories
      for (const category of DEFAULT_CATEGORIES) {
        await this.db.put(CATEGORY_STORE, category);
      }
      // Re-add default accounts
      for (const account of DEFAULT_ACCOUNTS) {
        await this.db.put('accounts', account);
      }
    }
  }

  // File system operations (for native platforms)
  private async loadFromFile(): Promise<AppData | null> {
    // Try Data directory first (our preferred directory)
    try {
      const result = await Filesystem.readFile({
        path: this.FILENAME,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      const data = JSON.parse(result.data as string);
      console.log('File loaded successfully from Data directory:', this.FILENAME, 'Expenses:', data?.expenses?.length || 0, 'Incomes:', data?.incomes?.length || 0);
      this.preferredDirectory = Directory.Data;
      return data;
    } catch (dataError: any) {
      // Try Documents directory as fallback
      try {
        const result = await Filesystem.readFile({
          path: this.FILENAME,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        
        const data = JSON.parse(result.data as string);
        console.log('File loaded successfully from Documents directory:', this.FILENAME);
        this.preferredDirectory = Directory.Documents;
        return data;
      } catch (docError: any) {
        // Try Cache directory as last resort
        try {
          const result = await Filesystem.readFile({
            path: this.FILENAME,
            directory: Directory.Cache,
            encoding: Encoding.UTF8
          });
          
          const data = JSON.parse(result.data as string);
          console.log('File loaded successfully from Cache directory:', this.FILENAME);
          this.preferredDirectory = Directory.Cache;
          return data;
        } catch (cacheError: any) {
          // File doesn't exist or other error - this is normal on first run
          if (cacheError.message?.includes('does not exist') || cacheError.code === 'NOT_FOUND' ||
              docError.message?.includes('does not exist') || docError.code === 'NOT_FOUND' ||
              dataError.message?.includes('does not exist') || dataError.code === 'NOT_FOUND') {
            console.log('Data file does not exist yet, will be created on first save');
          } else {
            console.error('Error loading from file (all directories tried):', {
              dataError: dataError?.message,
              docError: docError?.message,
              cacheError: cacheError?.message
            });
          }
          return null;
        }
      }
    }
  }

  private async saveToFile(data: AppData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      console.log('Attempting to save file:', this.FILENAME, 'Size:', jsonData.length, 'bytes');
      
      // Use preferred directory if we've successfully used one before, otherwise try Data first
      const directoriesToTry = this.preferredDirectory ? [this.preferredDirectory] : [Directory.Data, Directory.Documents, Directory.Cache];
      
      let lastError: any = null;
      for (const directory of directoriesToTry) {
        try {
          await Filesystem.writeFile({
            path: this.FILENAME,
            data: jsonData,
            directory: directory,
            encoding: Encoding.UTF8,
            recursive: true
          });
          console.log(`File saved successfully to ${directory} directory:`, this.FILENAME);
          this.preferredDirectory = directory;
          return;
        } catch (dirError: any) {
          console.log(`${directory} directory failed:`, dirError?.message);
          lastError = dirError;
          // Continue to next directory
          continue;
        }
      }
      
      // If all directories failed, throw error with details
      const dirNames = directoriesToTry.map(d => {
        if (d === Directory.Data) return 'Data';
        if (d === Directory.Documents) return 'Documents';
        if (d === Directory.Cache) return 'Cache';
        return 'Unknown';
      }).join(', ');
      throw new Error(`Failed to save file to any directory (tried: ${dirNames}). Last error: ${lastError?.message || 'Unknown error'}`);
    } catch (error: any) {
      console.error('Critical error in saveToFile:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      throw new Error(`Failed to save data: ${error?.message || 'Unknown error'}`);
    }
  }
}

export const storageService = new StorageService();

