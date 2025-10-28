import apiClient from '../client';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../types';
import { LocalStorageKeys } from '../../constants';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const { token, user } = response.data;
    
    // Store token and user ID
    localStorage.setItem(LocalStorageKeys.AUTH_TOKEN, token);
    localStorage.setItem(LocalStorageKeys.USER_ID, user._id);
    localStorage.setItem(LocalStorageKeys.USER_DATA, JSON.stringify(user));
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem(LocalStorageKeys.AUTH_TOKEN);
    localStorage.removeItem(LocalStorageKeys.USER_ID);
    localStorage.removeItem(LocalStorageKeys.USER_DATA);
  },

  getToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.AUTH_TOKEN);
  },

  getUserId(): string | null {
    return localStorage.getItem(LocalStorageKeys.USER_ID);
  },

  getUser(): any {
    const userData = localStorage.getItem(LocalStorageKeys.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

