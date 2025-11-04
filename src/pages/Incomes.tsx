import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Income } from '../types';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/Card';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import CategoryIcon from '../components/CategoryIcon';
import PhotoView from '../components/PhotoView';
import { useDebounce } from '../hooks/useDebounce';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Incomes: React.FC = () => {
  const { incomes, deleteIncome, categories, settings, tags } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter income categories
  const incomeCategories = categories.filter(
    cat => cat.type === 'income' || cat.type === 'both'
  );

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...incomeCategories.map(cat => ({
      value: cat.id,
      label: cat.name
    }))
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'business', label: 'Business' },
    { value: 'investment', label: 'Investment' },
    { value: 'rental', label: 'Rental' },
    { value: 'gift', label: 'Gift' },
    { value: 'other', label: 'Other' }
  ];

  const tagOptions = [
    { value: '', label: 'All Tags' },
    ...tags.map(tag => ({
      value: tag.name,
      label: tag.name
    }))
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' }
  ];

  const filteredIncomes = useMemo(() => {
    let filtered = incomes.filter(income => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = 
          income.description.toLowerCase().includes(searchLower) ||
          income.source.toLowerCase().includes(searchLower) ||
          income.amount.toString().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filterCategory && income.category !== filterCategory) {
        return false;
      }

      // Source filter
      if (filterSource && income.source !== filterSource) {
        return false;
      }

      // Tag filter
      if (filterTag && (!income.tags || !income.tags.includes(filterTag))) {
        return false;
      }

      // Date range filter
      const incomeDate = new Date(income.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      if (incomeDate < startDate || incomeDate > endDate) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

    return filtered;
  }, [incomes, debouncedSearch, filterCategory, filterSource, filterTag, dateRange, sortBy]);

  // Group by date
  const groupedIncomes = useMemo(() => {
    const groups: Record<string, Income[]> = {};
    
    filteredIncomes.forEach(income => {
      const dateKey = format(new Date(income.date), 'MMMM dd, yyyy');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(income);
    });

    return groups;
  }, [filteredIncomes]);

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

  const handleAddIncome = () => {
    setEditingIncome(undefined);
    setIsModalOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleDeleteIncome = async (income: Income) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      await deleteIncome(income.id);
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setEditingIncome(undefined);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const getTagColor = (tagName: string) => {
    const tag = tags.find(t => t.name === tagName);
    return tag?.color || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Incomes
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Total: {formatCurrency(totalIncome, settings.currency)} ({filteredIncomes.length} items)
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex justify-end items-center mb-4">
        <Button onClick={handleAddIncome} variant="primary">
          <span className="hidden sm:inline">+ Add Income</span>
          <span className="sm:hidden">+ Add</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Input
              label="Search"
              type="text"
              placeholder="Search incomes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={categoryOptions}
            />

            <Select
              label="Source"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              options={sourceOptions}
            />

            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              options={sortOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />

            <Input
              label="End Date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />

            <Select
              label="Filter by Tag"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              options={tagOptions}
            />
          </div>

          {(searchTerm || filterCategory || filterSource || filterTag) && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setFilterSource('');
                setFilterTag('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Income List */}
      {filteredIncomes.length === 0 ? (
        <Card>
              <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {incomes.length === 0 
                ? 'No income recorded yet. Start by adding your first income!' 
                : 'No incomes match your filters.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {Object.entries(groupedIncomes).map(([date, dateIncomes]) => (
            <div key={date}>
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-2 md:mb-3 px-1">
                {date}
              </h3>
              <div className="space-y-2 md:space-y-3">
                {dateIncomes.map(income => {
                  const category = getCategoryInfo(income.category);
                  return (
                    <Card key={income.id} className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                          <div
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${category?.color}15` }}
                          >
                            <CategoryIcon category={category} size={20} style={{ color: category?.color }} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                                {income.description || 'Income'}
                              </h4>
                              {income.tags && income.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {income.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="text-xs px-2 py-0.5 rounded-full text-white"
                                      style={{ backgroundColor: getTagColor(tag) }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              <span>{category?.name}</span>
                              <span>•</span>
                              <span className="capitalize">{income.source.replace('_', ' ')}</span>
                            </div>
                          </div>
                          {income.imagePath && (
                            <div className="hidden sm:block">
                              <PhotoView imagePath={income.imagePath} size="sm" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-sm md:text-base font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                              +{formatCurrency(income.amount, settings.currency)}
                            </p>
                          </div>

                          <div className="flex gap-1 md:gap-2">
                            <button
                              onClick={() => handleEditIncome(income)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label="Edit income"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteIncome(income)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label="Delete income"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIncome(undefined);
        }}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
      >
        <TransactionForm
          type="income"
          income={editingIncome}
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingIncome(undefined);
          }}
        />
      </Modal>
      </div>
    </div>
  );
};

export default Incomes;

