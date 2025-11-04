import React, { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  getExpensesForMonth, 
  getCategorySpending,
  calculateBudgetProgress 
} from '@/utils/calculations';
import { startOfToday, format } from 'date-fns';
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import CategoryIcon from '@/components/CategoryIcon';

interface DashboardProps {
  onAddExpense: () => void;
  onEditExpense: (id: string) => void;
  onNavigate?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddExpense, onEditExpense, onNavigate }) => {
  const { expenses, incomes, investments, accounts, budget, settings, categories } = useApp();
  const today = startOfToday();
  const currentDate = new Date();

  // Calculate stats
  const monthExpenses = useMemo(
    () => getExpensesForMonth(expenses, currentDate),
    [expenses, currentDate]
  );

  const monthIncomes = useMemo(
    () => incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentDate.getMonth() &&
             incomeDate.getFullYear() === currentDate.getFullYear();
    }),
    [incomes, currentDate]
  );

  // Calculate total assets: (All Accounts Balance + Investment Current Value) - Total Expenses
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAssets = totalAccountBalance + totalInvestmentValue - totalExpenses;

  const monthExpenseTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthIncomeTotal = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const todayExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.toDateString() === today.toDateString();
  });
  const todayExpenseTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const budgetProgress = calculateBudgetProgress(monthExpenseTotal, budget.monthly);
  const budgetRemaining = budget.monthly - monthExpenseTotal;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const topCategories = useMemo(() => {
    const categorySpending = getCategorySpending(monthExpenses, categories);
    return categorySpending
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 4);
  }, [monthExpenses, categories]);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || {
      name: 'Unknown',
      icon: '❓',
      color: '#6B7280'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {/* Expenses */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 md:p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">{monthExpenses.length} items</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {formatCurrency(monthExpenseTotal, settings.currency)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ArrowDownRight className="w-3 h-3" />
              <span>{formatCurrency(todayExpenseTotal, settings.currency)} today</span>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 md:p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Income</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">{monthIncomes.length} items</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {formatCurrency(monthIncomeTotal, settings.currency)}
            </p>
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>This month</span>
            </div>
          </div>

          {/* Total Assets */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 md:p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">{accounts.length + investments.length} items</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {formatCurrency(totalAssets, settings.currency)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>Accounts + Investments - Expenses</span>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 md:p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Budget Left</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">{budgetProgress}%</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {formatCurrency(budgetRemaining, settings.currency)}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  budgetProgress < 50 
                    ? 'bg-green-500' 
                    : budgetProgress < 80 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions - 2/3 width */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <button
                onClick={() => onNavigate?.('expenses')}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                View all
              </button>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentExpenses.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    No transactions yet
                  </p>
                  <button
                    onClick={onAddExpense}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    Add your first expense
                  </button>
                </div>
              ) : (
                recentExpenses.map((expense) => {
                  const category = getCategoryInfo(expense.category);
                  return (
                    <button
                      key={expense.id}
                      onClick={() => onEditExpense(expense.id)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <CategoryIcon category={category} size={18} style={{ color: category.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {expense.description || category.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(expense.date, settings.dateFormat)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(expense.amount, settings.currency)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Categories - 1/3 width */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Top Categories
              </h2>
            </div>
            
            <div className="p-4 space-y-4">
              {topCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No data yet
                  </p>
                </div>
              ) : (
                topCategories.map((cat: any) => {
                  const percentage = monthExpenseTotal > 0 
                    ? (cat.amount / monthExpenseTotal * 100).toFixed(0)
                    : 0;
                  
                  return (
                    <div key={cat.category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={cat.category} size={16} style={{ color: cat.category.color }} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {cat.category.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: cat.category.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
