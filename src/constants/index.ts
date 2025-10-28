// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Transaction Types
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

// Transaction Categories
export enum TransactionCategory {
  FOOD = 'Food & Dining',
  HOUSING = 'Housing',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  SALARY = 'Salary',
  SAVINGS = 'Savings/Transfer',
  POCKET_MONEY = 'PocketMoney',
  SHOPPING = 'Shopping',
  GIFTS = 'Gifts & Donations',
  TRAVEL = 'Travel',
  PERSONAL_CARE = 'Personal Care',
  EMI = 'EMI',
  OTHER = 'Other'
}

export const CATEGORIES = [
  'Food & Dining',
  'Housing',
  'Transport',
  'Entertainment',
  'Salary',
  'Savings/Transfer',
  'PocketMoney',
  'Shopping',
  'Gifts & Donations',
  'Travel',
  'Personal Care',
  'EMI',
  'Other'
];

export const CATEGORY_ICONS: Record<string, string> = {
  'Food & Dining': '🍔',
  'Housing': '🏠',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Salary': '💰',
  'Savings/Transfer': '🏦',
  'PocketMoney': '👛',
  'Shopping': '🛍️',
  'Gifts & Donations': '🎁',
  'Travel': '✈️',
  'Personal Care': '💅',
  'EMI': '📊',
  'Other': '📦'
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FF6B6B',
  'Housing': '#4ECDC4',
  'Transport': '#45B7D1',
  'Entertainment': '#FFA07A',
  'Salary': '#98D8C8',
  'Savings/Transfer': '#6C5CE7',
  'PocketMoney': '#A29BFE',
  'Shopping': '#FFAAA5',
  'Gifts & Donations': '#FF7675',
  'Travel': '#74B9FF',
  'Personal Care': '#FD79A8',
  'EMI': '#FDCB6E',
  'Other': '#95A5A6'
};

// Validation Rules
export const USER_VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    ERROR_MESSAGE: 'Username must be 3-50 characters, alphanumeric with _ or -'
  },
  EMAIL: {
    PATTERN: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    ERROR_MESSAGE: 'Please provide a valid email'
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    ERROR_MESSAGE: 'Password must be at least 6 characters'
  }
};

export const TRANSACTION_VALIDATION = {
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999.99,
    ERROR_MESSAGE: 'Amount must be between 0.01 and 999,999.99'
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
    ERROR_MESSAGE: 'Description must be less than 500 characters'
  }
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  DEFAULT_SKIP: 0
};

// Local Storage Keys
export enum LocalStorageKeys {
  AUTH_TOKEN = 'authToken',
  USER_ID = 'userId',
  USER_DATA = 'userData'
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_EMAIL: 'Please provide a valid email',
  INVALID_USERNAME: 'Username must be at least 3 characters long',
  INVALID_PASSWORD: 'Password must be at least 6 characters long',
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_CATEGORY: 'Invalid category',
  INVALID_TYPE: 'Invalid transaction type',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please login.',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ACCOUNT_DELETED: 'Account deleted successfully'
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3498db',
  SUCCESS: '#2ecc71',
  DANGER: '#e74c3c',
  WARNING: '#f39c12',
  INFO: '#9b59b6',
  LIGHT: '#ecf0f1',
  DARK: '#2c3e50'
};

export const INCOME_COLOR = '#2ecc71';
export const EXPENSE_COLOR = '#e74c3c';

// Currency Configuration
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  country: string;
  locale: string;
  decimalPlaces: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    country: 'India',
    locale: 'en-IN',
    decimalPlaces: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    country: 'United States',
    locale: 'en-US',
    decimalPlaces: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    country: 'Europe',
    locale: 'en-EU',
    decimalPlaces: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    country: 'United Kingdom',
    locale: 'en-GB',
    decimalPlaces: 2
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    country: 'Japan',
    locale: 'ja-JP',
    decimalPlaces: 0
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    country: 'Australia',
    locale: 'en-AU',
    decimalPlaces: 2
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    country: 'Canada',
    locale: 'en-CA',
    decimalPlaces: 2
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    country: 'Switzerland',
    locale: 'de-CH',
    decimalPlaces: 2
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    country: 'China',
    locale: 'zh-CN',
    decimalPlaces: 2
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    country: 'Singapore',
    locale: 'en-SG',
    decimalPlaces: 2
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    locale: 'ar-AE',
    decimalPlaces: 2
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    country: 'Mexico',
    locale: 'es-MX',
    decimalPlaces: 2
  }
};

export const CURRENCY_CODES = Object.keys(CURRENCIES);
export const DEFAULT_CURRENCY = 'INR';

