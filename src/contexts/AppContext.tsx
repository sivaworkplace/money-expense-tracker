import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Income, Investment, Category, Budget, Settings, AppData, BankAccount, SavingsGoal, Tag } from '@/types';
import { storageService } from '@/services/storage';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '@/utils/constants';

interface AppContextType {
  expenses: Expense[];
  incomes: Income[];
  investments: Investment[];
  categories: Category[];
  budget: Budget;
  settings: Settings;
  accounts: BankAccount[];
  savingsGoals: SavingsGoal[];
  tags: Tag[];
  loading: boolean;
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addIncome: (income: Income) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addInvestment: (investment: Investment) => Promise<void>;
  updateInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  updateSettings: (settings: Settings) => Promise<void>;
  addAccount: (account: BankAccount) => Promise<void>;
  updateAccount: (account: BankAccount) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addSavingsGoal: (goal: SavingsGoal) => Promise<void>;
  updateSavingsGoal: (goal: SavingsGoal) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  exportData: () => Promise<AppData>;
  importData: (data: AppData) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budget, setBudget] = useState<Budget>({ monthly: 0, categories: {} });
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const loading = false; // No loading screen - app renders immediately

  useEffect(() => {
    // Initialize app in background - don't block UI
    initializeApp();
  }, []);

  useEffect(() => {
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      await storageService.initialize();
      console.log('Storage initialized, refreshing data...');
      await refreshData();
      console.log('App initialization complete');
    } catch (error) {
      console.error('Error initializing app:', error);
      // Silent error - don't block UI
    }
  };

  const refreshData = async () => {
    try {
      console.log('Refreshing data...');
      const [expensesData, incomesData, investmentsData, categoriesData, budgetData, settingsData, accountsData, goalsData, tagsData] = await Promise.all([
        storageService.getAllExpenses().catch(err => { console.error('Error getting expenses:', err); return []; }),
        storageService.getAllIncomes().catch(err => { console.error('Error getting incomes:', err); return []; }),
        storageService.getAllInvestments().catch(err => { console.error('Error getting investments:', err); return []; }),
        storageService.getAllCategories().catch(err => { console.error('Error getting categories:', err); return DEFAULT_CATEGORIES; }),
        storageService.getBudget().catch(err => { console.error('Error getting budget:', err); return { monthly: 0, categories: {} }; }),
        storageService.getSettings().catch(err => { console.error('Error getting settings:', err); return DEFAULT_SETTINGS; }),
        storageService.getAllAccounts().catch(err => { console.error('Error getting accounts:', err); return []; }),
        storageService.getAllSavingsGoals().catch(err => { console.error('Error getting savings goals:', err); return []; }),
        storageService.getAllTags().catch(err => { console.error('Error getting tags:', err); return []; })
      ]);

      setExpenses(expensesData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setIncomes(incomesData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      setInvestments(investmentsData.sort((a, b) => 
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      ));
      // Ensure categories always has defaults if empty
      setCategories(categoriesData.length > 0 ? categoriesData : DEFAULT_CATEGORIES);
      setBudget(budgetData);
      setSettings(settingsData);
      setAccounts(accountsData);
      setSavingsGoals(goalsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const addExpense = async (expense: Expense) => {
    try {
      await storageService.addExpense(expense);
      setExpenses(prev => [expense, ...prev].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error: any) {
      console.error('Error in addExpense context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const updateExpense = async (expense: Expense) => {
    try {
      await storageService.updateExpense(expense);
      setExpenses(prev => 
        prev.map(e => e.id === expense.id ? expense : e)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    } catch (error: any) {
      console.error('Error in updateExpense context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const deleteExpense = async (id: string) => {
    await storageService.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addCategory = async (category: Category) => {
    await storageService.addCategory(category);
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = async (category: Category) => {
    await storageService.updateCategory(category);
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
    await storageService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateBudget = async (newBudget: Budget) => {
    await storageService.updateBudget(newBudget);
    setBudget(newBudget);
  };

  const updateSettings = async (newSettings: Settings) => {
    await storageService.updateSettings(newSettings);
    setSettings(newSettings);
  };

  const exportData = async (): Promise<AppData> => {
    return await storageService.exportData();
  };

  const importData = async (data: AppData) => {
    await storageService.importData(data);
    await refreshData();
  };

  const clearAllData = async () => {
    await storageService.clearAllData();
    await refreshData();
  };

  const addAccount = async (account: BankAccount) => {
    await storageService.addAccount(account);
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = async (account: BankAccount) => {
    await storageService.updateAccount(account);
    setAccounts(prev => prev.map(a => a.id === account.id ? account : a));
  };

  const deleteAccount = async (id: string) => {
    await storageService.deleteAccount(id);
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const addSavingsGoal = async (goal: SavingsGoal) => {
    await storageService.addSavingsGoal(goal);
    setSavingsGoals(prev => [...prev, goal]);
  };

  const updateSavingsGoal = async (goal: SavingsGoal) => {
    await storageService.updateSavingsGoal(goal);
    setSavingsGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
  };

  const deleteSavingsGoal = async (id: string) => {
    await storageService.deleteSavingsGoal(id);
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const addIncome = async (income: Income) => {
    try {
      await storageService.addIncome(income);
      setIncomes(prev => [income, ...prev].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error: any) {
      console.error('Error in addIncome context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const updateIncome = async (income: Income) => {
    try {
      await storageService.updateIncome(income);
      setIncomes(prev => 
        prev.map(i => i.id === income.id ? income : i)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    } catch (error: any) {
      console.error('Error in updateIncome context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const deleteIncome = async (id: string) => {
    await storageService.deleteIncome(id);
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  const addInvestment = async (investment: Investment) => {
    try {
      await storageService.addInvestment(investment);
      setInvestments(prev => [investment, ...prev].sort((a, b) => 
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      ));
    } catch (error: any) {
      console.error('Error in addInvestment context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const updateInvestment = async (investment: Investment) => {
    try {
      await storageService.updateInvestment(investment);
      setInvestments(prev => 
        prev.map(inv => inv.id === investment.id ? investment : inv)
          .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      );
    } catch (error: any) {
      console.error('Error in updateInvestment context:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  const deleteInvestment = async (id: string) => {
    await storageService.deleteInvestment(id);
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const addTag = async (tag: Tag) => {
    await storageService.addTag(tag);
    setTags(prev => [...prev, tag]);
  };

  const deleteTag = async (id: string) => {
    await storageService.deleteTag(id);
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const value: AppContextType = {
    expenses,
    incomes,
    investments,
    categories,
    budget,
    settings,
    accounts,
    savingsGoals,
    tags,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    addCategory,
    updateCategory,
    deleteCategory,
    updateBudget,
    updateSettings,
    addAccount,
    updateAccount,
    deleteAccount,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addTag,
    deleteTag,
    refreshData,
    exportData,
    importData,
    clearAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

