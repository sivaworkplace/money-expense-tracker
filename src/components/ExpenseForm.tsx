import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, PaymentMethod } from '@/types';
import { useApp } from '@/contexts/AppContext';
import Input from './Input';
import Select from './Select';
import CategorySelect from './CategorySelect';
import AccountSelect from './AccountSelect';
import DatePicker from './DatePicker';
import Textarea from './Textarea';
import Button from './Button';
import PhotoUpload from './PhotoUpload';
import { validateExpense, ValidationError } from '@/utils/validators';
import { PAYMENT_METHODS, DEFAULT_CATEGORIES } from '@/utils/constants';
import { format } from 'date-fns';

interface ExpenseFormProps {
  expenseId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseId, onSuccess, onCancel }) => {
  const { expenses, categories, accounts, addExpense, updateExpense, addCategory } = useApp();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📦',
    color: '#6B7280'
  });

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    paymentMethod: '' as PaymentMethod | '',
    accountId: '',
    imagePath: ''
  });

  useEffect(() => {
    if (expenseId) {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setFormData({
          amount: expense.amount.toString(),
          category: expense.category,
          description: expense.description,
          date: expense.date.substring(0, 16),
          paymentMethod: expense.paymentMethod,
          accountId: expense.accountId || '',
          imagePath: expense.imagePath || ''
        });
      }
    }
  }, [expenseId, expenses]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    const category = {
      id: `custom_${Date.now()}`,
      name: newCategory.name.trim(),
      icon: newCategory.icon || '📦',
      color: newCategory.color,
      isCustom: true,
      type: 'expense' as const
    };

    try {
      await addCategory(category);
      
      // Select the newly created category
      setFormData(prev => ({ ...prev, category: category.id }));
      
      // Reset and close the form
      setNewCategory({ name: '', icon: '📦', color: '#6B7280' });
      setShowCategoryForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const now = new Date().toISOString();
    const expense: Expense = {
      id: expenseId || uuidv4(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      date: new Date(formData.date).toISOString(),
      paymentMethod: formData.paymentMethod as PaymentMethod,
      accountId: formData.accountId || undefined,
      imagePath: formData.imagePath || undefined,
      createdAt: expenseId
        ? expenses.find(e => e.id === expenseId)?.createdAt || now
        : now,
      updatedAt: now
    };

    const validationErrors = validateExpense(expense);
    
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err: ValidationError) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      setLoading(false);
      return;
    }

    try {
      if (expenseId) {
        await updateExpense(expense);
      } else {
        await addExpense(expense);
      }
      onSuccess();
    } catch (error: any) {
      console.error('Error saving expense:', error);
      const errorMessage = error?.message || 'Failed to save expense. Please try again.';
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      setErrors({ submit: errorMessage });
      // Also show alert for better visibility
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories for expenses only - ensure we always have defaults
  const expenseCategories = React.useMemo(() => {
    // Use DEFAULT_CATEGORIES filtered for expenses
    const defaultExpenseCategories = DEFAULT_CATEGORIES.filter(
      cat => cat.type === 'expense' || cat.type === 'both'
    );
    
    // If no categories from context, return defaults
    if (!categories || categories.length === 0) {
      return defaultExpenseCategories;
    }
    
    // Filter categories from context
    const filtered = categories.filter(
      cat => cat && (cat.type === 'expense' || cat.type === 'both')
    );
    
    // If filtered is empty, return defaults anyway
    if (filtered.length === 0) {
      return defaultExpenseCategories;
    }
    
    // Merge defaults with custom categories, ensuring defaults are always present
    const defaultIds = new Set(defaultExpenseCategories.map(c => c.id));
    const customCategories = filtered.filter(c => !defaultIds.has(c.id));
    
    // Return defaults + custom categories
    return [...defaultExpenseCategories, ...customCategories];
  }, [categories]);

  const paymentMethodOptions = [
    { value: '', label: 'Select Payment Method' },
    ...PAYMENT_METHODS.map(pm => ({ value: pm.id, label: `${pm.icon} ${pm.name}` }))
  ];

  // Accounts are passed directly to AccountSelect component

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <Input
        label="Amount *"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        value={formData.amount}
        onChange={handleChange}
        error={errors.amount}
        placeholder="0.00"
        icon="💵"
        required
        autoFocus
      />

      {/* Category Selection with Add New Option */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showCategoryForm ? '− Cancel' : '+ Add New Category'}
          </button>
        </div>
        
        {showCategoryForm ? (
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 space-y-3 mb-3">
            <Input
              label="Category Name"
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Groceries, Entertainment"
              required
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="📦"
                  maxLength={2}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 text-center text-2xl"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use any emoji
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-[42px] border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="primary"
              onClick={handleCreateCategory}
            >
              Create Category
            </Button>
          </div>
        ) : (
          <CategorySelect
            name="category"
            value={formData.category}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, category: value }));
              if (errors.category) {
                setErrors(prev => ({ ...prev, category: '' }));
              }
            }}
            categories={expenseCategories}
            error={errors.category}
            required
          />
        )}
      </div>

      <Textarea
        label="Description *"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="What did you spend on?"
        rows={3}
        maxLength={200}
        required
      />

      <DatePicker
        label="Date & Time *"
        name="date"
        type="datetime-local"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
        required
      />

      <Select
        label="Payment Method *"
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
        options={paymentMethodOptions}
        error={errors.paymentMethod}
        required
      />

      <AccountSelect
        label="Account (Optional)"
        name="accountId"
        value={formData.accountId || ''}
        onChange={(value) => {
          setFormData(prev => ({ ...prev, accountId: value }));
        }}
        accounts={accounts}
      />

      <PhotoUpload
        label="Attach Bill/Receipt (Optional)"
        value={formData.imagePath || undefined}
        onChange={(imagePath) => {
          setFormData(prev => ({ ...prev, imagePath: imagePath || '' }));
        }}
      />

      {errors.submit && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Saving...' : expenseId ? 'Update Expense' : 'Add Expense'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;

