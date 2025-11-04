import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import Modal from '@/components/Modal';
import ExpenseForm from '@/components/ExpenseForm';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import Incomes from '@/pages/Incomes';
import Investments from '@/pages/Investments';
import Reports from '@/pages/Reports';
import Accounts from '@/pages/Accounts';
import Budget from '@/pages/Budget';
import Settings from '@/pages/Settings';

const AppContent: React.FC = () => {
  const { loading, settings } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | undefined>();

  // Apply theme on mount and when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark/light mode
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color theme
    root.setAttribute('data-theme', settings.colorTheme);
    
    // Force browser to recalculate styles immediately
    void root.offsetHeight;
    
    // Add transition class for smooth color changes
    root.classList.add('theme-transition');
    
    // Remove transition class after a short delay
    const timer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [settings.theme, settings.colorTheme]);

  const handleAddExpense = () => {
    setEditingExpenseId(undefined);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (id: string) => {
    setEditingExpenseId(id);
    setShowExpenseModal(true);
  };

  const handleExpenseSuccess = () => {
    setShowExpenseModal(false);
    setEditingExpenseId(undefined);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'expenses') {
      // Could scroll to top or other navigation logic
    }
  };

  // Handle Android back button
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      let listener: any = null;
      
      CapacitorApp.addListener('backButton', () => {
        // Close modal if open
        if (showExpenseModal) {
          setShowExpenseModal(false);
          setEditingExpenseId(undefined);
          return;
        }
        
        // Navigate back or exit app
        if (currentPage !== 'dashboard') {
          setCurrentPage('dashboard');
        } else {
          // On dashboard, exit app
          CapacitorApp.exitApp();
        }
      }).then((l: any) => {
        listener = l;
      });

      return () => {
        if (listener) {
          listener.remove();
        }
      };
    }
  }, [currentPage, showExpenseModal]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className="md:pl-64">
        <main>
          {currentPage === 'dashboard' && (
            <Dashboard onAddExpense={handleAddExpense} onEditExpense={handleEditExpense} onNavigate={handleNavigate} />
          )}
          {currentPage === 'expenses' && <Expenses onEditExpense={handleEditExpense} />}
          {currentPage === 'incomes' && <Incomes />}
          {currentPage === 'investments' && <Investments />}
          {currentPage === 'reports' && <Reports />}
          {currentPage === 'accounts' && <Accounts />}
          {currentPage === 'budget' && <Budget />}
          {currentPage === 'settings' && <Settings />}
        </main>

        <FloatingActionButton onClick={handleAddExpense} />

        <Modal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          title={editingExpenseId ? 'Edit Expense' : 'Add Expense'}
        >
          <ExpenseForm
            expenseId={editingExpenseId}
            onSuccess={handleExpenseSuccess}
            onCancel={() => setShowExpenseModal(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

