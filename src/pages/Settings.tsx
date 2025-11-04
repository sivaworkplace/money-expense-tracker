import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/Card';
import Select from '@/components/Select';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CategoryIcon from '@/components/CategoryIcon';
import { Settings as SettingsType, Currency, DateFormat, Theme, Category } from '@/types';
import { ExportService } from '@/services/export';
import { v4 as uuidv4 } from 'uuid';
import Input from '@/components/Input';

const Settings: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    clearAllData,
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useApp();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', color: '#21808D' });

  const handleSettingChange = async (key: keyof SettingsType, value: Currency | DateFormat | Theme) => {
    await updateSettings({ ...settings, [key]: value });
  };

  const handleExportJSON = async () => {
    const data = await exportData();
    await ExportService.exportToJSON(data);
  };

  const handleExportCSV = async () => {
    const data = await exportData();
    await ExportService.exportToCSV(data.expenses);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await ExportService.importFromJSON(file);
      await importData(data);
      setShowImportModal(false);
      alert('Data imported successfully!');
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = async () => {
    await clearAllData();
    setShowClearConfirm(false);
    alert('All data cleared!');
  };

  const handleAddCategory = () => {
    setCategoryForm({ name: '', icon: '📦', color: '#21808D' });
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({ name: category.name, icon: category.icon, color: category.color });
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      alert('Category name is required');
      return;
    }

    const category: Category = {
      id: editingCategory?.id || `custom_${uuidv4()}`,
      name: categoryForm.name.trim(),
      icon: categoryForm.icon || '📦',
      color: categoryForm.color,
      isCustom: true,
      type: 'both'
    };

    if (editingCategory) {
      await updateCategory(category);
    } else {
      await addCategory(category);
    }

    setShowCategoryModal(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const currencyOptions = [
    { value: 'INR', label: '₹ INR - Indian Rupee' },
    { value: 'USD', label: '$ USD - US Dollar' },
    { value: 'EUR', label: '€ EUR - Euro' },
    { value: 'GBP', label: '£ GBP - British Pound' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }
  ];

  const commonEmojis = ['📦', '🎯', '💡', '🎨', '🎭', '🎪', '🎮', '🎲', '🎸', '🎹', '🎺', '🎻', '🎬', '🎤', '🎧', '📱', '💻', '⌚', '📷', '🔧', '🔨', '⚡', '🔥', '💧', '🌟', '⭐', '✨', '💫', '🌈', '🍀'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize your expense tracker
          </p>
        </div>

        {/* General Settings */}
        <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          General
        </h2>
        <div className="space-y-4">
          <Select
            label="Currency"
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value as Currency)}
            options={currencyOptions}
          />

          <Select
            label="Date Format"
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value as DateFormat)}
            options={dateFormatOptions}
          />
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Appearance
        </h2>
        <ThemeSwitcher />
      </Card>

      {/* Categories Management */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Categories
          </h2>
          <Button size="sm" onClick={handleAddCategory}>
            Add Category
          </Button>
        </div>
        <div className="space-y-2">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color + '15' }}
                >
                  <CategoryIcon category={category} size={20} style={{ color: category.color }} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {category.isCustom ? 'Custom' : 'Default'}
                  </p>
                </div>
              </div>
              {category.isCustom && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Data Management
        </h2>
        <div className="space-y-3">
          <Button variant="secondary" fullWidth onClick={handleExportJSON}>
            📥 Export Data (JSON)
          </Button>
          <Button variant="secondary" fullWidth onClick={handleExportCSV}>
            📊 Export Expenses (CSV)
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setShowImportModal(true)}>
            📤 Import Data
          </Button>
          <Button variant="danger" fullWidth onClick={() => setShowClearConfirm(true)}>
            🗑️ Clear All Data
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          About
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-pink-300 flex items-center justify-center shadow-lg overflow-hidden">
            {/* Dagger One Logo - PNG Image */}
            <img 
              src="/dagger-one-logo.png" 
              alt="Dagger One" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">
              Dagger One
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              v1.1.0
            </p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          <strong>One Tool to Handle Everything</strong>
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          A cross-platform expense tracking app built with React and Capacitor.
          Track expenses, income, budgets, and bank accounts - all stored locally on your device.
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Developed by <span className="font-semibold text-gray-700 dark:text-gray-300">dagger_one</span> team
          </p>
        </div>
      </Card>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Category Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Travel"
            maxLength={50}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <Input
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="Select an emoji"
              maxLength={2}
            />
            <div className="mt-2 grid grid-cols-8 gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCategoryForm(prev => ({ ...prev, icon: emoji }))}
                  className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <input
              type="color"
              value={categoryForm.color}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSaveCategory} fullWidth>
              {editingCategory ? 'Update' : 'Add'} Category
            </Button>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Data"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select a JSON file to import. This will replace all existing data.
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
      </Modal>

      {/* Clear Confirm Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Data"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to clear all data? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleClearData} fullWidth>
              Yes, Clear All Data
            </Button>
            <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default Settings;

