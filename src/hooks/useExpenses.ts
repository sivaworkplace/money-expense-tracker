import { useMemo } from 'react';
import { Expense, FilterOptions, SortOption } from '@/types';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const useExpenses = (expenses: Expense[], filters: FilterOptions, sortBy: SortOption) => {
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(expense =>
        expense.description.toLowerCase().includes(term) ||
        expense.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filters.categoryId) {
      result = result.filter(expense => expense.category === filters.categoryId);
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      result = result.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, {
          start: startOfDay(filters.startDate!),
          end: endOfDay(filters.endDate!)
        });
      });
    } else if (filters.startDate) {
      result = result.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= startOfDay(filters.startDate!);
      });
    } else if (filters.endDate) {
      result = result.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate <= endOfDay(filters.endDate!);
      });
    }

    // Amount filter
    if (filters.minAmount !== undefined) {
      result = result.filter(expense => expense.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      result = result.filter(expense => expense.amount <= filters.maxAmount!);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, filters, sortBy]);

  return filteredExpenses;
};

