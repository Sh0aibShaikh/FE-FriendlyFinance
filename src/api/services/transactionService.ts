import apiClient from '../client';
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionListResponse,
  TransactionSummary,
  CategoryBreakdown,
  TransactionFilters,
  ApiResponse
} from '../../types';

export const transactionService = {
  async getTransactions(filters: TransactionFilters): Promise<TransactionListResponse> {
    const params = new URLSearchParams();

    if (filters.userId) params.append('userId', filters.userId);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.type) params.append('type', filters.type);

    // Handle multiple categories - send as comma-separated string
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        params.append('category', filters.category.join(','));
      } else {
        params.append('category', filters.category);
      }
    }

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder.toString());

    const response = await apiClient.get<TransactionListResponse>(
      `/transactions?${params.toString()}`
    );
    return response.data;
  },

  async getSummary(userId: string): Promise<{ message: string; summary: TransactionSummary }> {
    const response = await apiClient.get<{ message: string; summary: TransactionSummary }>(
      `/transactions/summary/${userId}`
    );
    return response.data;
  },

  async getByCategory(userId: string): Promise<{ message: string; byCategory: CategoryBreakdown }> {
    const response = await apiClient.get<{ message: string; byCategory: CategoryBreakdown }>(
      `/transactions/by-category/${userId}`
    );
    return response.data;
  },

  async create(data: CreateTransactionRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>('/transactions', data);
    return response.data;
  },

  async update(id: string, data: UpdateTransactionRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.put<ApiResponse<any>>(`/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.delete<ApiResponse<any>>(`/transactions/${id}`);
    return response.data;
  },

  async importStatement(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('bankStatementFile', file);

    const response = await apiClient.post<ApiResponse<any>>('/transactions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

