import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useExpenses } from '@/hooks/useExpenses';
import { useDebounce } from '@/hooks/useDebounce';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import CategoryIcon from '@/components/CategoryIcon';
import PhotoView from '@/components/PhotoView';
import { FilterOptions, SortOption } from '@/types';
import { formatCurrency, formatRelativeDate } from '@/utils/formatters';
import { format, parseISO } from 'date-fns';

interface ExpensesProps {
  onEditExpense: (id: string) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ onEditExpense }) => {
  const { expenses, categories, settings, deleteExpense } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const activeFilters = useMemo(() => ({
    ...filters,
    searchTerm: debouncedSearchTerm
  }), [filters, debouncedSearchTerm]);

  const filteredExpenses = useExpenses(expenses, activeFilters, sortBy);

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof filteredExpenses> = {};
    
    filteredExpenses.forEach(expense => {
      const dateKey = format(parseISO(expense.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredExpenses]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await deleteExpense(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || Object.keys(filters).some(key => filters[key as keyof FilterOptions]);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
    { value: 'category', label: 'Category' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Expenses
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {filteredExpenses.length} of {expenses.length} expenses
          </p>
        </div>

      {/* Search and Sort */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2 md:gap-3">
          <div className="flex-1 min-w-0">
            <Input
              type="search"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="🔍"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="min-w-[80px] shrink-0 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm min-h-[44px] flex items-center justify-center"
          >
            <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Filters'}</span>
            <span className="sm:hidden">{showFilters ? '✕' : '⚙'}</span>
            {hasActiveFilters && <span className="ml-1">●</span>}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-3 md:p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                label="Category"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                options={categoryOptions}
              />

              <Select
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                options={sortOptions}
              />

              <Input
                label="Start Date"
                type="date"
                value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)
                }
              />

              <Input
                label="End Date"
                type="date"
                value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : null)
                }
              />

              <Input
                label="Min Amount"
                type="number"
                step="0.01"
                value={filters.minAmount?.toString() || ''}
                onChange={(e) =>
                  handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : null)
                }
                placeholder="0.00"
              />

              <Input
                label="Max Amount"
                type="number"
                step="0.01"
                value={filters.maxAmount?.toString() || ''}
                onChange={(e) =>
                  handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : null)
                }
                placeholder="0.00"
              />
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} fullWidth>
                Clear All Filters
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card className="p-8 md:p-12 text-center">
          <span className="text-6xl mb-4 block">
            {hasActiveFilters ? '🔍' : '📭'}
          </span>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {hasActiveFilters ? 'No expenses match your filters' : 'No expenses yet'}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedExpenses.map(([dateKey, dayExpenses]) => {
            const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            return (
              <div key={dateKey}>
                <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
                    {formatRelativeDate(dayExpenses[0].date)}
                  </h3>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(dayTotal, settings.currency)}
                  </span>
                </div>
                
                <Card className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dayExpenses.map(expense => {
                    const category = getCategoryInfo(expense.category);
                    const isConfirmingDelete = deleteConfirm === expense.id;

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2 md:gap-3"
                      >
                        <div
                          className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => !isConfirmingDelete && onEditExpense(expense.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && !isConfirmingDelete && onEditExpense(expense.id)}
                        >
                          <div
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: category?.color + '15' }}
                          >
                            <CategoryIcon category={category} size={20} style={{ color: category?.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                              {expense.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {category?.name || expense.category} • {expense.paymentMethod.replace('_', ' ')}
                            </p>
                          </div>
                          {expense.imagePath && (
                            <div className="hidden sm:block">
                              <PhotoView imagePath={expense.imagePath} size="sm" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                              {formatCurrency(expense.amount, settings.currency)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(parseISO(expense.date), 'HH:mm')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className={`px-2 py-1.5 md:px-3 md:py-1 rounded text-sm font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                              isConfirmingDelete
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                            }`}
                            aria-label={isConfirmingDelete ? 'Confirm delete' : 'Delete expense'}
                          >
                            {isConfirmingDelete ? <span className="text-xs">Confirm?</span> : '🗑️'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default Expenses;

