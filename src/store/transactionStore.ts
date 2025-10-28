import { create } from 'zustand';
import {
  Transaction,
  TransactionSummary,
  CategoryBreakdown,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters
} from '../types';
import { transactionService } from '../api/services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  summary: TransactionSummary | null;
  byCategory: CategoryBreakdown | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };

  // Actions
  fetchTransactions: (filters: TransactionFilters) => Promise<void>;
  fetchSummary: (userId: string) => Promise<void>;
  fetchByCategory: (userId: string) => Promise<void>;
  createTransaction: (data: CreateTransactionRequest) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransactionRequest) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  summary: null,
  byCategory: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  },

  fetchTransactions: async (filters: TransactionFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await transactionService.getTransactions(filters);
      set({
        transactions: response.transactions,
        pagination: {
          page: response.page,
          pages: response.pages,
          total: response.total,
          limit: filters.limit || 10
        },
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch transactions';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSummary: async (userId: string) => {
    try {
      const response = await transactionService.getSummary(userId);
      // Backend returns { message, summary } structure
      set({ summary: response.summary });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch summary';
      set({ error: errorMessage });
    }
  },

  fetchByCategory: async (userId: string) => {
    try {
      const response = await transactionService.getByCategory(userId);
      // Backend returns { message, byCategory } structure
      set({ byCategory: response.byCategory });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch category data';
      set({ error: errorMessage });
    }
  },

  createTransaction: async (data: CreateTransactionRequest) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.create(data);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create transaction';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTransaction: async (id: string, data: UpdateTransactionRequest) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.update(id, data);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update transaction';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteTransaction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.delete(id);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete transaction';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));

