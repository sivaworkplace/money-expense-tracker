import React from 'react';
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  Target,
  LineChart,
  Settings
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'incomes', label: 'Incomes', icon: TrendingUp },
    { id: 'investments', label: 'Investments', icon: LineChart },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Include all sections in mobile navigation
  const mobileNavItems = navItems;

  return (
    <>
      {/* Desktop Sidebar - ClickUp Style */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-40">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 via-orange-300 to-pink-300 flex items-center justify-center shadow-lg overflow-hidden">
              {/* Dagger One Logo - PNG Image */}
              <img 
                src="/dagger-one-logo.png" 
                alt="Dagger One" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                Dagger One
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">
                One Tool to Handle Everything
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Version 1.1.0
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - 4 Above, 4 Below (Single Rows) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-bottom shadow-lg">
        <div className="flex flex-col">
          {/* Top Section: 4 Items in Single Row */}
          <div className="grid grid-cols-4 gap-0">
            {mobileNavItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isLast = index === 3;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 py-3 px-1
                    transition-all duration-200 min-h-[60px]
                    border-b border-r border-gray-200 dark:border-gray-800
                    ${isLast ? 'border-r-0' : ''}
                    ${isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[9px] font-semibold leading-tight text-center line-clamp-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Bottom Section: 4 Items in Single Row */}
          <div className="grid grid-cols-4 gap-0">
            {mobileNavItems.slice(4, 8).map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isLast = index === 3;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center justify-center gap-1 py-3 px-1
                    transition-all duration-200 min-h-[60px]
                    border-r border-gray-200 dark:border-gray-800
                    ${isLast ? 'border-r-0' : ''}
                    ${isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[9px] font-semibold leading-tight text-center line-clamp-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
