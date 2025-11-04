import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import CategoryIcon from '@/components/CategoryIcon';
import { formatCurrency } from '@/utils/formatters';
import { getExpensesForMonth, calculateExpenseStats } from '@/utils/calculations';
import { Budget as BudgetType } from '@/types';

const Budget: React.FC = () => {
  const { budget, categories, settings, updateBudget, expenses } = useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<BudgetType>({ ...budget });

  const currentMonth = new Date();
  const monthExpenses = getExpensesForMonth(expenses, currentMonth);
  const stats = calculateExpenseStats(monthExpenses);

  const handleMonthlyBudgetChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      monthly: parseFloat(value) || 0
    }));
  };

  const handleCategoryBudgetChange = (categoryId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: parseFloat(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    await updateBudget(formData);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...budget });
    setEditing(false);
  };

  const getProgressColor = (spent: number, budgetAmount: number) => {
    if (budgetAmount === 0) return 'bg-gray-400';
    const percentage = (spent / budgetAmount) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getPercentage = (spent: number, budgetAmount: number) => {
    if (budgetAmount === 0) return 0;
    return Math.min((spent / budgetAmount) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              Budget Tracking
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Set and track your spending limits
            </p>
          </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            Edit Budget
          </Button>
        )}
        </div>

      {/* Monthly Budget */}
      <Card className="p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
          Monthly Budget
        </h2>
        
        {editing ? (
          <Input
            label="Monthly Budget Limit"
            type="number"
            step="0.01"
            min="0"
            value={formData.monthly.toString()}
            onChange={(e) => handleMonthlyBudgetChange(e.target.value)}
            icon="💰"
          />
        ) : (
          <>
            {budget.monthly > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Spent this month</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(stats.total, settings.currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Budget</p>
                    <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(budget.monthly, settings.currency)}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${getProgressColor(stats.total, budget.monthly)}`}
                    style={{ width: `${getPercentage(stats.total, budget.monthly)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {getPercentage(stats.total, budget.monthly).toFixed(1)}% used
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(Math.max(0, budget.monthly - stats.total), settings.currency)} remaining
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 md:py-8">
                <span className="text-5xl md:text-6xl mb-3 md:mb-4 block">💰</span>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 md:mb-4">
                  No monthly budget set
                </p>
                <Button onClick={() => setEditing(true)}>
                  Set Budget
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Category Budgets */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
          Category Budgets
        </h2>

        <div className="space-y-3 md:space-y-4">
          {categories.map(category => {
            const categoryBudget = editing ? formData.categories[category.id] || 0 : budget.categories[category.id] || 0;
            const categorySpent = stats.byCategory[category.id] || 0;

            return (
              <div key={category.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: category.color + '15' }}
                  >
                    <CategoryIcon category={category} size={20} className="flex-shrink-0" style={{ color: category.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </p>
                  </div>
                </div>

                {editing ? (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={categoryBudget.toString()}
                    onChange={(e) => handleCategoryBudgetChange(category.id, e.target.value)}
                    placeholder="0.00"
                  />
                ) : categoryBudget > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(categorySpent, settings.currency)} of {formatCurrency(categoryBudget, settings.currency)}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getPercentage(categorySpent, categoryBudget).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(categorySpent, categoryBudget)}`}
                        style={{ width: `${getPercentage(categorySpent, categoryBudget)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    No budget set
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {editing && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto flex gap-3">
          <Button onClick={handleSave} fullWidth>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Budget;

