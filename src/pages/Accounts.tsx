import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Select from '@/components/Select';
import BankIcon from '@/components/BankIcon';
import { BankAccount, SavingsGoal, AccountType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { ACCOUNT_TYPES } from '@/utils/constants';

const Accounts: React.FC = () => {
  const { accounts, savingsGoals, settings, addAccount, updateAccount, deleteAccount, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useApp();
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'savings' as AccountType,
    balance: '',
    icon: '🏦',
    color: '#21808D'
  });

  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: '🎯',
    color: '#21808D'
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalSavingsGoals = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleAddAccount = () => {
    setAccountForm({ name: '', type: 'savings', balance: '', icon: '🏦', color: '#21808D' });
    setEditingAccount(null);
    setShowAccountModal(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setAccountForm({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      icon: account.icon,
      color: account.color
    });
    setEditingAccount(account);
    setShowAccountModal(true);
  };

  const handleSaveAccount = async () => {
    if (!accountForm.name.trim()) {
      alert('Account name is required');
      return;
    }

    const now = new Date().toISOString();
    const account: BankAccount = {
      id: editingAccount?.id || uuidv4(),
      name: accountForm.name.trim(),
      type: accountForm.type,
      balance: parseFloat(accountForm.balance) || 0,
      currency: settings.currency,
      icon: accountForm.icon || '🏦',
      color: accountForm.color,
      isDefault: editingAccount?.isDefault || false,
      createdAt: editingAccount?.createdAt || now,
      updatedAt: now
    };

    if (editingAccount) {
      await updateAccount(account);
    } else {
      await addAccount(account);
    }

    setShowAccountModal(false);
  };

  const handleDeleteAccount = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account?.isDefault) {
      alert('Cannot delete default account');
      return;
    }
    if (confirm('Are you sure you want to delete this account?')) {
      await deleteAccount(id);
    }
  };

  const handleAddGoal = () => {
    setGoalForm({ name: '', targetAmount: '', currentAmount: '', deadline: '', icon: '🎯', color: '#21808D' });
    setEditingGoal(null);
    setShowGoalModal(true);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setGoalForm({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline?.substring(0, 10) || '',
      icon: goal.icon,
      color: goal.color
    });
    setEditingGoal(goal);
    setShowGoalModal(true);
  };

  const handleSaveGoal = async () => {
    if (!goalForm.name.trim()) {
      alert('Goal name is required');
      return;
    }

    const now = new Date().toISOString();
    const goal: SavingsGoal = {
      id: editingGoal?.id || uuidv4(),
      name: goalForm.name.trim(),
      targetAmount: parseFloat(goalForm.targetAmount) || 0,
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      deadline: goalForm.deadline ? new Date(goalForm.deadline).toISOString() : undefined,
      icon: goalForm.icon || '🎯',
      color: goalForm.color,
      createdAt: editingGoal?.createdAt || now,
      updatedAt: now
    };

    if (editingGoal) {
      await updateSavingsGoal(goal);
    } else {
      await addSavingsGoal(goal);
    }

    setShowGoalModal(false);
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      await deleteSavingsGoal(id);
    }
  };

  const accountTypeOptions = [
    { value: '', label: 'Select Type' },
    ...ACCOUNT_TYPES.map(type => ({ value: type.id, label: `${type.icon} ${type.name}` }))
  ];

  const commonEmojis = ['🏦', '💳', '💵', '💰', '📈', '💎', '🎯', '🏆', '🌟', '⭐', '✨', '💫', '🌈', '🍀'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Accounts & Savings
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Manage your bank accounts and savings goals
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="p-3 md:p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalBalance, settings.currency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Across {accounts.length} accounts
          </p>
        </Card>

        <Card className="p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Savings Goals</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(totalSaved, settings.currency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            of {formatCurrency(totalSavingsGoals, settings.currency)}
          </p>
        </Card>

        <Card className="p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Progress</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalSavingsGoals > 0 ? ((totalSaved / totalSavingsGoals) * 100).toFixed(0) : 0}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {savingsGoals.length} active goals
          </p>
        </Card>
      </div>

      {/* Bank Accounts */}
      <Card className="p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Bank Accounts
          </h2>
          <Button size="sm" onClick={handleAddAccount}>
            + Add Account
          </Button>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏦</span>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No accounts yet</p>
            <Button onClick={handleAddAccount}>Add Your First Account</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: account.color + '15' }}
                  >
                    <BankIcon 
                      accountName={account.name} 
                      accountType={account.type}
                      size={24} 
                      style={{ color: account.color }} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {account.name}
                      </p>
                      {account.isDefault && (
                        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {account.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditAccount(account)}
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  {!account.isDefault && (
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Savings Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Savings Goals
          </h2>
          <Button size="sm" onClick={handleAddGoal}>
            + Add Goal
          </Button>
        </div>

        {savingsGoals.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎯</span>
            <p className="text-gray-600 dark:text-gray-400 mb-4">No savings goals yet</p>
            <Button onClick={handleAddGoal}>Set Your First Goal</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savingsGoals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: goal.color + '30' }}
                      >
                        <span className="text-xl">{goal.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {goal.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(goal.currentAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: goal.color
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {progress.toFixed(0)}% complete
                    </span>
                    {goal.deadline && (
                      <span className="text-gray-600 dark:text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Account Modal */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title={editingAccount ? 'Edit Account' : 'Add Account'}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Account Name *"
            value={accountForm.name}
            onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., HDFC Savings"
            maxLength={50}
          />

          <Select
            label="Account Type *"
            value={accountForm.type}
            onChange={(e) => setAccountForm(prev => ({ ...prev, type: e.target.value as AccountType }))}
            options={accountTypeOptions}
          />

          <Input
            label="Current Balance"
            type="number"
            step="0.01"
            value={accountForm.balance}
            onChange={(e) => setAccountForm(prev => ({ ...prev, balance: e.target.value }))}
            placeholder="0.00"
            icon="💰"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <Input
              value={accountForm.icon}
              onChange={(e) => setAccountForm(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="Select an emoji"
              maxLength={2}
            />
            <div className="mt-2 grid grid-cols-7 gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAccountForm(prev => ({ ...prev, icon: emoji }))}
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
              value={accountForm.color}
              onChange={(e) => setAccountForm(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSaveAccount} fullWidth>
              {editingAccount ? 'Update' : 'Add'} Account
            </Button>
            <Button variant="secondary" onClick={() => setShowAccountModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Goal Modal */}
      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title={editingGoal ? 'Edit Goal' : 'Add Savings Goal'}
        size="sm"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Goal Name *"
            value={goalForm.name}
            onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Emergency Fund"
            maxLength={50}
          />

          <Input
            label="Target Amount *"
            type="number"
            step="0.01"
            value={goalForm.targetAmount}
            onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
            placeholder="0.00"
            icon="🎯"
          />

          <Input
            label="Current Amount"
            type="number"
            step="0.01"
            value={goalForm.currentAmount}
            onChange={(e) => setGoalForm(prev => ({ ...prev, currentAmount: e.target.value }))}
            placeholder="0.00"
            icon="💰"
          />

          <Input
            label="Target Date (Optional)"
            type="date"
            value={goalForm.deadline}
            onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <Input
              value={goalForm.icon}
              onChange={(e) => setGoalForm(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="Select an emoji"
              maxLength={2}
            />
            <div className="mt-2 grid grid-cols-7 gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setGoalForm(prev => ({ ...prev, icon: emoji }))}
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
              value={goalForm.color}
              onChange={(e) => setGoalForm(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSaveGoal} fullWidth>
              {editingGoal ? 'Update' : 'Add'} Goal
            </Button>
            <Button variant="secondary" onClick={() => setShowGoalModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default Accounts;

