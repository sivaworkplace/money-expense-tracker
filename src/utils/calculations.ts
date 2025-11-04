import { Expense, ExpenseStats, MonthlyStats, BudgetAlert, Budget } from '@/types';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';

export const calculateExpenseStats = (expenses: Expense[]): ExpenseStats => {
  if (expenses.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      byCategory: {},
      byPaymentMethod: {}
    };
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory: Record<string, number> = {};
  const byPaymentMethod: Record<string, number> = {};

  expenses.forEach(expense => {
    byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    byPaymentMethod[expense.paymentMethod] = (byPaymentMethod[expense.paymentMethod] || 0) + expense.amount;
  });

  return {
    total,
    count: expenses.length,
    average: total / expenses.length,
    byCategory,
    byPaymentMethod
  };
};

export const getExpensesForMonth = (expenses: Expense[], date: Date): Expense[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

export const getExpensesForToday = (expenses: Expense[]): Expense[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return expenses.filter(expense => {
    const expenseDate = format(parseISO(expense.date), 'yyyy-MM-dd');
    return expenseDate === today;
  });
};

export const getExpensesForDateRange = (
  expenses: Expense[],
  startDate: Date,
  endDate: Date
): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start: startDate, end: endDate });
  });
};

export const getMonthlyStats = (expenses: Expense[]): MonthlyStats[] => {
  const monthMap: Record<string, Expense[]> = {};

  expenses.forEach(expense => {
    const month = format(parseISO(expense.date), 'yyyy-MM');
    if (!monthMap[month]) {
      monthMap[month] = [];
    }
    monthMap[month].push(expense);
  });

  return Object.entries(monthMap)
    .map(([month, monthExpenses]) => {
      const stats = calculateExpenseStats(monthExpenses);
      return {
        month,
        total: stats.total,
        count: stats.count,
        byCategory: stats.byCategory
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month));
};

export const calculateBudgetAlerts = (
  expenses: Expense[],
  budget: Budget,
  currentMonth: Date
): BudgetAlert[] => {
  const alerts: BudgetAlert[] = [];
  const monthExpenses = getExpensesForMonth(expenses, currentMonth);
  const stats = calculateExpenseStats(monthExpenses);

  // Check monthly budget
  if (budget.monthly > 0) {
    const percentage = (stats.total / budget.monthly) * 100;
    
    if (percentage >= 100) {
      alerts.push({
        type: 'exceeded',
        message: `Monthly budget exceeded by ${formatCurrency(stats.total - budget.monthly)}`,
        percentage
      });
    } else if (percentage >= 80) {
      alerts.push({
        type: 'warning',
        message: `${percentage.toFixed(0)}% of monthly budget used`,
        percentage
      });
    }
  }

  // Check category budgets
  Object.entries(budget.categories).forEach(([category, categoryBudget]) => {
    if (categoryBudget > 0) {
      const categoryTotal = stats.byCategory[category] || 0;
      const percentage = (categoryTotal / categoryBudget) * 100;
      
      if (percentage >= 100) {
        alerts.push({
          type: 'exceeded',
          category,
          message: `${category} budget exceeded`,
          percentage
        });
      } else if (percentage >= 80) {
        alerts.push({
          type: 'warning',
          category,
          message: `${percentage.toFixed(0)}% of ${category} budget used`,
          percentage
        });
      }
    }
  });

  return alerts;
};

export const getTrendData = (expenses: Expense[], months: number = 6): Array<{ month: string; amount: number }> => {
  const monthMap: Record<string, number> = {};
  
  expenses.forEach(expense => {
    const month = format(parseISO(expense.date), 'MMM yyyy');
    monthMap[month] = (monthMap[month] || 0) + expense.amount;
  });

  return Object.entries(monthMap)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-months);
};

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2);
};

export const getCategorySpending = (expenses: Expense[], categories: any[]): Array<{ category: any; amount: number }> => {
  const categoryMap: Record<string, number> = {};
  
  expenses.forEach(expense => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
  });

  return Object.entries(categoryMap).map(([catId, amount]) => {
    const category = categories.find(c => c.id === catId) || {
      id: catId,
      name: 'Unknown',
      icon: '❓',
      color: '#6B7280',
      isCustom: false,
      type: 'both'
    };
    return { category, amount };
  });
};

export const calculateBudgetProgress = (spent: number, budget: number): number => {
  if (budget <= 0) return 0;
  return Math.round((spent / budget) * 100);
};

