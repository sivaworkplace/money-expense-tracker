import { Expense } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateExpense = (expense: Partial<Expense>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!expense.amount || expense.amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Amount must be greater than 0'
    });
  }

  if (!expense.category) {
    errors.push({
      field: 'category',
      message: 'Please select a category'
    });
  }

  if (!expense.description || expense.description.trim() === '') {
    errors.push({
      field: 'description',
      message: 'Description is required'
    });
  } else if (expense.description.length > 200) {
    errors.push({
      field: 'description',
      message: 'Description must be less than 200 characters'
    });
  }

  if (!expense.date) {
    errors.push({
      field: 'date',
      message: 'Date is required'
    });
  } else {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    if (expenseDate > now) {
      errors.push({
        field: 'date',
        message: 'Date cannot be in the future'
      });
    }
  }

  if (!expense.paymentMethod) {
    errors.push({
      field: 'paymentMethod',
      message: 'Please select a payment method'
    });
  }

  return errors;
};

export const validateBudget = (amount: number): ValidationError | null => {
  if (amount < 0) {
    return {
      field: 'budget',
      message: 'Budget cannot be negative'
    };
  }
  return null;
};

export const validateCategoryName = (name: string): ValidationError | null => {
  if (!name || name.trim() === '') {
    return {
      field: 'name',
      message: 'Category name is required'
    };
  }
  
  if (name.length > 50) {
    return {
      field: 'name',
      message: 'Category name must be less than 50 characters'
    };
  }
  
  return null;
};

// Individual field validators
export const validateAmount = (amount: number): string | null => {
  if (!amount || amount <= 0) {
    return 'Amount must be greater than 0';
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description || description.trim() === '') {
    return 'Description is required';
  }
  if (description.length > 200) {
    return 'Description must be less than 200 characters';
  }
  return null;
};

export const validateDate = (dateString: string): string | null => {
  if (!dateString) {
    return 'Date is required';
  }
  const date = new Date(dateString);
  const now = new Date();
  if (date > now) {
    return 'Date cannot be in the future';
  }
  return null;
};

