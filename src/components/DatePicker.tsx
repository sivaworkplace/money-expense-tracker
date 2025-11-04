import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export interface DatePickerProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'date' | 'datetime-local' | 'time';
  required?: boolean;
  error?: string;
  max?: string;
  min?: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'datetime-local',
  required = false,
  error,
  max,
  min,
  placeholder,
}) => {
  const isTimeOnly = type === 'time';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {/* Left Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
            {isTimeOnly ? (
              <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            ) : (
              <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            )}
          </div>
        </div>
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          max={max}
          min={min}
          placeholder={placeholder}
          className={`
            w-full pl-14 pr-12 py-2.5 rounded-lg
            bg-white dark:bg-gray-800
            border ${error ? 'border-danger-500' : 'border-gray-300 dark:border-gray-600'}
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'ring-2 ring-danger-500' : ''}
            hover:border-primary-400 dark:hover:border-primary-500
            font-medium text-sm
            shadow-sm hover:shadow-md focus:shadow-lg
            cursor-pointer
          `}
        />
        
        {/* Right Calendar Icon - Clickable Area */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Calendar className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Make the native calendar picker clickable through overlay */}
        <style>{`
          #${name}::-webkit-calendar-picker-indicator {
            cursor: pointer;
            position: absolute;
            right: 2px;
            width: 36px;
            height: 36px;
            opacity: 0;
            z-index: 10;
          }
          
          #${name}::-webkit-calendar-picker-indicator:hover {
            opacity: 0;
          }
          
          #${name}:hover::-webkit-calendar-picker-indicator {
            opacity: 0;
          }
        `}</style>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default DatePicker;

