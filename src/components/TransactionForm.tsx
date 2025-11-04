import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Expense, Income } from '../types';
import { validateAmount, validateDescription, validateDate } from '../utils/validators';
import { formatDateForInput } from '../utils/formatters';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import CategorySelect from './CategorySelect';
import AccountSelect from './AccountSelect';
import DatePicker from './DatePicker';
import Textarea from './Textarea';
import PhotoUpload from './PhotoUpload';

interface TransactionFormProps {
  type: 'expense' | 'income';
  expense?: Expense;
  income?: Income;
  onSave: () => void;
  onCancel: () => void;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'wallet', label: 'Digital Wallet' }
];

const INCOME_SOURCES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'business', label: 'Business' },
  { value: 'investment', label: 'Investment' },
  { value: 'rental', label: 'Rental' },
  { value: 'gift', label: 'Gift' },
  { value: 'other', label: 'Other' }
];

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  type, 
  expense, 
  income, 
  onSave, 
  onCancel 
}) => {
  const { 
    addExpense, 
    updateExpense, 
    addIncome, 
    updateIncome, 
    categories, 
    accounts,
    tags,
    addTag,
    addCategory
  } = useApp();

  const isExpense = type === 'expense';
  const existingTransaction = isExpense ? expense : income;

  const [formData, setFormData] = useState({
    amount: existingTransaction?.amount.toString() || '',
    category: existingTransaction?.category || '',
    description: existingTransaction?.description || '',
    date: existingTransaction?.date || new Date().toISOString(),
    paymentMethod: (expense as Expense)?.paymentMethod || 'cash',
    source: (income as Income)?.source || 'salary',
    accountId: existingTransaction?.accountId || '',
    selectedTags: existingTransaction?.tags || [],
    imagePath: existingTransaction?.imagePath || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📦',
    color: '#6B7280'
  });

  // Filter categories based on type
  const filteredCategories = categories.filter(
    cat => cat.type === type || cat.type === 'both'
  );

  // Categories are passed directly to CategorySelect component

  // Accounts are passed directly to AccountSelect component

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    handleChange('category', value);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    const tagName = newTag.trim().toLowerCase();
    const existingTag = tags.find(t => t.name.toLowerCase() === tagName);
    
    if (existingTag) {
      // Add existing tag
      if (!formData.selectedTags.includes(existingTag.name)) {
        setFormData(prev => ({
          ...prev,
          selectedTags: [...prev.selectedTags, existingTag.name]
        }));
      }
    } else {
      // Create new tag
      await addTag({
        id: `tag_${Date.now()}`,
        name: tagName,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        createdAt: new Date().toISOString()
      });
      setFormData(prev => ({
        ...prev,
        selectedTags: [...prev.selectedTags, tagName]
      }));
    }
    
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(t => t !== tagToRemove)
    }));
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
      type: type as 'expense' | 'income' | 'both'
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountError = validateAmount(parseFloat(formData.amount));
    if (amountError) newErrors.amount = amountError;

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    const descError = validateDescription(formData.description);
    if (descError) newErrors.description = descError;

    const dateError = validateDate(formData.date);
    if (dateError) newErrors.date = dateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const baseData = {
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      date: formData.date,
      accountId: formData.accountId || undefined,
      tags: formData.selectedTags.length > 0 ? formData.selectedTags : undefined,
      imagePath: formData.imagePath || undefined
    };

    try {
      if (isExpense) {
        const expenseData: Expense = {
          ...baseData,
          id: expense?.id || `exp_${Date.now()}`,
          paymentMethod: formData.paymentMethod,
          createdAt: expense?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (expense) {
          await updateExpense(expenseData);
        } else {
          await addExpense(expenseData);
        }
      } else {
        const incomeData: Income = {
          ...baseData,
          id: income?.id || `inc_${Date.now()}`,
          source: formData.source,
          createdAt: income?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (income) {
          await updateIncome(incomeData);
        } else {
          await addIncome(incomeData);
        }
      }

      onSave();
    } catch (error: any) {
      console.error(`Error saving ${type}:`, error);
      const errorMessage = error?.message || `Failed to save ${type}. Please try again.`;
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Amount (₹)"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
          placeholder="0.00"
          required
        />
      </div>

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
              placeholder="e.g., Groceries, Bonus"
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
            onChange={handleCategoryChange}
            categories={filteredCategories}
            error={errors.category}
            required
          />
        )}
      </div>

      <div>
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          placeholder={`What was this ${type} for?`}
          rows={3}
        />
      </div>

      <div>
        <DatePicker
          label="Date"
          type="date"
          name="date"
          value={formatDateForInput(formData.date)}
          onChange={(e) => handleChange('date', new Date(e.target.value).toISOString())}
          error={errors.date}
          required
        />
      </div>

      {isExpense ? (
        <div>
          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            options={PAYMENT_METHODS}
          />
        </div>
      ) : (
        <div>
          <Select
            label="Income Source"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            options={INCOME_SOURCES}
          />
        </div>
      )}

      <div>
        <AccountSelect
          label="Account (Optional)"
          name="accountId"
          value={formData.accountId || ''}
          onChange={(value) => handleChange('accountId', value)}
          accounts={accounts}
        />
      </div>

      <PhotoUpload
        label={isExpense ? 'Attach Bill/Receipt (Optional)' : 'Attach Document (Optional)'}
        value={formData.imagePath || undefined}
        onChange={(imagePath) => {
          setFormData(prev => ({ ...prev, imagePath: imagePath || '' }));
        }}
      />

      {/* Tags Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags
        </label>
        
        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.selectedTags.map(tag => {
            const tagObj = tags.find(t => t.name === tag);
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: tagObj?.color || '#6B7280',
                  color: '#fff'
                }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-80"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
          >
            Add Tag
          </Button>
        </div>

        {/* Available Tags */}
        {tags.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quick add:
            </p>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter(tag => !formData.selectedTags.includes(tag.name))
                .map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        selectedTags: [...prev.selectedTags, tag.name]
                      }));
                    }}
                    className="px-2 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{
                      borderColor: tag.color,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <div className="flex-1">
          <Button type="submit" variant="primary">
            {existingTransaction ? `Update ${type}` : `Add ${type}`}
          </Button>
        </div>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
