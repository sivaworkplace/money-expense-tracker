import { format, parseISO } from 'date-fns';
import { Currency, DateFormat } from '@/types';
import { CURRENCY_SYMBOLS } from './constants';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string, dateFormat: DateFormat): string => {
  try {
    const date = parseISO(dateString);
    const formatString = dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
    return format(date, formatString);
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

export const formatMonthYear = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM yyyy');
  } catch (error) {
    return dateString;
  }
};

export const getMonthKey = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM');
  } catch (error) {
    return '';
  }
};

export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  } catch (error) {
    return dateString;
  }
};

export const parseAmount = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatDateForInput = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    return format(new Date(), 'yyyy-MM-dd');
  }
};

