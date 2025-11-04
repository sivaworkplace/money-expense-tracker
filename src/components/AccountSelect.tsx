import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import BankIcon from './BankIcon';
import { BankAccount } from '@/types';

export interface AccountSelectProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  accounts: BankAccount[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  label,
  name,
  value,
  onChange,
  accounts,
  required = false,
  error,
  placeholder = 'Select Account',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedAccount = accounts.find(acc => acc.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (accountId: string) => {
    onChange(accountId);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 rounded-lg
          bg-white dark:bg-gray-800
          border ${error ? 'border-danger-500' : 'border-gray-300 dark:border-gray-600'}
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${error ? 'ring-2 ring-danger-500' : ''}
          flex items-center justify-between gap-3
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedAccount ? (
            <>
              <div className="flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedAccount.color + '15' }}
                >
                  <BankIcon 
                    accountName={selectedAccount.name}
                    accountType={selectedAccount.type}
                    size={16} 
                    style={{ color: selectedAccount.color }} 
                  />
                </div>
              </div>
              <span className="truncate">{selectedAccount.name}</span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {accounts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No accounts available
            </div>
          ) : (
            accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => handleSelect(account.id)}
                className={`
                  w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors text-left
                  ${value === account.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                `}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: account.color + '15' }}
                >
                  <BankIcon 
                    accountName={account.name}
                    accountType={account.type}
                    size={16} 
                    style={{ color: account.color }} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-gray-900 dark:text-gray-100 truncate">{account.name}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {account.type.replace('_', ' ')}
                  </span>
                </div>
                {value === account.id && (
                  <span className="text-primary-600 dark:text-primary-400">✓</span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default AccountSelect;

