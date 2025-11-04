import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Sun, Moon, Palette } from 'lucide-react';
import { ColorTheme } from '@/types';

const ThemeSwitcher: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [showPreviewMessage, setShowPreviewMessage] = React.useState(false);

  const colorThemes: Array<{ value: ColorTheme; label: string; colors: string }> = [
    { value: 'purple', label: 'Purple', colors: 'bg-purple-600' },
    { value: 'blue', label: 'Blue', colors: 'bg-blue-600' },
    { value: 'green', label: 'Green', colors: 'bg-green-600' },
    { value: 'orange', label: 'Orange', colors: 'bg-orange-600' },
    { value: 'pink', label: 'Pink', colors: 'bg-pink-600' },
    { value: 'red', label: 'Red', colors: 'bg-red-600' },
    { value: 'indigo', label: 'Indigo', colors: 'bg-indigo-600' },
    { value: 'teal', label: 'Teal', colors: 'bg-teal-600' },
  ];

  const toggleTheme = async () => {
    await updateSettings({
      ...settings,
      theme: settings.theme === 'light' ? 'dark' : 'light'
    });
  };

  const handleColorThemeChange = async (colorTheme: ColorTheme) => {
    await updateSettings({
      ...settings,
      colorTheme
    });
  };

  const handlePreviewClick = () => {
    setShowPreviewMessage(true);
    setTimeout(() => setShowPreviewMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Dark/Light Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Appearance Mode
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-150 border
              ${settings.theme === 'light'
                ? 'bg-white dark:bg-gray-900 border-primary-600 text-primary-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-150 border
              ${settings.theme === 'dark'
                ? 'bg-white dark:bg-gray-900 border-primary-600 text-primary-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Color Theme Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Color Theme
          </label>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {colorThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleColorThemeChange(theme.value)}
              className={`
                relative flex flex-col items-center gap-2 p-3 rounded-lg
                transition-all duration-150 border-2
                ${settings.colorTheme === theme.value
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                }
              `}
            >
              <div className={`w-8 h-8 rounded-full ${theme.colors} shadow-md ring-2 ${
                settings.colorTheme === theme.value 
                  ? 'ring-primary-600' 
                  : 'ring-transparent'
              }`} />
              <span className={`text-xs font-medium ${
                settings.colorTheme === theme.value
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {theme.label}
              </span>
              {settings.colorTheme === theme.value && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div 
        key={`theme-preview-${settings.colorTheme}`}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Live Preview
          </p>
          {showPreviewMessage && (
            <div className="absolute top-5 right-5 bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg animate-pulse">
              ✨ Theme preview in action!
            </div>
          )}
        </div>
        <div className="space-y-4">
          {/* Color Bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-primary-600 rounded-full" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-300">Primary-600</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-primary-500 rounded-full" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Primary-500</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-primary-400 rounded-full" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Primary-400</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={handlePreviewClick}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: `rgb(var(--primary-600))` }}
              title="Click to see this is a preview button! 🎨"
            >
              Primary
            </button>
            <button 
              onClick={handlePreviewClick}
              className="px-4 py-2 border-2 border-primary-600 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all active:scale-95 cursor-pointer"
              style={{ 
                borderColor: `rgb(var(--primary-600))`,
                color: settings.theme === 'dark' ? `rgb(var(--primary-300))` : `rgb(var(--primary-700))`
              }}
              title="Click to see this is a preview button! 🎨"
            >
              Outlined
            </button>
            <button 
              onClick={handlePreviewClick}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium transition-all active:scale-95 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Click to see this is a preview button! 🎨"
            >
              Secondary
            </button>
          </div>
          
          {/* Badge */}
          <div className="flex gap-2 items-center">
            <span 
              onClick={handlePreviewClick}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer hover:shadow-md"
              style={{ 
                backgroundColor: settings.theme === 'dark' ? `rgba(var(--primary-900), 0.3)` : `rgb(var(--primary-100))`,
                color: settings.theme === 'dark' ? `rgb(var(--primary-200))` : `rgb(var(--primary-800))`
              }}
              title="Click to see this is a preview badge! 🎨"
            >
              Badge
            </span>
            <span 
              onClick={handlePreviewClick}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white transition-all active:scale-95 cursor-pointer hover:shadow-md"
              style={{ backgroundColor: `rgb(var(--primary-600))` }}
              title="Click to see this is a preview badge! 🎨"
            >
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;

