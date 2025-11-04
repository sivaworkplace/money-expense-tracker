import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import Select from '@/components/Select';
import { formatCurrency } from '@/utils/formatters';
import {
  getExpensesForDateRange,
  calculateExpenseStats,
  getExpensesForMonth
} from '@/utils/calculations';
import { INVESTMENT_TYPES } from '@/utils/constants';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import { startOfMonth, endOfMonth, subMonths, format, getDay } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  LineChart as LineChartIcon
} from 'lucide-react';

const Reports: React.FC = () => {
  const { expenses, incomes, investments, categories, settings, budget } = useApp();
  const [dateRange, setDateRange] = useState('current-month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    
    switch (dateRange) {
      case 'current-month':
        return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) };
      case 'last-3-months':
        return { startDate: subMonths(now, 3), endDate: now };
      case 'last-6-months':
        return { startDate: subMonths(now, 6), endDate: now };
      case 'custom':
        return {
          startDate: customStartDate ? new Date(customStartDate) : startOfMonth(now),
          endDate: customEndDate ? new Date(customEndDate) : now
        };
      default:
        return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    }
  }, [dateRange, customStartDate, customEndDate]);

  const filteredExpenses = useMemo(() => {
    return getExpensesForDateRange(expenses, startDate, endDate);
  }, [expenses, startDate, endDate]);

  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startDate && incomeDate <= endDate;
    });
  }, [incomes, startDate, endDate]);

  const stats = useMemo(() => {
    return calculateExpenseStats(filteredExpenses);
  }, [filteredExpenses]);

  // Income vs Expense Data
  const incomeVsExpense = useMemo(() => {
    const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = stats.total;
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, savings, savingsRate };
  }, [filteredIncomes, stats.total]);

  // Previous Period Comparison
  const previousPeriodComparison = useMemo(() => {
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - daysDiff);
    const prevEndDate = new Date(startDate);
    
    const prevExpenses = getExpensesForDateRange(expenses, prevStartDate, prevEndDate);
    const prevTotal = prevExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const change = stats.total - prevTotal;
    const changePercent = prevTotal > 0 ? (change / prevTotal) * 100 : 0;

    return { prevTotal, change, changePercent };
  }, [expenses, startDate, endDate, stats.total]);

  // Category Data
  const categoryData = useMemo(() => {
    return Object.entries(stats.byCategory).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || categoryId,
        value: amount,
        icon: category?.icon || '📦',
        color: category?.color || '#A0A0A0'
      };
    }).sort((a, b) => b.value - a.value);
  }, [stats.byCategory, categories]);

  // Spending by Day of Week
  const dayOfWeekData = useMemo(() => {
    const daysMap: Record<number, number> = {};
    const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    filteredExpenses.forEach(expense => {
      const day = getDay(new Date(expense.date));
      daysMap[day] = (daysMap[day] || 0) + expense.amount;
    });

    return daysLabels.map((label, index) => ({
      name: label,
      amount: daysMap[index] || 0
    }));
  }, [filteredExpenses]);

  // Top Spending Days
  const topSpendingDays = useMemo(() => {
    const daysMap: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      const dateKey = format(new Date(expense.date), 'MMM dd, yyyy');
      daysMap[dateKey] = (daysMap[dateKey] || 0) + expense.amount;
    });

    return Object.entries(daysMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredExpenses]);

  // Expense Distribution
  const expenseDistribution = useMemo(() => {
    const ranges = [
      { label: '< ₹100', min: 0, max: 100, count: 0, total: 0 },
      { label: '₹100-500', min: 100, max: 500, count: 0, total: 0 },
      { label: '₹500-1K', min: 500, max: 1000, count: 0, total: 0 },
      { label: '₹1K-5K', min: 1000, max: 5000, count: 0, total: 0 },
      { label: '> ₹5K', min: 5000, max: Infinity, count: 0, total: 0 },
    ];

    filteredExpenses.forEach(expense => {
      const range = ranges.find(r => expense.amount >= r.min && expense.amount < r.max);
      if (range) {
        range.count++;
        range.total += expense.amount;
      }
    });

    return ranges.filter(r => r.count > 0);
  }, [filteredExpenses]);

  // Monthly Trend (Last 6 months)
  const monthlyTrend = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthExpenses = getExpensesForMonth(expenses, monthDate);
      const monthIncomes = incomes.filter(inc => {
        const incDate = new Date(inc.date);
        return incDate.getMonth() === monthDate.getMonth() && 
               incDate.getFullYear() === monthDate.getFullYear();
      });
      
      months.push({
        month: format(monthDate, 'MMM yyyy'),
        expenses: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        income: monthIncomes.reduce((sum, inc) => sum + inc.amount, 0)
      });
    }
    return months;
  }, [expenses, incomes]);

  // Investment Data
  const investmentData = useMemo(() => {
    if (!investments || investments.length === 0) return { byType: [], performance: [], totalStats: null };
    
    // Investment by Type (for Pie Chart)
    const typeMap: Record<string, { invested: number; current: number; count: number }> = {};
    
    investments.forEach(inv => {
      if (!typeMap[inv.type]) {
        typeMap[inv.type] = { invested: 0, current: 0, count: 0 };
      }
      typeMap[inv.type].invested += inv.amount;
      typeMap[inv.type].current += inv.currentValue;
      typeMap[inv.type].count += 1;
    });

    const byType = Object.entries(typeMap).map(([type, data]) => {
      const typeInfo = INVESTMENT_TYPES.find(t => t.id === type);
      return {
        name: typeInfo?.name || type,
        invested: data.invested,
        currentValue: data.current,
        returns: data.current - data.invested,
        returnsPercentage: data.invested > 0 ? ((data.current - data.invested) / data.invested) * 100 : 0,
        count: data.count,
        color: typeInfo?.color || '#6366F1'
      };
    }).sort((a, b) => b.currentValue - a.currentValue);

    // Investment Performance by Purchase Date (for Area/Line Chart)
    const sortedInvestments = [...investments].sort((a, b) => 
      new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
    );

    const performance: { date: string; invested: number; currentValue: number; returns: number }[] = [];
    let cumulativeInvested = 0;
    let cumulativeCurrent = 0;

    sortedInvestments.forEach(inv => {
      cumulativeInvested += inv.amount;
      cumulativeCurrent += inv.currentValue;
      performance.push({
        date: format(new Date(inv.purchaseDate), 'MMM yyyy'),
        invested: cumulativeInvested,
        currentValue: cumulativeCurrent,
        returns: cumulativeCurrent - cumulativeInvested
      });
    });

    // Total Stats
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturns = totalCurrent - totalInvested;
    const avgReturns = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    return {
      byType,
      performance,
      totalStats: {
        totalInvested,
        totalCurrent,
        totalReturns,
        avgReturns,
        count: investments.length
      }
    };
  }, [investments]);

  // Budget Utilization by Category
  const budgetUtilization = useMemo(() => {
    if (!budget.categories || Object.keys(budget.categories).length === 0) return [];

    return Object.entries(budget.categories).map(([catId, budgetAmount]) => {
      const category = categories.find(c => c.id === catId);
      const spent = stats.byCategory[catId] || 0;
      const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

      return {
        name: category?.name || catId,
        budget: budgetAmount,
        spent,
        percentage,
        color: category?.color || '#6B7280'
      };
    }).filter(item => item.budget > 0);
  }, [budget.categories, stats.byCategory, categories]);

  const paymentMethodData = useMemo(() => {
    return Object.entries(stats.byPaymentMethod).map(([method, amount]) => ({
      name: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: amount
    }));
  }, [stats.byPaymentMethod]);

  const topCategories = categoryData.slice(0, 5);
  const dailyAverage = stats.count > 0 ? stats.total / Math.max(1, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const dateRangeOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Comprehensive insights into your financial patterns
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 md:p-4 mb-4 md:mb-6">
          <div className="space-y-3">
            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={dateRangeOptions}
            />
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No expenses in this period
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Spent */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(stats.total, settings.currency)}
                </p>
                {previousPeriodComparison.changePercent !== 0 && (
                  <div className={`flex items-center gap-1 text-xs ${
                    previousPeriodComparison.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {previousPeriodComparison.change > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{Math.abs(previousPeriodComparison.changePercent).toFixed(1)}% vs prev period</span>
                  </div>
                )}
              </div>

              {/* Total Income */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(incomeVsExpense.totalIncome, settings.currency)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredIncomes.length} transactions
                </p>
              </div>

              {/* Savings */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    incomeVsExpense.savings >= 0 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'bg-orange-50 dark:bg-orange-900/20'
                  }`}>
                    <DollarSign className={`w-4 h-4 ${
                      incomeVsExpense.savings >= 0 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-orange-600 dark:text-orange-400'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {incomeVsExpense.savings >= 0 ? 'Savings' : 'Deficit'}
                  </span>
                </div>
                <p className={`text-2xl font-semibold mb-1 ${
                  incomeVsExpense.savings >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {formatCurrency(Math.abs(incomeVsExpense.savings), settings.currency)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {incomeVsExpense.savingsRate.toFixed(1)}% rate
                </p>
              </div>

              {/* Daily Average */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Average</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {formatCurrency(dailyAverage, settings.currency)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.count} transactions
                </p>
              </div>
            </div>

            {/* Income vs Expense Trend */}
            {monthlyTrend.length > 1 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Income vs Expenses (6 Months)
                  </h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#9CA3AF" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${settings.currency === 'INR' ? '₹' : '$'}${(value/1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, settings.currency)}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#22C55E"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Category Breakdown & Payment Methods */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Spending by Category
                  </h2>
                </div>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, settings.currency)}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {topCategories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(cat.value, settings.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              {paymentMethodData.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Payment Methods
                    </h2>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={paymentMethodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${settings.currency === 'INR' ? '₹' : '$'}${(value/1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, settings.currency)}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Spending by Day of Week */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Spending by Day of Week
                </h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${settings.currency === 'INR' ? '₹' : '$'}${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, settings.currency)}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Insights Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Spending Days */}
              {topSpendingDays.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Top Spending Days
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {topSpendingDays.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{day.date}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(day.amount, settings.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expense Distribution */}
              {expenseDistribution.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Expense Distribution
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {expenseDistribution.map((range) => (
                      <div key={range.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{range.label}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {range.count} txns
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatCurrency(range.total, settings.currency)}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${(range.count / stats.count) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Budget Utilization */}
            {budgetUtilization.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Budget Utilization by Category
                  </h2>
                </div>
                <div className="space-y-4">
                  {budgetUtilization.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.name}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.spent, settings.currency)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mx-1">/</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCurrency(item.budget, settings.currency)}
                          </span>
                        </div>
                      </div>
                      <div className="relative w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.percentage >= 100 ? 'bg-red-500' :
                            item.percentage >= 80 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                        <span className="absolute right-2 -top-5 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investment Charts Section */}
            {investmentData.totalStats && investmentData.totalStats.count > 0 && (
              <div className="space-y-6 mt-6">
                {/* Investment Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg border border-blue-400 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium opacity-90">Total Invested</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(investmentData.totalStats.totalInvested, settings.currency)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg border border-green-400 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium opacity-90">Current Value</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(investmentData.totalStats.totalCurrent, settings.currency)}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br rounded-lg border p-4 text-white ${
                    investmentData.totalStats.totalReturns >= 0
                      ? 'from-emerald-500 to-emerald-600 border-emerald-400'
                      : 'from-red-500 to-red-600 border-red-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {investmentData.totalStats.totalReturns >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium opacity-90">Returns</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {investmentData.totalStats.totalReturns >= 0 ? '+' : ''}
                      {formatCurrency(investmentData.totalStats.totalReturns, settings.currency)}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br rounded-lg border p-4 text-white ${
                    investmentData.totalStats.avgReturns >= 0
                      ? 'from-purple-500 to-purple-600 border-purple-400'
                      : 'from-orange-500 to-orange-600 border-orange-400'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-4 h-4" />
                      <span className="text-xs font-medium opacity-90">Avg Returns</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {investmentData.totalStats.avgReturns >= 0 ? '+' : ''}
                      {investmentData.totalStats.avgReturns.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Investment by Type - Pie Chart with Gradients */}
                  {investmentData.byType.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                          Investment by Type
                        </h2>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <defs>
                            {investmentData.byType.map((item, index) => (
                              <linearGradient key={item.name} id={`investmentGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={item.color} stopOpacity={0.6} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={investmentData.byType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="currentValue"
                          >
                            {investmentData.byType.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={`url(#investmentGradient${index})`} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value, settings.currency)}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {investmentData.byType.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: `url(#investmentGradient${index})`, backgroundColor: item.color }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">({item.count})</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(item.currentValue, settings.currency)}
                              </span>
                              <span className={`text-xs ml-2 ${
                                item.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                ({item.returns >= 0 ? '+' : ''}{item.returnsPercentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investment Performance - Area Chart with Gradient */}
                  {investmentData.performance.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <LineChartIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                          Investment Performance Trend
                        </h2>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={investmentData.performance}>
                          <defs>
                            <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value, settings.currency)}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="invested"
                            stackId="1"
                            stroke="#6366F1"
                            fill="url(#investedGradient)"
                            name="Invested"
                          />
                          <Area
                            type="monotone"
                            dataKey="currentValue"
                            stackId="2"
                            stroke="#10B981"
                            fill="url(#currentGradient)"
                            name="Current Value"
                          />
                          <Area
                            type="monotone"
                            dataKey="returns"
                            stackId="3"
                            stroke="#F59E0B"
                            fill="url(#returnsGradient)"
                            name="Returns"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Investment Returns Line Chart */}
                {investmentData.performance.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Investment Returns Over Time
                      </h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={investmentData.performance}>
                        <defs>
                          <linearGradient id="returnsLineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                            <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, settings.currency)}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="returns"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', r: 4 }}
                          activeDot={{ r: 6 }}
                          fill="url(#returnsLineGradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
