import apiClient from '../client';
import { UpdateUserRequest, UserProfileResponse } from '../../types';

interface CurrencyResponse {
  message: string;
  user: any;
  currencyInfo?: any;
}

export const userService = {
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>(`/users/${userId}`);
    return response.data;
  },

  async updateProfile(userId: string, data: UpdateUserRequest): Promise<UserProfileResponse> {
    const response = await apiClient.put<UserProfileResponse>(`/users/${userId}`, data);
    return response.data;
  },

  async updateCurrency(userId: string, currency: string): Promise<CurrencyResponse> {
    const response = await apiClient.put<CurrencyResponse>(`/users/${userId}/currency`, { currency });
    return response.data;
  },

  async deleteAccount(userId: string): Promise<UserProfileResponse> {
    const response = await apiClient.delete<UserProfileResponse>(`/users/${userId}`);
    return response.data;
  }
};

