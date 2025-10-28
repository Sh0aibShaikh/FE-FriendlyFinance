// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  preferredCurrency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  preferredCurrency?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  preferredCurrency?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface UserProfileResponse {
  message: string;
  user: User;
}

// Transaction Types
export type TransactionType = 'Income' | 'Expense';

export type TransactionCategory = 
  | 'Food' 
  | 'Housing' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Salary' 
  | 'Other';

export interface Transaction {
  _id: string;
  user: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  user: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date?: string;
  description?: string;
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  amount?: number;
  category?: TransactionCategory;
  date?: string;
  description?: string;
}

export interface TransactionListResponse {
  count: number;
  total: number;
  page: number;
  pages: number;
  transactions: Transaction[];
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  [category: string]: {
    income: number;
    expense: number;
    total: number;
    count: number;
  };
}

export interface TransactionFilters {
  userId: string;
  limit?: number;
  skip?: number;
  type?: TransactionType;
  category?: TransactionCategory | TransactionCategory[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 1 | -1;
}

// API Response Types
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  details?: string;
  timestamp?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp?: string;
}

export interface PaginationMeta {
  count: number;
  total: number;
  page: number;
  pages: number;
}

