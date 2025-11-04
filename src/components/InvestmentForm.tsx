import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Investment } from '@/types';
import { INVESTMENT_TYPES, INVESTMENT_PLATFORMS } from '@/utils/constants';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import DatePicker from './DatePicker';
import PhotoUpload from './PhotoUpload';
import { v4 as uuidv4 } from 'uuid';
import { Tag as TagIcon, X } from 'lucide-react';

interface InvestmentFormProps {
  investmentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  investmentId,
  onSuccess,
  onCancel,
}) => {
  const { investments, addInvestment, updateInvestment, tags, addTag } = useApp();
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    amount: '',
    currentValue: '',
    quantity: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    platform: '',
    notes: '',
    tags: [] as string[],
    imagePath: '',
  });

  useEffect(() => {
    if (investmentId) {
      const investment = investments.find((i) => i.id === investmentId);
      if (investment) {
        setFormData({
          name: investment.name,
          type: investment.type,
          amount: investment.amount.toString(),
          currentValue: investment.currentValue.toString(),
          quantity: investment.quantity?.toString() || '',
          purchaseDate: investment.purchaseDate.split('T')[0],
          platform: investment.platform || '',
          notes: investment.notes || '',
          tags: investment.tags || [],
          imagePath: investment.imagePath || '',
        });
      }
    }
  }, [investmentId, investments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const currentValue = parseFloat(formData.currentValue);
      const quantity = formData.quantity ? parseFloat(formData.quantity) : undefined;

      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid invested amount');
        setLoading(false);
        return;
      }

      if (isNaN(currentValue) || currentValue < 0) {
        alert('Please enter a valid current value');
        setLoading(false);
        return;
      }

      const returns = currentValue - amount;
      const returnsPercentage = (returns / amount) * 100;

      const investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        type: formData.type,
        amount,
        currentValue,
        quantity,
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
        platform: formData.platform || undefined,
        notes: formData.notes || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        imagePath: formData.imagePath || undefined,
        returns,
        returnsPercentage,
      };

      if (investmentId) {
        const existing = investments.find((i) => i.id === investmentId);
        if (existing) {
          await updateInvestment({
            ...investmentData,
            id: investmentId,
            createdAt: existing.createdAt,
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        const newInvestment: Investment = {
          ...investmentData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await addInvestment(newInvestment);
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving investment:', error);
      const errorMessage = error?.message || 'Failed to save investment. Please try again.';
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const tagName = newTag.trim();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
      
      // Add to global tags if it doesn't exist
      if (!tags.find(t => t.name === tagName)) {
        await addTag({
          id: uuidv4(),
          name: tagName,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          createdAt: new Date().toISOString()
        });
      }
      
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Investment Name */}
        <div className="md:col-span-2">
          <Input
            label="Investment Name *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Apple Stocks, SBI Mutual Fund"
            required
            maxLength={100}
          />
        </div>

        {/* Type */}
        <Select
          label="Investment Type *"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as Investment['type'] })}
          required
          options={INVESTMENT_TYPES.map(type => ({
            value: type.id,
            label: `${type.icon} ${type.name}`
          }))}
        />

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <input
            type="text"
            list="platforms"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            placeholder="Select or type..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <datalist id="platforms">
            {INVESTMENT_PLATFORMS.map(platform => (
              <option key={platform.id} value={platform.name} />
            ))}
          </datalist>
        </div>

        {/* Invested Amount */}
        <Input
          label="Invested Amount *"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
          min="0"
          step="0.01"
        />

        {/* Current Value */}
        <Input
          label="Current Value *"
          type="number"
          value={formData.currentValue}
          onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
          placeholder="0.00"
          required
          min="0"
          step="0.01"
        />

        {/* Quantity */}
        <Input
          label="Quantity (Optional)"
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="e.g., 100 shares"
          min="0"
          step="0.01"
        />

        {/* Purchase Date */}
        <DatePicker
          label="Purchase Date *"
          name="purchaseDate"
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          required
          max={new Date().toISOString().split('T')[0]}
        />

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <PhotoUpload
            label="Attach Certificate/Statement (Optional)"
            value={formData.imagePath || undefined}
            onChange={(imagePath) => {
              setFormData({ ...formData, imagePath: imagePath || '' });
            }}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button type="button" onClick={handleAddTag} size="sm" variant="secondary">
              Add Tag
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-900 dark:hover:text-primary-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Returns Preview */}
        {formData.amount && formData.currentValue && (
          <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Returns Preview
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Absolute Returns</p>
                <p className={`text-lg font-bold ${(parseFloat(formData.currentValue) - parseFloat(formData.amount)) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(parseFloat(formData.currentValue) - parseFloat(formData.amount)) >= 0 ? '+' : ''}
                  ₹{(parseFloat(formData.currentValue) - parseFloat(formData.amount)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Returns %</p>
                <p className={`text-lg font-bold ${(((parseFloat(formData.currentValue) - parseFloat(formData.amount)) / parseFloat(formData.amount)) * 100) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(((parseFloat(formData.currentValue) - parseFloat(formData.amount)) / parseFloat(formData.amount)) * 100) >= 0 ? '+' : ''}
                  {(((parseFloat(formData.currentValue) - parseFloat(formData.amount)) / parseFloat(formData.amount)) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" onClick={onCancel} variant="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : investmentId ? 'Update Investment' : 'Add Investment'}
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;

